export interface BlueskyPost {
  did: string;
  handle: string;
  text: string;
  createdAt: string;
  likes: number;
}

type JetstreamHandler = (post: BlueskyPost) => void;

export class BlueskyJetstream {
  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly posts: BlueskyPost[] = [];
  private readonly maxPosts = 100;
  private handler: JetstreamHandler | null = null;

  connect(onPost: JetstreamHandler): void {
    this.handler = onPost;
    this.open();
  }

  private open(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(
      'wss://jetstream1.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post'
    );

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string);
        if (msg.kind !== 'commit' || msg.commit?.operation !== 'create') return;
        const record = msg.commit?.record;
        if (!record?.text) return;

        const post: BlueskyPost = {
          did: msg.did ?? '',
          handle: msg.did ?? '',
          text: record.text,
          createdAt: record.createdAt ?? new Date().toISOString(),
          likes: 0,
        };

        this.posts.unshift(post);
        if (this.posts.length > this.maxPosts) this.posts.pop();
        this.handler?.(post);
      } catch { /* skip malformed messages */ }
    };

    this.ws.onclose = () => this.scheduleReconnect();
    this.ws.onerror = () => this.ws?.close();
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.open();
    }, 3000);
  }

  getRecentPosts(): readonly BlueskyPost[] {
    return this.posts;
  }

  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }
}
