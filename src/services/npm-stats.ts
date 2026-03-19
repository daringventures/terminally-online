export interface PackageDownloads {
  package: string;
  downloads: number;
  start: string;
  end: string;
}

const TRACKED_PACKAGES = [
  'react', 'next', 'vue', 'svelte', 'angular',
  'typescript', 'vite', 'esbuild', 'bun',
  'tailwindcss', 'shadcn-ui',
  'ai', '@ai-sdk/openai', '@ai-sdk/anthropic',
  'langchain', '@langchain/core',
  'drizzle-orm', 'prisma',
  'hono', 'express', 'fastify',
  'zod', 'effect',
];

export async function fetchNpmDownloads(): Promise<PackageDownloads[]> {
  // npm bulk endpoint: up to 128 scoped + unscoped packages
  const unscoped = TRACKED_PACKAGES.filter((p) => !p.startsWith('@'));
  const scoped = TRACKED_PACKAGES.filter((p) => p.startsWith('@'));

  const results: PackageDownloads[] = [];

  // Bulk fetch unscoped
  if (unscoped.length) {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${unscoped.join(',')}`
    );
    if (res.ok) {
      const data = await res.json() as Record<string, { downloads: number; start: string; end: string; package: string } | null>;
      for (const [pkg, info] of Object.entries(data)) {
        if (info) {
          results.push({
            package: pkg,
            downloads: info.downloads,
            start: info.start,
            end: info.end,
          });
        }
      }
    }
  }

  // Fetch scoped packages individually (bulk doesn't support @ packages)
  for (const pkg of scoped) {
    try {
      const res = await fetch(
        `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(pkg)}`
      );
      if (res.ok) {
        const info = await res.json() as { downloads: number; start: string; end: string; package: string };
        results.push({
          package: pkg,
          downloads: info.downloads,
          start: info.start,
          end: info.end,
        });
      }
    } catch { /* skip failed scoped packages */ }
  }

  results.sort((a, b) => b.downloads - a.downloads);
  return results;
}
