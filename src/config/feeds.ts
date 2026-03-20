// ============================================================================
// TERMINALLY ONLINE — INTELLIGENCE FEED CONFIGURATION
// 500+ RSS/Atom feeds across 25+ categories
// ============================================================================

export interface FeedSource {
  url: string;
  source: string;
  category:
    | 'vc'
    | 'tech'
    | 'crypto'
    | 'culture'
    | 'security'
    | 'ai'
    | 'finance'
    | 'science'
    | 'space'
    | 'policy'
    | 'climate'
    | 'biotech'
    | 'gaming'
    | 'design'
    | 'devops'
    | 'opensource'
    | 'media'
    | 'legal'
    | 'newsletter'
    | 'ecommerce'
    | 'defense'
    | 'labor'
    | 'energy'
    | 'transport'
    | 'education'
    | 'food'
    | 'nyc'
    | 'la'
    | 'sf';
}

// ============================================================================
// VC / STARTUPS
// ============================================================================
export const VC_FEEDS: FeedSource[] = [
  { url: 'https://a16z.com/feed/', source: 'a16z', category: 'vc' },
  { url: 'https://www.sequoiacap.com/feed/', source: 'Sequoia', category: 'vc' },
  { url: 'https://review.firstround.com/feed.xml', source: 'First Round', category: 'vc' },
  { url: 'https://www.ycombinator.com/blog/rss/', source: 'YC Blog', category: 'vc' },
  { url: 'https://www.cbinsights.com/research/feed/', source: 'CB Insights', category: 'vc' },
  { url: 'https://techcrunch.com/category/venture/feed/', source: 'TC Venture', category: 'vc' },
  { url: 'https://techcrunch.com/category/startups/feed/', source: 'TC Startups', category: 'vc' },
  { url: 'https://news.crunchbase.com/feed/', source: 'Crunchbase News', category: 'vc' },
  { url: 'https://www.strictlyvc.com/feed/', source: 'StrictlyVC', category: 'vc' },
  { url: 'https://www.theinformation.com/feed', source: 'The Information', category: 'vc' },
  { url: 'https://www.newcomer.co/feed', source: 'Newcomer', category: 'vc' },
  { url: 'https://www.saastr.com/feed/', source: 'SaaStr', category: 'vc' },
  { url: 'https://tomtunguz.com/feed/', source: 'Tomasz Tunguz', category: 'vc' },
  { url: 'https://bothsidesofthetable.com/feed', source: 'Both Sides of the Table', category: 'vc' },
  { url: 'https://avc.com/feed/', source: 'AVC (Fred Wilson)', category: 'vc' },
  { url: 'https://www.bvp.com/atlas/feed', source: 'Bessemer Atlas', category: 'vc' },
  { url: 'https://blog.samaltman.com/posts.atom', source: 'Sam Altman Blog', category: 'vc' },
  { url: 'https://paulgraham.com/rss.html', source: 'Paul Graham', category: 'vc' },
  { url: 'https://www.nfx.com/feed.xml', source: 'NFX', category: 'vc' },
  { url: 'https://future.com/feed/', source: 'a16z Future', category: 'vc' },
  { url: 'https://lsvp.com/feed/', source: 'Lightspeed VP', category: 'vc' },
  { url: 'https://blog.bolt.com/feed/', source: 'Bolt Blog', category: 'vc' },
  { url: 'https://foundationcapital.com/feed/', source: 'Foundation Capital', category: 'vc' },
  { url: 'https://www.indexventures.com/feed', source: 'Index Ventures', category: 'vc' },
  { url: 'https://www.battery.com/feed/', source: 'Battery Ventures', category: 'vc' },
  { url: 'https://www.insightpartners.com/blog/feed/', source: 'Insight Partners', category: 'vc' },
];

// ============================================================================
// TECH — General Technology
// ============================================================================
export const TECH_FEEDS: FeedSource[] = [
  { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge', category: 'tech' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', source: 'Ars Technica', category: 'tech' },
  { url: 'https://www.wired.com/feed/rss', source: 'Wired', category: 'tech' },
  { url: 'https://www.technologyreview.com/feed/', source: 'MIT Tech Review', category: 'tech' },
  { url: 'https://www.platformer.news/rss/', source: 'Platformer', category: 'tech' },
  { url: 'https://www.404media.co/rss/', source: '404 Media', category: 'tech' },
  { url: 'https://restofworld.org/feed/', source: 'Rest of World', category: 'tech' },
  { url: 'https://techcrunch.com/feed/', source: 'TechCrunch', category: 'tech' },
  { url: 'https://www.engadget.com/rss.xml', source: 'Engadget', category: 'tech' },
  { url: 'https://www.zdnet.com/news/rss.xml', source: 'ZDNet', category: 'tech' },
  { url: 'https://www.cnet.com/rss/news/', source: 'CNET', category: 'tech' },
  { url: 'https://venturebeat.com/feed/', source: 'VentureBeat', category: 'tech' },
  { url: 'https://www.theregister.com/headlines.atom', source: 'The Register', category: 'tech' },
  { url: 'https://rss.slashdot.org/Slashdot/slashdotMain', source: 'Slashdot', category: 'tech' },
  { url: 'https://spectrum.ieee.org/feeds/feed.rss', source: 'IEEE Spectrum', category: 'tech' },
  { url: 'https://www.tomshardware.com/feeds/all', source: "Tom's Hardware", category: 'tech' },
  { url: 'https://www.anandtech.com/rss/', source: 'AnandTech', category: 'tech' },
  { url: 'https://stratechery.com/feed/', source: 'Stratechery', category: 'tech' },
  { url: 'https://www.ben-evans.com/benedictevans?format=rss', source: 'Benedict Evans', category: 'tech' },
  { url: 'https://daringfireball.net/feeds/main', source: 'Daring Fireball', category: 'tech' },
  { url: 'https://www.macrumors.com/macrumors.xml', source: 'MacRumors', category: 'tech' },
  { url: 'https://9to5mac.com/feed/', source: '9to5Mac', category: 'tech' },
  { url: 'https://9to5google.com/feed/', source: '9to5Google', category: 'tech' },
  { url: 'https://www.xda-developers.com/feed/', source: 'XDA', category: 'tech' },
  { url: 'https://www.androidcentral.com/feed', source: 'Android Central', category: 'tech' },
  { url: 'https://www.thurrott.com/feed', source: 'Thurrott', category: 'tech' },
  { url: 'https://www.bleepingcomputer.com/feed/', source: 'Bleeping Computer', category: 'tech' },
  { url: 'https://torrentfreak.com/feed/', source: 'TorrentFreak', category: 'tech' },
  { url: 'https://www.techdirt.com/feed/', source: 'Techdirt', category: 'tech' },
  { url: 'https://boingboing.net/feed', source: 'Boing Boing', category: 'tech' },
  { url: 'https://www.howtogeek.com/feed/', source: 'How-To Geek', category: 'tech' },
  { url: 'https://www.digitaltrends.com/feed/', source: 'Digital Trends', category: 'tech' },
  { url: 'https://www.techspot.com/backend/rss/rss.xml', source: 'TechSpot', category: 'tech' },
  { url: 'https://thenextweb.com/feed/', source: 'TNW', category: 'tech' },
  { url: 'https://www.protocol.com/feed', source: 'Protocol', category: 'tech' },
  { url: 'https://www.vice.com/en/rss', source: 'Vice', category: 'tech' },
  { url: 'https://gizmodo.com/feed', source: 'Gizmodo', category: 'tech' },
  { url: 'https://lifehacker.com/feed/rss', source: 'Lifehacker', category: 'tech' },
  { url: 'https://www.fastcompany.com/technology/rss', source: 'Fast Company Tech', category: 'tech' },
  { url: 'https://mashable.com/feeds/rss/all', source: 'Mashable', category: 'tech' },
  { url: 'https://readwrite.com/feed/', source: 'ReadWrite', category: 'tech' },
  { url: 'https://www.siliconrepublic.com/feed', source: 'Silicon Republic', category: 'tech' },
  { url: 'https://www.techradar.com/rss', source: 'TechRadar', category: 'tech' },
];

// ============================================================================
// AI / MACHINE LEARNING
// ============================================================================
export const AI_FEEDS: FeedSource[] = [
  { url: 'https://openai.com/blog/rss/', source: 'OpenAI Blog', category: 'ai' },
  { url: 'https://blog.google/technology/ai/rss/', source: 'Google AI Blog', category: 'ai' },
  { url: 'https://deepmind.google/blog/rss.xml', source: 'DeepMind', category: 'ai' },
  { url: 'https://ai.meta.com/blog/rss/', source: 'Meta AI', category: 'ai' },
  { url: 'https://huggingface.co/blog/feed.xml', source: 'Hugging Face', category: 'ai' },
  { url: 'https://www.anthropic.com/feed.xml', source: 'Anthropic', category: 'ai' },
  { url: 'https://stability.ai/feed', source: 'Stability AI', category: 'ai' },
  { url: 'https://mistral.ai/feed.xml', source: 'Mistral AI', category: 'ai' },
  { url: 'https://research.nvidia.com/rss.xml', source: 'NVIDIA Research', category: 'ai' },
  { url: 'https://www.microsoft.com/en-us/research/feed/', source: 'Microsoft Research', category: 'ai' },
  { url: 'https://machinelearningmastery.com/feed/', source: 'ML Mastery', category: 'ai' },
  { url: 'https://paperswithcode.com/latest/rss', source: 'Papers With Code', category: 'ai' },
  { url: 'https://lilianweng.github.io/index.xml', source: 'Lilian Weng', category: 'ai' },
  { url: 'https://jalammar.github.io/feed.xml', source: 'Jay Alammar', category: 'ai' },
  { url: 'https://www.ruder.io/rss/', source: 'Sebastian Ruder', category: 'ai' },
  { url: 'https://karpathy.github.io/feed.xml', source: 'Andrej Karpathy', category: 'ai' },
  { url: 'https://thegradient.pub/rss/', source: 'The Gradient', category: 'ai' },
  { url: 'https://wandb.ai/fully-connected/rss.xml', source: 'Weights & Biases', category: 'ai' },
  { url: 'https://jack-clark.net/feed/', source: 'Import AI', category: 'ai' },
  { url: 'https://www.deeplearning.ai/the-batch/feed/', source: 'The Batch', category: 'ai' },
  { url: 'https://www.alignmentforum.org/feed.xml', source: 'AI Alignment Forum', category: 'ai' },
  { url: 'https://aisnakeoil.substack.com/feed', source: 'AI Snake Oil', category: 'ai' },
  { url: 'https://www.oneusefulthing.org/feed', source: 'One Useful Thing', category: 'ai' },
  { url: 'https://simonwillison.net/atom/everything/', source: 'Simon Willison', category: 'ai' },
  { url: 'https://writings.stephenwolfram.com/feed/', source: 'Stephen Wolfram', category: 'ai' },
  { url: 'https://www.semianalysis.com/feed', source: 'SemiAnalysis', category: 'ai' },
  { url: 'https://www.chinatalk.media/feed', source: 'ChinaTalk AI', category: 'ai' },
  { url: 'https://newsletter.languagemodels.co/feed', source: 'Language Models', category: 'ai' },
  { url: 'https://www.latent.space/feed', source: 'Latent Space', category: 'ai' },
  { url: 'https://buttondown.email/ainews/rss', source: 'AI News', category: 'ai' },
  { url: 'https://lastweekin.ai/feed', source: 'Last Week in AI', category: 'ai' },
  { url: 'https://blog.eleuther.ai/rss/', source: 'EleutherAI', category: 'ai' },
  { url: 'https://www.interconnects.ai/feed', source: 'Interconnects', category: 'ai' },
  { url: 'https://magazine.sebastianraschka.com/feed', source: 'Sebastian Raschka', category: 'ai' },
  { url: 'https://minimaxir.com/rss.xml', source: 'Max Woolf', category: 'ai' },
  { url: 'https://hai.stanford.edu/news/rss.xml', source: 'Stanford HAI', category: 'ai' },
  { url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', source: 'MIT AI Review', category: 'ai' },
  { url: 'https://syncedreview.com/feed/', source: 'Synced Review', category: 'ai' },
  { url: 'https://www.marktechpost.com/feed/', source: 'MarkTechPost', category: 'ai' },
  { url: 'https://towardsdatascience.com/feed', source: 'Towards Data Science', category: 'ai' },
];

// ============================================================================
// CRYPTO / WEB3 / DEFI
// ============================================================================
export const CRYPTO_FEEDS: FeedSource[] = [
  { url: 'https://www.theblock.co/rss.xml', source: 'The Block', category: 'crypto' },
  { url: 'https://decrypt.co/feed', source: 'Decrypt', category: 'crypto' },
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk', category: 'crypto' },
  { url: 'https://rekt.news/feed.xml', source: 'Rekt News', category: 'crypto' },
  { url: 'https://cointelegraph.com/rss', source: 'CoinTelegraph', category: 'crypto' },
  { url: 'https://bitcoinmagazine.com/.rss/full/', source: 'Bitcoin Magazine', category: 'crypto' },
  { url: 'https://www.dlnews.com/feed/', source: 'DL News', category: 'crypto' },
  { url: 'https://blockworks.co/feed/', source: 'Blockworks', category: 'crypto' },
  { url: 'https://thedefiant.io/feed', source: 'The Defiant', category: 'crypto' },
  { url: 'https://www.bankless.com/feed', source: 'Bankless', category: 'crypto' },
  { url: 'https://blog.ethereum.org/feed.xml', source: 'Ethereum Foundation', category: 'crypto' },
  { url: 'https://vitalik.eth.limo/feed.xml', source: 'Vitalik Buterin', category: 'crypto' },
  { url: 'https://messari.io/rss', source: 'Messari', category: 'crypto' },
  { url: 'https://www.unchainedcrypto.com/feed/', source: 'Unchained', category: 'crypto' },
  { url: 'https://protos.com/feed/', source: 'Protos', category: 'crypto' },
  { url: 'https://www.paradigm.xyz/writing/feed.xml', source: 'Paradigm', category: 'crypto' },
  { url: 'https://a16zcrypto.com/feed/', source: 'a16z Crypto', category: 'crypto' },
  { url: 'https://newsletter.mollywhite.net/feed', source: 'Molly White', category: 'crypto' },
  { url: 'https://www.chainalysis.com/blog/feed/', source: 'Chainalysis', category: 'crypto' },
  { url: 'https://blog.chain.link/feed/', source: 'Chainlink Blog', category: 'crypto' },
  { url: 'https://solana.com/news/feed.xml', source: 'Solana News', category: 'crypto' },
  { url: 'https://polygon.technology/blog/feed/', source: 'Polygon Blog', category: 'crypto' },
  { url: 'https://www.theblockbeats.info/rss', source: 'BlockBeats', category: 'crypto' },
  { url: 'https://www.wu-talk.com/feed', source: 'Wu Blockchain', category: 'crypto' },
];

// ============================================================================
// SECURITY / INFOSEC / THREAT INTEL
// ============================================================================
export const SECURITY_FEEDS: FeedSource[] = [
  { url: 'https://krebsonsecurity.com/feed/', source: 'Krebs', category: 'security' },
  { url: 'https://www.schneier.com/feed/atom/', source: 'Schneier on Security', category: 'security' },
  { url: 'https://thehackernews.com/feeds/posts/default', source: 'The Hacker News', category: 'security' },
  { url: 'https://www.darkreading.com/rss.xml', source: 'Dark Reading', category: 'security' },
  { url: 'https://www.bleepingcomputer.com/feed/', source: 'Bleeping Computer', category: 'security' },
  { url: 'https://nakedsecurity.sophos.com/feed/', source: 'Naked Security', category: 'security' },
  { url: 'https://isc.sans.edu/rssfeed.xml', source: 'SANS ISC', category: 'security' },
  { url: 'https://blog.talosintelligence.com/feeds/posts/default', source: 'Cisco Talos', category: 'security' },
  { url: 'https://www.malwarebytes.com/blog/feed/index.xml', source: 'Malwarebytes Labs', category: 'security' },
  { url: 'https://www.welivesecurity.com/feed/', source: 'WeLiveSecurity (ESET)', category: 'security' },
  { url: 'https://www.securityweek.com/feed/', source: 'SecurityWeek', category: 'security' },
  { url: 'https://www.grahamcluley.com/feed/', source: 'Graham Cluley', category: 'security' },
  { url: 'https://danielmiessler.com/feed/', source: 'Daniel Miessler', category: 'security' },
  { url: 'https://www.troyhunt.com/rss/', source: 'Troy Hunt', category: 'security' },
  { url: 'https://googleprojectzero.blogspot.com/feeds/posts/default', source: 'Project Zero', category: 'security' },
  { url: 'https://www.us-cert.gov/ncas/alerts.xml', source: 'US-CERT Alerts', category: 'security' },
  { url: 'https://www.cisa.gov/news.xml', source: 'CISA News', category: 'security' },
  { url: 'https://www.mandiant.com/resources/blog/rss.xml', source: 'Mandiant', category: 'security' },
  { url: 'https://www.crowdstrike.com/blog/feed/', source: 'CrowdStrike', category: 'security' },
  { url: 'https://www.sentinelone.com/blog/feed/', source: 'SentinelOne', category: 'security' },
  { url: 'https://www.recordedfuture.com/feed', source: 'Recorded Future', category: 'security' },
  { url: 'https://www.zerodayinitiative.com/rss/published/', source: 'Zero Day Initiative', category: 'security' },
  { url: 'https://portswigger.net/research/rss', source: 'PortSwigger Research', category: 'security' },
  { url: 'https://www.rapid7.com/blog/feed/', source: 'Rapid7', category: 'security' },
  { url: 'https://unit42.paloaltonetworks.com/feed/', source: 'Unit 42', category: 'security' },
  { url: 'https://securelist.com/feed/', source: 'Securelist (Kaspersky)', category: 'security' },
  { url: 'https://www.elastic.co/security-labs/rss/feed.xml', source: 'Elastic Security Labs', category: 'security' },
  { url: 'https://blog.qualys.com/feed', source: 'Qualys Blog', category: 'security' },
  { url: 'https://www.volexity.com/blog/feed/', source: 'Volexity', category: 'security' },
  { url: 'https://www.reversinglabs.com/blog/rss.xml', source: 'ReversingLabs', category: 'security' },
  { url: 'https://blog.cloudflare.com/rss/', source: 'Cloudflare Blog', category: 'security' },
  { url: 'https://therecord.media/feed/', source: 'The Record', category: 'security' },
  { url: 'https://risky.biz/feeds/risky-business/', source: 'Risky Business', category: 'security' },
  { url: 'https://www.tripwire.com/state-of-security/feed', source: 'Tripwire', category: 'security' },
  { url: 'https://blog.detectify.com/feed/', source: 'Detectify', category: 'security' },
  { url: 'https://threatpost.com/feed/', source: 'Threatpost', category: 'security' },
  { url: 'https://www.exploit-db.com/rss.xml', source: 'Exploit-DB', category: 'security' },
  { url: 'https://feeds.feedburner.com/eset/blog', source: 'ESET Blog', category: 'security' },
  { url: 'https://www.cybereason.com/blog/rss.xml', source: 'Cybereason', category: 'security' },
  { url: 'https://www.huntress.com/blog/rss.xml', source: 'Huntress', category: 'security' },
];

// ============================================================================
// FINANCE / ECONOMICS / MARKETS
// ============================================================================
export const FINANCE_FEEDS: FeedSource[] = [
  { url: 'https://www.calculatedriskblog.com/feeds/posts/default', source: 'Calculated Risk', category: 'finance' },
  { url: 'https://marginalrevolution.com/feed', source: 'Marginal Revolution', category: 'finance' },
  { url: 'https://www.nakedcapitalism.com/feed', source: 'Naked Capitalism', category: 'finance' },
  { url: 'https://feeds.feedburner.com/zerohedge/feed', source: 'Zero Hedge', category: 'finance' },
  { url: 'https://www.bloomberg.com/feed/podcast', source: 'Bloomberg', category: 'finance' },
  { url: 'https://finance.yahoo.com/news/rssindex', source: 'Yahoo Finance', category: 'finance' },
  { url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', source: 'CNBC', category: 'finance' },
  { url: 'https://feeds.marketwatch.com/marketwatch/topstories/', source: 'MarketWatch', category: 'finance' },
  { url: 'https://www.economist.com/finance-and-economics/rss.xml', source: 'The Economist', category: 'finance' },
  { url: 'https://qz.com/rss', source: 'Quartz', category: 'finance' },
  { url: 'https://www.businessinsider.com/rss', source: 'Business Insider', category: 'finance' },
  { url: 'https://fortune.com/feed/', source: 'Fortune', category: 'finance' },
  { url: 'https://www.forbes.com/real-time/feed2/', source: 'Forbes', category: 'finance' },
  { url: 'https://www.investopedia.com/feedbuilder/feed/getfeed?feedName=rss_headline', source: 'Investopedia', category: 'finance' },
  { url: 'https://www.ft.com/rss/home', source: 'Financial Times', category: 'finance' },
  { url: 'https://noahpinion.substack.com/feed', source: 'Noahpinion', category: 'finance' },
  { url: 'https://www.slowboring.com/feed', source: 'Slow Boring', category: 'finance' },
  { url: 'https://silverbureau.substack.com/feed', source: 'Silver Bulletin', category: 'finance' },
  { url: 'https://mattstoller.substack.com/feed', source: 'BIG by Matt Stoller', category: 'finance' },
  { url: 'https://www.piie.com/blogs/realtime-economics/feed', source: 'PIIE RealTime Econ', category: 'finance' },
  { url: 'https://ritholtz.com/feed/', source: 'The Big Picture', category: 'finance' },
  { url: 'https://abnormalreturns.com/feed/', source: 'Abnormal Returns', category: 'finance' },
  { url: 'https://www.pragcap.com/feed/', source: 'Pragmatic Capitalism', category: 'finance' },
  { url: 'https://www.dollarcollapse.com/feed/', source: 'Dollar Collapse', category: 'finance' },
  { url: 'https://wolfstreet.com/feed/', source: 'Wolf Street', category: 'finance' },
  { url: 'https://www.nber.org/rss/new.xml', source: 'NBER Papers', category: 'finance' },
  { url: 'https://www.federalreserve.gov/feeds/press_all.xml', source: 'Federal Reserve', category: 'finance' },
  { url: 'https://libertystreeteconomics.newyorkfed.org/feed/', source: 'NY Fed Liberty St', category: 'finance' },
  { url: 'https://econbrowser.com/feed', source: 'Econbrowser', category: 'finance' },
  { url: 'https://www.econlib.org/feed/', source: 'EconLib', category: 'finance' },
  { url: 'https://conversableeconomist.com/feed/', source: 'Conversable Economist', category: 'finance' },
];

// ============================================================================
// SCIENCE
// ============================================================================
export const SCIENCE_FEEDS: FeedSource[] = [
  { url: 'https://www.nature.com/nature.rss', source: 'Nature', category: 'science' },
  { url: 'https://www.science.org/rss/news_current.xml', source: 'Science Magazine', category: 'science' },
  { url: 'https://www.scientificamerican.com/feed/', source: 'Scientific American', category: 'science' },
  { url: 'https://www.newscientist.com/feed/home/', source: 'New Scientist', category: 'science' },
  { url: 'https://phys.org/rss-feed/', source: 'Phys.org', category: 'science' },
  { url: 'https://www.sciencedaily.com/rss/all.xml', source: 'Science Daily', category: 'science' },
  { url: 'https://www.quantamagazine.org/feed/', source: 'Quanta Magazine', category: 'science' },
  { url: 'https://nautil.us/feed/', source: 'Nautilus', category: 'science' },
  { url: 'https://www.popsci.com/feed/', source: 'Popular Science', category: 'science' },
  { url: 'https://www.livescience.com/feeds/all', source: 'Live Science', category: 'science' },
  { url: 'https://www.eurekalert.org/rss/technology_engineering.xml', source: 'EurekAlert Tech', category: 'science' },
  { url: 'https://www.eurekalert.org/rss/medicine_health.xml', source: 'EurekAlert Health', category: 'science' },
  { url: 'https://www.sciencenews.org/feed', source: 'Science News', category: 'science' },
  { url: 'https://www.cell.com/cell/current.rss', source: 'Cell', category: 'science' },
  { url: 'https://www.pnas.org/action/showFeed?type=etoc&feed=rss&jc=pnas', source: 'PNAS', category: 'science' },
  { url: 'https://journals.plos.org/plosone/feed/atom', source: 'PLOS ONE', category: 'science' },
  { url: 'https://www.chemistryworld.com/rss', source: 'Chemistry World', category: 'science' },
  { url: 'https://physicstoday.scitation.org/action/showFeed?type=etoc&feed=rss&jc=pto', source: 'Physics Today', category: 'science' },
  { url: 'https://www.the-scientist.com/rss', source: 'The Scientist', category: 'science' },
  { url: 'https://www.smithsonianmag.com/rss/latest_articles/', source: 'Smithsonian Mag', category: 'science' },
  { url: 'https://www.atlasobscura.com/feeds/latest', source: 'Atlas Obscura', category: 'science' },
  { url: 'https://retractionwatch.com/feed/', source: 'Retraction Watch', category: 'science' },
];

// ============================================================================
// SPACE / AEROSPACE
// ============================================================================
export const SPACE_FEEDS: FeedSource[] = [
  { url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', source: 'NASA Breaking', category: 'space' },
  { url: 'https://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss', source: 'NASA IOTD', category: 'space' },
  { url: 'https://spacenews.com/feed/', source: 'SpaceNews', category: 'space' },
  { url: 'https://www.space.com/feeds/all', source: 'Space.com', category: 'space' },
  { url: 'https://www.planetary.org/feed', source: 'Planetary Society', category: 'space' },
  { url: 'https://spaceflightnow.com/feed/', source: 'Spaceflight Now', category: 'space' },
  { url: 'https://feeds.arstechnica.com/arstechnica/science', source: 'Ars Science/Space', category: 'space' },
  { url: 'https://www.universetoday.com/feed/', source: 'Universe Today', category: 'space' },
  { url: 'https://www.nasaspaceflight.com/feed/', source: 'NASASpaceFlight', category: 'space' },
  { url: 'https://arstechnica.com/space/feed/', source: 'Ars Space', category: 'space' },
  { url: 'https://spaceweather.com/rssnews.php', source: 'SpaceWeather', category: 'space' },
  { url: 'https://www.esa.int/rssfeed/Our_Activities/Space_Science', source: 'ESA Science', category: 'space' },
  { url: 'https://blogs.nasa.gov/spacestation/feed/', source: 'ISS Blog', category: 'space' },
  { url: 'https://www.spacepolicyonline.com/feed', source: 'Space Policy Online', category: 'space' },
  { url: 'https://parabolicarc.com/feed/', source: 'Parabolic Arc', category: 'space' },
  { url: 'https://everydayastronaut.com/feed/', source: 'Everyday Astronaut', category: 'space' },
  { url: 'https://www.skyandtelescope.org/feed/', source: 'Sky & Telescope', category: 'space' },
];

// ============================================================================
// POLICY / GOVERNMENT / GEOPOLITICS
// ============================================================================
export const POLICY_FEEDS: FeedSource[] = [
  { url: 'https://www.brookings.edu/feed/', source: 'Brookings', category: 'policy' },
  { url: 'https://www.rand.org/news.xml', source: 'RAND Corporation', category: 'policy' },
  { url: 'https://www.cfr.org/rss.xml', source: 'Council on Foreign Relations', category: 'policy' },
  { url: 'https://www.foreignaffairs.com/rss.xml', source: 'Foreign Affairs', category: 'policy' },
  { url: 'https://foreignpolicy.com/feed/', source: 'Foreign Policy', category: 'policy' },
  { url: 'https://thediplomat.com/feed/', source: 'The Diplomat', category: 'policy' },
  { url: 'https://warontherocks.com/feed/', source: 'War on the Rocks', category: 'policy' },
  { url: 'https://www.lawfaremedia.org/rss', source: 'Lawfare', category: 'policy' },
  { url: 'https://www.eff.org/rss/updates.xml', source: 'EFF', category: 'policy' },
  { url: 'https://www.propublica.org/feeds/propublica/main', source: 'ProPublica', category: 'policy' },
  { url: 'https://themarkup.org/feeds/rss.xml', source: 'The Markup', category: 'policy' },
  { url: 'https://www.justsecurity.org/feed/', source: 'Just Security', category: 'policy' },
  { url: 'https://www.bellingcat.com/feed/', source: 'Bellingcat', category: 'policy' },
  { url: 'https://www.cato.org/rss/recent-opeds.xml', source: 'Cato Institute', category: 'policy' },
  { url: 'https://carnegieendowment.org/feeds/rss', source: 'Carnegie Endowment', category: 'policy' },
  { url: 'https://www.heritage.org/rss', source: 'Heritage Foundation', category: 'policy' },
  { url: 'https://www.aei.org/feed/', source: 'AEI', category: 'policy' },
  { url: 'https://www.chathamhouse.org/rss', source: 'Chatham House', category: 'policy' },
  { url: 'https://www.iiss.org/rss', source: 'IISS', category: 'policy' },
  { url: 'https://www.crisisgroup.org/rss.xml', source: 'ICG', category: 'policy' },
  { url: 'https://www.atlanticcouncil.org/feed/', source: 'Atlantic Council', category: 'policy' },
  { url: 'https://www.wilsoncenter.org/rss.xml', source: 'Wilson Center', category: 'policy' },
  { url: 'https://www.csis.org/feed', source: 'CSIS', category: 'policy' },
  { url: 'https://theintercept.com/feed/?rss', source: 'The Intercept', category: 'policy' },
  { url: 'https://www.axios.com/feeds/feed.rss', source: 'Axios', category: 'policy' },
  { url: 'https://semafor.com/feed', source: 'Semafor', category: 'policy' },
  { url: 'https://puck.news/feed/', source: 'Puck', category: 'policy' },
  { url: 'https://www.thefp.com/feed', source: 'The Free Press', category: 'policy' },
  { url: 'https://www.stimson.org/feed/', source: 'Stimson Center', category: 'policy' },
  { url: 'https://responsiblestatecraft.org/feed/', source: 'Responsible Statecraft', category: 'policy' },
  { url: 'https://www.eurasiagroup.net/feed', source: 'Eurasia Group', category: 'policy' },
];

// ============================================================================
// CLIMATE / ENVIRONMENT
// ============================================================================
export const CLIMATE_FEEDS: FeedSource[] = [
  { url: 'https://www.carbonbrief.org/feed/', source: 'Carbon Brief', category: 'climate' },
  { url: 'https://insideclimatenews.org/feed/', source: 'Inside Climate News', category: 'climate' },
  { url: 'https://www.canarymedia.com/feed', source: 'Canary Media', category: 'climate' },
  { url: 'https://electrek.co/feed/', source: 'Electrek', category: 'climate' },
  { url: 'https://cleantechnica.com/feed/', source: 'CleanTechnica', category: 'climate' },
  { url: 'https://grist.org/feed/', source: 'Grist', category: 'climate' },
  { url: 'https://e360.yale.edu/feed', source: 'Yale E360', category: 'climate' },
  { url: 'https://www.utilitydive.com/feeds/news/', source: 'Utility Dive', category: 'climate' },
  { url: 'https://www.greentechmedia.com/feed/', source: 'GreenTech Media', category: 'climate' },
  { url: 'https://www.renewableenergyworld.com/feed/', source: 'Renewable Energy World', category: 'climate' },
  { url: 'https://www.energy-storage.news/feed/', source: 'Energy Storage News', category: 'climate' },
  { url: 'https://www.solarpowerworldonline.com/feed/', source: 'Solar Power World', category: 'climate' },
  { url: 'https://www.windpowermonthly.com/rss', source: 'Windpower Monthly', category: 'climate' },
  { url: 'https://www.theguardian.com/environment/climate-crisis/rss', source: 'Guardian Climate', category: 'climate' },
  { url: 'https://climate.nasa.gov/news/rss.xml', source: 'NASA Climate', category: 'climate' },
  { url: 'https://www.climate.gov/feeds/all', source: 'Climate.gov', category: 'climate' },
  { url: 'https://theenergymix.com/feed/', source: 'The Energy Mix', category: 'climate' },
  { url: 'https://www.desmog.com/feed/', source: 'DeSmog', category: 'climate' },
  { url: 'https://www.resilience.org/feed/', source: 'Resilience.org', category: 'climate' },
];

// ============================================================================
// BIOTECH / HEALTH / PHARMA
// ============================================================================
export const BIOTECH_FEEDS: FeedSource[] = [
  { url: 'https://www.statnews.com/feed/', source: 'STAT News', category: 'biotech' },
  { url: 'https://endpts.com/feed/', source: 'Endpoints News', category: 'biotech' },
  { url: 'https://www.biopharmadive.com/feeds/news/', source: 'BioPharma Dive', category: 'biotech' },
  { url: 'https://www.fiercebiotech.com/rss/xml', source: 'FierceBiotech', category: 'biotech' },
  { url: 'https://www.fiercepharma.com/rss/xml', source: 'FiercePharma', category: 'biotech' },
  { url: 'https://www.genomeweb.com/rss.xml', source: 'GenomeWeb', category: 'biotech' },
  { url: 'https://www.the-scientist.com/rss', source: 'The Scientist', category: 'biotech' },
  { url: 'https://www.science.org/blogs/pipeline/feed', source: 'In the Pipeline', category: 'biotech' },
  { url: 'https://www.genengnews.com/feed/', source: 'GEN News', category: 'biotech' },
  { url: 'https://www.nature.com/nbt.rss', source: 'Nature Biotech', category: 'biotech' },
  { url: 'https://www.nature.com/nm.rss', source: 'Nature Medicine', category: 'biotech' },
  { url: 'https://www.medscape.com/cx/rssfeeds/2684.xml', source: 'Medscape', category: 'biotech' },
  { url: 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml', source: 'FDA Press', category: 'biotech' },
  { url: 'https://www.who.int/feeds/entity/don/en/rss.xml', source: 'WHO Disease Outbreaks', category: 'biotech' },
  { url: 'https://tools.cdc.gov/api/v2/resources/media/403458.rss', source: 'CDC MMWR', category: 'biotech' },
  { url: 'https://www.nejm.org/action/showFeed?jc=nejm&type=etoc&feed=rss', source: 'NEJM', category: 'biotech' },
  { url: 'https://www.thelancet.com/rssfeed/lancet_current.xml', source: 'The Lancet', category: 'biotech' },
  { url: 'https://www.biorxiv.org/rss/current.xml', source: 'bioRxiv Preprints', category: 'biotech' },
  { url: 'https://www.medrxiv.org/rss/current.xml', source: 'medRxiv Preprints', category: 'biotech' },
  { url: 'https://www.drugtargetreview.com/feed/', source: 'Drug Target Review', category: 'biotech' },
];

// ============================================================================
// GAMING / ESPORTS
// ============================================================================
export const GAMING_FEEDS: FeedSource[] = [
  { url: 'https://www.ign.com/articles.rss', source: 'IGN', category: 'gaming' },
  { url: 'https://www.gamespot.com/feeds/mashup/', source: 'GameSpot', category: 'gaming' },
  { url: 'https://www.eurogamer.net/feed', source: 'Eurogamer', category: 'gaming' },
  { url: 'https://www.rockpapershotgun.com/feed', source: 'Rock Paper Shotgun', category: 'gaming' },
  { url: 'https://www.pcgamer.com/rss/', source: 'PC Gamer', category: 'gaming' },
  { url: 'https://www.destructoid.com/feed/', source: 'Destructoid', category: 'gaming' },
  { url: 'https://www.nintendolife.com/feeds/latest', source: 'Nintendo Life', category: 'gaming' },
  { url: 'https://www.pushsquare.com/feeds/latest', source: 'Push Square', category: 'gaming' },
  { url: 'https://www.vg247.com/feed', source: 'VG247', category: 'gaming' },
  { url: 'https://www.gamesindustry.biz/feed', source: 'GamesIndustry.biz', category: 'gaming' },
  { url: 'https://kotaku.com/rss', source: 'Kotaku', category: 'gaming' },
  { url: 'https://www.polygon.com/rss/index.xml', source: 'Polygon', category: 'gaming' },
  { url: 'https://www.gamesradar.com/rss/', source: 'GamesRadar', category: 'gaming' },
  { url: 'https://www.dualshockers.com/feed/', source: 'DualShockers', category: 'gaming' },
  { url: 'https://www.pcgamesn.com/mainrss.xml', source: 'PCGamesN', category: 'gaming' },
  { url: 'https://www.gamedeveloper.com/rss.xml', source: 'Game Developer', category: 'gaming' },
  { url: 'https://store.steampowered.com/feeds/newreleases.xml', source: 'Steam New Releases', category: 'gaming' },
  { url: 'https://www.pureplaystation.com/feed', source: 'Pure PlayStation', category: 'gaming' },
  { url: 'https://www.windowscentral.com/feed', source: 'Windows Central Gaming', category: 'gaming' },
];

// ============================================================================
// DESIGN / UX
// ============================================================================
export const DESIGN_FEEDS: FeedSource[] = [
  { url: 'https://alistapart.com/main/feed/', source: 'A List Apart', category: 'design' },
  { url: 'https://www.smashingmagazine.com/feed/', source: 'Smashing Magazine', category: 'design' },
  { url: 'https://css-tricks.com/feed/', source: 'CSS-Tricks', category: 'design' },
  { url: 'https://tympanus.net/codrops/feed/', source: 'Codrops', category: 'design' },
  { url: 'https://sidebar.io/feed.xml', source: 'Sidebar.io', category: 'design' },
  { url: 'https://uxdesign.cc/feed', source: 'UX Collective', category: 'design' },
  { url: 'https://www.nngroup.com/feed/rss/', source: 'Nielsen Norman', category: 'design' },
  { url: 'https://www.figma.com/blog/feed/', source: 'Figma Blog', category: 'design' },
  { url: 'https://www.designernews.co/?format=rss', source: 'Designer News', category: 'design' },
  { url: 'https://uxmovement.com/feed/', source: 'UX Movement', category: 'design' },
  { url: 'https://www.creativebloq.com/feed', source: 'Creative Bloq', category: 'design' },
  { url: 'https://dribbble.com/stories.rss', source: 'Dribbble Stories', category: 'design' },
  { url: 'https://blog.prototypr.io/feed', source: 'Prototypr', category: 'design' },
  { url: 'https://www.webdesignerdepot.com/feed/', source: 'Web Designer Depot', category: 'design' },
  { url: 'https://www.designsystems.com/feed/', source: 'Design Systems', category: 'design' },
  { url: 'https://www.invisionapp.com/inside-design/feed', source: 'InVision Blog', category: 'design' },
  { url: 'https://material.io/blog/feed.xml', source: 'Material Design Blog', category: 'design' },
];

// ============================================================================
// DEVOPS / INFRASTRUCTURE / CLOUD
// ============================================================================
export const DEVOPS_FEEDS: FeedSource[] = [
  { url: 'https://devopsish.com/index.xml', source: "DevOps'ish", category: 'devops' },
  { url: 'https://thenewstack.io/feed/', source: 'The New Stack', category: 'devops' },
  { url: 'https://www.infoq.com/feed/', source: 'InfoQ', category: 'devops' },
  { url: 'https://feeds.dzone.com/home', source: 'DZone', category: 'devops' },
  { url: 'https://www.docker.com/blog/feed/', source: 'Docker Blog', category: 'devops' },
  { url: 'https://kubernetes.io/feed.xml', source: 'Kubernetes Blog', category: 'devops' },
  { url: 'https://www.hashicorp.com/blog/feed.xml', source: 'HashiCorp Blog', category: 'devops' },
  { url: 'https://aws.amazon.com/blogs/aws/feed/', source: 'AWS Blog', category: 'devops' },
  { url: 'https://cloud.google.com/blog/rss', source: 'Google Cloud Blog', category: 'devops' },
  { url: 'https://azure.microsoft.com/en-us/blog/feed/', source: 'Azure Blog', category: 'devops' },
  { url: 'https://blog.cloudflare.com/rss/', source: 'Cloudflare', category: 'devops' },
  { url: 'https://www.fastly.com/blog/rss.xml', source: 'Fastly Blog', category: 'devops' },
  { url: 'https://www.netlify.com/blog/feed.xml', source: 'Netlify Blog', category: 'devops' },
  { url: 'https://vercel.com/blog/rss.xml', source: 'Vercel Blog', category: 'devops' },
  { url: 'https://www.digitalocean.com/blog/feed', source: 'DigitalOcean', category: 'devops' },
  { url: 'https://www.datadoghq.com/blog/feed/', source: 'Datadog Blog', category: 'devops' },
  { url: 'https://grafana.com/blog/index.xml', source: 'Grafana Blog', category: 'devops' },
  { url: 'https://www.pulumi.com/blog/rss.xml', source: 'Pulumi Blog', category: 'devops' },
  { url: 'https://fly.io/blog/feed.xml', source: 'Fly.io Blog', category: 'devops' },
  { url: 'https://blog.railway.app/feed', source: 'Railway Blog', category: 'devops' },
  { url: 'https://supabase.com/blog/rss.xml', source: 'Supabase Blog', category: 'devops' },
  { url: 'https://planetscale.com/blog/rss.xml', source: 'PlanetScale Blog', category: 'devops' },
  { url: 'https://neon.tech/blog/rss.xml', source: 'Neon Blog', category: 'devops' },
  { url: 'https://blog.turso.tech/rss.xml', source: 'Turso Blog', category: 'devops' },
  { url: 'https://upstash.com/blog/rss.xml', source: 'Upstash Blog', category: 'devops' },
];

// ============================================================================
// OPEN SOURCE
// ============================================================================
export const OPENSOURCE_FEEDS: FeedSource[] = [
  { url: 'https://github.blog/feed/', source: 'GitHub Blog', category: 'opensource' },
  { url: 'https://about.gitlab.com/atom.xml', source: 'GitLab Blog', category: 'opensource' },
  { url: 'https://opensource.com/feed', source: 'OpenSource.com', category: 'opensource' },
  { url: 'https://www.linuxfoundation.org/feed/', source: 'Linux Foundation', category: 'opensource' },
  { url: 'https://lwn.net/headlines/rss', source: 'LWN.net', category: 'opensource' },
  { url: 'https://www.phoronix.com/rss.php', source: 'Phoronix', category: 'opensource' },
  { url: 'https://itsfoss.com/feed/', source: "It's FOSS", category: 'opensource' },
  { url: 'https://blog.mozilla.org/feed/', source: 'Mozilla Blog', category: 'opensource' },
  { url: 'https://www.omglinux.com/feed', source: 'OMG Linux', category: 'opensource' },
  { url: 'https://linuxhandbook.com/feed/', source: 'Linux Handbook', category: 'opensource' },
  { url: 'https://www.rust-lang.org/feeds/releases.xml', source: 'Rust Releases', category: 'opensource' },
  { url: 'https://blog.golang.org/feed.atom', source: 'Go Blog', category: 'opensource' },
  { url: 'https://blog.python.org/feeds/posts/default', source: 'Python Blog', category: 'opensource' },
  { url: 'https://nodejs.org/en/feed/blog.xml', source: 'Node.js Blog', category: 'opensource' },
  { url: 'https://blog.rust-lang.org/feed.xml', source: 'Rust Blog', category: 'opensource' },
  { url: 'https://deno.com/blog/rss.xml', source: 'Deno Blog', category: 'opensource' },
  { url: 'https://bun.sh/blog/rss.xml', source: 'Bun Blog', category: 'opensource' },
  { url: 'https://astro.build/rss.xml', source: 'Astro Blog', category: 'opensource' },
  { url: 'https://svelte.dev/blog/rss.xml', source: 'Svelte Blog', category: 'opensource' },
  { url: 'https://blog.vuejs.org/feed.rss', source: 'Vue.js Blog', category: 'opensource' },
  { url: 'https://react.dev/blog/rss.xml', source: 'React Blog', category: 'opensource' },
  { url: 'https://angular.dev/blog/rss.xml', source: 'Angular Blog', category: 'opensource' },
  { url: 'https://nextjs.org/blog/rss.xml', source: 'Next.js Blog', category: 'opensource' },
  { url: 'https://tailwindcss.com/feeds/feed.xml', source: 'Tailwind CSS Blog', category: 'opensource' },
  { url: 'https://blog.chromium.org/feeds/posts/default', source: 'Chromium Blog', category: 'opensource' },
  { url: 'https://webkit.org/feed/', source: 'WebKit Blog', category: 'opensource' },
  { url: 'https://hacks.mozilla.org/feed/', source: 'Mozilla Hacks', category: 'opensource' },
];

// ============================================================================
// CULTURE / MEDIA / ENTERTAINMENT
// ============================================================================
export const CULTURE_FEEDS: FeedSource[] = [
  { url: 'https://www.garbageday.email/feed', source: 'Garbage Day', category: 'culture' },
  { url: 'https://defector.com/rss', source: 'Defector', category: 'culture' },
  { url: 'https://aftermath.site/rss', source: 'Aftermath', category: 'culture' },
  { url: 'https://kottke.org/index.xml', source: 'Kottke.org', category: 'culture' },
  { url: 'https://waxy.org/feed/', source: 'Waxy.org', category: 'culture' },
  { url: 'https://www.themarginalian.org/feed/', source: 'The Marginalian', category: 'culture' },
  { url: 'https://austinkleon.com/feed/', source: 'Austin Kleon', category: 'culture' },
  { url: 'https://www.openculture.com/feed', source: 'Open Culture', category: 'culture' },
  { url: 'https://www.vulture.com/rss/index.xml', source: 'Vulture', category: 'culture' },
  { url: 'https://pitchfork.com/feed/feed-news/rss', source: 'Pitchfork News', category: 'culture' },
  { url: 'https://www.rollingstone.com/feed/', source: 'Rolling Stone', category: 'culture' },
  { url: 'https://www.avclub.com/rss', source: 'The A.V. Club', category: 'culture' },
  { url: 'https://www.newyorker.com/feed/culture', source: 'New Yorker Culture', category: 'culture' },
  { url: 'https://www.theatlantic.com/feed/all/', source: 'The Atlantic', category: 'culture' },
  { url: 'https://longreads.com/feed/', source: 'Longreads', category: 'culture' },
  { url: 'https://lithub.com/feed/', source: 'Literary Hub', category: 'culture' },
  { url: 'https://www.theparisreview.org/feed/', source: 'Paris Review', category: 'culture' },
  { url: 'https://electricliterature.com/feed/', source: 'Electric Literature', category: 'culture' },
  { url: 'https://www.lrb.co.uk/feeds/rss', source: 'London Review of Books', category: 'culture' },
  { url: 'https://www.nybooks.com/feed/', source: 'NY Review of Books', category: 'culture' },
  { url: 'https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/arts/rss.xml', source: 'NYT Arts', category: 'culture' },
  { url: 'https://hyperallergic.com/feed/', source: 'Hyperallergic', category: 'culture' },
  { url: 'https://www.stereogum.com/feed/', source: 'Stereogum', category: 'culture' },
  { url: 'https://consequenceofsound.net/feed/', source: 'Consequence', category: 'culture' },
  { url: 'https://www.indiewire.com/feed/', source: 'IndieWire', category: 'culture' },
  { url: 'https://deadline.com/feed/', source: 'Deadline', category: 'culture' },
  { url: 'https://variety.com/feed/', source: 'Variety', category: 'culture' },
  { url: 'https://www.hollywoodreporter.com/feed/', source: 'Hollywood Reporter', category: 'culture' },
  { url: 'https://www.thewrap.com/feed/', source: 'TheWrap', category: 'culture' },
];

// ============================================================================
// MEDIA / JOURNALISM
// ============================================================================
export const MEDIA_FEEDS: FeedSource[] = [
  { url: 'https://www.niemanlab.org/feed/', source: 'Nieman Lab', category: 'media' },
  { url: 'https://www.cjr.org/feed', source: 'Columbia Journalism Review', category: 'media' },
  { url: 'https://www.poynter.org/feed/', source: 'Poynter', category: 'media' },
  { url: 'https://pressgazette.co.uk/feed/', source: 'Press Gazette', category: 'media' },
  { url: 'https://www.mediagazer.com/feed/', source: 'Mediagazer', category: 'media' },
  { url: 'https://www.adweek.com/feed/', source: 'Adweek', category: 'media' },
  { url: 'https://digiday.com/feed/', source: 'Digiday', category: 'media' },
  { url: 'https://www.adage.com/feed', source: 'Ad Age', category: 'media' },
  { url: 'https://www.mediapost.com/rss/', source: 'MediaPost', category: 'media' },
  { url: 'https://www.journalism.org/feed/', source: 'Pew Research Journalism', category: 'media' },
];

// ============================================================================
// LEGAL
// ============================================================================
export const LEGAL_FEEDS: FeedSource[] = [
  { url: 'https://www.scotusblog.com/feed/', source: 'SCOTUSblog', category: 'legal' },
  { url: 'https://abovethelaw.com/feed/', source: 'Above the Law', category: 'legal' },
  { url: 'https://www.lawfaremedia.org/rss', source: 'Lawfare', category: 'legal' },
  { url: 'https://reason.com/volokh/feed/', source: 'Volokh Conspiracy', category: 'legal' },
  { url: 'https://blog.ericgoldman.org/feed', source: 'Eric Goldman Tech Law', category: 'legal' },
  { url: 'https://www.techdirt.com/feed/', source: 'Techdirt', category: 'legal' },
  { url: 'https://www.eff.org/rss/updates.xml', source: 'EFF Updates', category: 'legal' },
  { url: 'https://patentlyo.com/feed', source: 'Patently-O', category: 'legal' },
  { url: 'https://copyrightalliance.org/feed/', source: 'Copyright Alliance', category: 'legal' },
  { url: 'https://www.jdsupra.com/resources/syndication/law.rss', source: 'JD Supra', category: 'legal' },
];

// ============================================================================
// NEWSLETTERS / AGGREGATORS
// ============================================================================
export const NEWSLETTER_FEEDS: FeedSource[] = [
  { url: 'https://www.lennysnewsletter.com/feed', source: "Lenny's Newsletter", category: 'newsletter' },
  { url: 'https://blog.pragmaticengineer.com/rss/', source: 'Pragmatic Engineer', category: 'newsletter' },
  { url: 'https://www.densediscovery.com/feed', source: 'Dense Discovery', category: 'newsletter' },
  { url: 'https://tldr.tech/rss', source: 'TLDR', category: 'newsletter' },
  { url: 'https://morningbrew.com/daily/rss', source: 'Morning Brew', category: 'newsletter' },
  { url: 'https://thehustle.co/feed/', source: 'The Hustle', category: 'newsletter' },
  { url: 'https://www.ben-evans.com/benedictevans?format=rss', source: 'Benedict Evans', category: 'newsletter' },
  { url: 'https://charity.wtf/feed/', source: 'Charity Majors', category: 'newsletter' },
  { url: 'https://blog.codinghorror.com/rss/', source: 'Coding Horror', category: 'newsletter' },
  { url: 'https://martinfowler.com/feed.atom', source: 'Martin Fowler', category: 'newsletter' },
  { url: 'https://jamesclear.com/feed', source: 'James Clear', category: 'newsletter' },
  { url: 'https://waitbutwhy.com/feed', source: 'Wait But Why', category: 'newsletter' },
  { url: 'https://www.notboring.co/feed', source: 'Not Boring', category: 'newsletter' },
  { url: 'https://every.to/feed.rss', source: 'Every', category: 'newsletter' },
  { url: 'https://www.milkroad.com/feed', source: 'Milk Road', category: 'newsletter' },
  { url: 'https://www.dailyupside.com/feed/', source: 'Daily Upside', category: 'newsletter' },
  { url: 'https://www.exec-sum.com/feed', source: 'Exec Sum', category: 'newsletter' },
  { url: 'https://www.readthegeneralist.com/feed', source: 'The Generalist', category: 'newsletter' },
  { url: 'https://fs.blog/feed/', source: 'Farnam Street', category: 'newsletter' },
  { url: 'https://www.worksinprogress.co/feed', source: 'Works in Progress', category: 'newsletter' },
  { url: 'https://www.construction-physics.com/feed', source: 'Construction Physics', category: 'newsletter' },
  { url: 'https://www.astralcodexten.com/feed', source: 'Astral Codex Ten', category: 'newsletter' },
  { url: 'https://danluu.com/atom.xml', source: 'Dan Luu', category: 'newsletter' },
  { url: 'https://jvns.ca/atom.xml', source: 'Julia Evans', category: 'newsletter' },
  { url: 'https://rachelbythebay.com/w/atom.xml', source: 'Rachel by the Bay', category: 'newsletter' },
  { url: 'https://blog.samaltman.com/posts.atom', source: 'Sam Altman', category: 'newsletter' },
];

// ============================================================================
// E-COMMERCE / RETAIL
// ============================================================================
export const ECOMMERCE_FEEDS: FeedSource[] = [
  { url: 'https://www.retaildive.com/feeds/news/', source: 'Retail Dive', category: 'ecommerce' },
  { url: 'https://www.modernretail.co/feed/', source: 'Modern Retail', category: 'ecommerce' },
  { url: 'https://www.digitalcommerce360.com/feed/', source: 'Digital Commerce 360', category: 'ecommerce' },
  { url: 'https://www.practicalecommerce.com/feed', source: 'Practical Ecommerce', category: 'ecommerce' },
  { url: 'https://www.grocerydive.com/feeds/news/', source: 'Grocery Dive', category: 'ecommerce' },
  { url: 'https://www.supplychaindive.com/feeds/news/', source: 'Supply Chain Dive', category: 'ecommerce' },
  { url: 'https://www.supplychainbrain.com/rss', source: 'Supply Chain Brain', category: 'ecommerce' },
  { url: 'https://www.freightwaves.com/feed', source: 'FreightWaves', category: 'ecommerce' },
  { url: 'https://www.logisticsmgmt.com/rss', source: 'Logistics Management', category: 'ecommerce' },
];

// ============================================================================
// DEFENSE / MILITARY / INTELLIGENCE
// ============================================================================
export const DEFENSE_FEEDS: FeedSource[] = [
  { url: 'https://www.defensenews.com/arc/outboundfeeds/rss/', source: 'Defense News', category: 'defense' },
  { url: 'https://breakingdefense.com/feed/', source: 'Breaking Defense', category: 'defense' },
  { url: 'https://www.janes.com/feeds/news', source: 'Janes', category: 'defense' },
  { url: 'https://www.defenseonline.com/feed/', source: 'Defense Online', category: 'defense' },
  { url: 'https://www.thedrive.com/the-war-zone/feed', source: 'The War Zone', category: 'defense' },
  { url: 'https://www.c4isrnet.com/arc/outboundfeeds/rss/', source: 'C4ISRNet', category: 'defense' },
  { url: 'https://www.militarytimes.com/arc/outboundfeeds/rss/', source: 'Military Times', category: 'defense' },
  { url: 'https://www.armscontrol.org/taxonomy/term/20/feed', source: 'Arms Control Assoc.', category: 'defense' },
  { url: 'https://www.airandspaceforces.com/feed/', source: 'Air & Space Forces', category: 'defense' },
  { url: 'https://news.usni.org/feed', source: 'USNI News', category: 'defense' },
  { url: 'https://www.stripes.com/rss', source: 'Stars & Stripes', category: 'defense' },
  { url: 'https://www.globalsecurity.org/globalsecurity-org.xml', source: 'Global Security', category: 'defense' },
];

// ============================================================================
// LABOR / WORK / ECONOMY
// ============================================================================
export const LABOR_FEEDS: FeedSource[] = [
  { url: 'https://www.bls.gov/feed/bls_latest.rss', source: 'Bureau of Labor Stats', category: 'labor' },
  { url: 'https://www.hrdive.com/feeds/news/', source: 'HR Dive', category: 'labor' },
  { url: 'https://hbr.org/feed', source: 'Harvard Business Review', category: 'labor' },
  { url: 'https://www.shrm.org/rss/pages/rss.aspx', source: 'SHRM', category: 'labor' },
  { url: 'https://www.fastcompany.com/work-life/rss', source: 'Fast Company Work', category: 'labor' },
  { url: 'https://www.wired.com/category/business/feed', source: 'Wired Business', category: 'labor' },
  { url: 'https://www.levels.fyi/blog/rss.xml', source: 'Levels.fyi Blog', category: 'labor' },
  { url: 'https://layoffs.fyi/feed/', source: 'Layoffs.fyi', category: 'labor' },
  { url: 'https://www.glassdoor.com/blog/feed/', source: 'Glassdoor Blog', category: 'labor' },
];

// ============================================================================
// ENERGY
// ============================================================================
export const ENERGY_FEEDS: FeedSource[] = [
  { url: 'https://www.eia.gov/rss/todayinenergy.xml', source: 'EIA Today in Energy', category: 'energy' },
  { url: 'https://oilprice.com/rss/main', source: 'OilPrice.com', category: 'energy' },
  { url: 'https://www.rigzone.com/news/rss/rigzone_latest.aspx', source: 'Rigzone', category: 'energy' },
  { url: 'https://www.utilitydive.com/feeds/news/', source: 'Utility Dive', category: 'energy' },
  { url: 'https://www.powermag.com/feed/', source: 'POWER Magazine', category: 'energy' },
  { url: 'https://www.energymonitor.ai/feed/', source: 'Energy Monitor', category: 'energy' },
  { url: 'https://www.spglobal.com/commodityinsights/en/rss-feed', source: 'S&P Global Commodity', category: 'energy' },
  { url: 'https://www.iea.org/rss/news.xml', source: 'IEA News', category: 'energy' },
  { url: 'https://www.world-nuclear-news.org/rss', source: 'World Nuclear News', category: 'energy' },
  { url: 'https://nuclearnewswire.com/feed/', source: 'Nuclear Newswire', category: 'energy' },
];

// ============================================================================
// TRANSPORT / AUTO / MOBILITY
// ============================================================================
export const TRANSPORT_FEEDS: FeedSource[] = [
  { url: 'https://jalopnik.com/rss', source: 'Jalopnik', category: 'transport' },
  { url: 'https://www.thedrive.com/feed', source: 'The Drive', category: 'transport' },
  { url: 'https://electrek.co/feed/', source: 'Electrek', category: 'transport' },
  { url: 'https://insideevs.com/rss/', source: 'InsideEVs', category: 'transport' },
  { url: 'https://www.autoblog.com/rss.xml', source: 'Autoblog', category: 'transport' },
  { url: 'https://www.caranddriver.com/rss/all.xml/', source: 'Car & Driver', category: 'transport' },
  { url: 'https://www.motortrend.com/feed/', source: 'MotorTrend', category: 'transport' },
  { url: 'https://www.aviationweek.com/rss', source: 'Aviation Week', category: 'transport' },
  { url: 'https://www.flightglobal.com/rss', source: 'FlightGlobal', category: 'transport' },
  { url: 'https://www.railwayage.com/feed/', source: 'Railway Age', category: 'transport' },
  { url: 'https://www.masstransitmag.com/rss', source: 'Mass Transit', category: 'transport' },
  { url: 'https://usa.streetsblog.org/feed/', source: 'Streetsblog USA', category: 'transport' },
  { url: 'https://nyc.streetsblog.org/feed/', source: 'Streetsblog NYC', category: 'transport' },
  { url: 'https://www.curbed.com/rss/index.xml', source: 'Curbed', category: 'transport' },
];

// ============================================================================
// EDUCATION / EDTECH
// ============================================================================
export const EDUCATION_FEEDS: FeedSource[] = [
  { url: 'https://www.edsurge.com/feed', source: 'EdSurge', category: 'education' },
  { url: 'https://www.educationdive.com/feeds/news/', source: 'Education Dive', category: 'education' },
  { url: 'https://www.insidehighered.com/rss.xml', source: 'Inside Higher Ed', category: 'education' },
  { url: 'https://www.chronicle.com/section/News/rss', source: 'Chronicle Higher Ed', category: 'education' },
  { url: 'https://www.the74million.org/feed/', source: 'The 74', category: 'education' },
  { url: 'https://hackeducation.com/feed.xml', source: 'Hack Education', category: 'education' },
  { url: 'https://www.educationnext.org/feed/', source: 'Education Next', category: 'education' },
];

// ============================================================================
// FOOD / AGRICULTURE
// ============================================================================
export const FOOD_FEEDS: FeedSource[] = [
  { url: 'https://www.eater.com/rss/index.xml', source: 'Eater', category: 'food' },
  { url: 'https://thecounter.org/feed/', source: 'The Counter', category: 'food' },
  { url: 'https://www.fooddive.com/feeds/news/', source: 'Food Dive', category: 'food' },
  { url: 'https://civileats.com/feed/', source: 'Civil Eats', category: 'food' },
  { url: 'https://www.foodsafetynews.com/feed/', source: 'Food Safety News', category: 'food' },
  { url: 'https://newfoodeconomy.org/feed/', source: 'New Food Economy', category: 'food' },
  { url: 'https://www.agweb.com/rss.xml', source: 'AgWeb', category: 'food' },
  { url: 'https://www.dtnpf.com/agriculture/web/ag/news/rss', source: 'DTN Agriculture', category: 'food' },
  { url: 'https://modernfarmer.com/feed/', source: 'Modern Farmer', category: 'food' },
  { url: 'https://seriouseats.com/feed', source: 'Serious Eats', category: 'food' },
  { url: 'https://www.bonappetit.com/feed/rss', source: 'Bon Appetit', category: 'food' },
  { url: 'https://www.epicurious.com/feed/rss', source: 'Epicurious', category: 'food' },
  // Pornhub Insights is a WordPress blog — has a proper RSS feed
  { url: 'https://www.pornhub.com/insights/feed', source: 'Pornhub Insights', category: 'culture' },
];

// ============================================================================
// NYC — Hyper-Local New York City Intelligence
// ============================================================================
export const NYC_FEEDS: FeedSource[] = [
  { url: 'https://nyc.streetsblog.org/feed/', source: 'Streetsblog NYC', category: 'nyc' },
  { url: 'https://gothamist.com/feed', source: 'Gothamist', category: 'nyc' },
  { url: 'https://www.thecity.nyc/feed/', source: 'THE CITY', category: 'nyc' },
  { url: 'https://www.curbed.com/rss/index.xml', source: 'Curbed', category: 'nyc' },
  { url: 'https://www.amny.com/feed/', source: 'amNewYork', category: 'nyc' },
  { url: 'https://www.crainsnewyork.com/feed', source: "Crain's NY", category: 'nyc' },
  { url: 'https://www.brownstoner.com/feed/', source: 'Brownstoner', category: 'nyc' },
  { url: 'https://evgrieve.com/feeds/posts/default', source: 'EV Grieve', category: 'nyc' },
  { url: 'https://www.boweryboogie.com/feed/', source: 'Bowery Boogie', category: 'nyc' },
  { url: 'https://hellgatenyc.com/feed', source: 'Hell Gate', category: 'nyc' },
  { url: 'https://www.politico.com/rss/politiconewyork.xml', source: 'Politico NY', category: 'nyc' },
  { url: 'https://www.cityandstateny.com/feed/', source: 'City & State NY', category: 'nyc' },
  { url: 'https://commercialobserver.com/feed/', source: 'Commercial Observer', category: 'nyc' },
  { url: 'https://therealdeal.com/feed/', source: 'The Real Deal', category: 'nyc' },
  { url: 'https://patch.com/new-york/new-york-city/rss.xml', source: 'Patch NYC', category: 'nyc' },
  { url: 'https://www.6sqft.com/feed/', source: '6sqft', category: 'nyc' },
  { url: 'https://secretnyc.co/feed/', source: 'Secret NYC', category: 'nyc' },
  { url: 'https://untappedcities.com/feed/', source: 'Untapped Cities', category: 'nyc' },
];

// ============================================================================
// LOS ANGELES
// ============================================================================
export const LA_FEEDS: FeedSource[] = [
  { url: 'https://laist.com/feed', source: 'LAist', category: 'la' },
  { url: 'https://www.latimes.com/local/rss2.0.xml', source: 'LA Times Local', category: 'la' },
  { url: 'https://www.latimes.com/entertainment-arts/rss2.0.xml', source: 'LA Times Entertainment', category: 'la' },
  { url: 'https://www.latimes.com/business/technology/rss2.0.xml', source: 'LA Times Tech', category: 'la' },
  { url: 'https://la.curbed.com/rss/index.xml', source: 'Curbed LA', category: 'la' },
  { url: 'https://www.theeastsiderla.com/feed/', source: 'Eastsider LA', category: 'la' },
  { url: 'https://ladowntownnews.com/feed/', source: 'LA Downtown News', category: 'la' },
  { url: 'https://losangeles.cbslocal.com/feed/', source: 'CBS LA', category: 'la' },
  { url: 'https://abc7.com/feed/', source: 'ABC7 LA', category: 'la' },
  { url: 'https://www.dailynews.com/feed/', source: 'LA Daily News', category: 'la' },
  { url: 'https://www.pasadenastarnews.com/feed/', source: 'Pasadena Star-News', category: 'la' },
  { url: 'https://dot.la/feed', source: 'dot.LA', category: 'la' },
  { url: 'https://www.lamag.com/feed/', source: 'Los Angeles Magazine', category: 'la' },
  { url: 'https://knock-la.com/feed/', source: 'Knock LA', category: 'la' },
  { url: 'https://www.lacitybeat.com/feed/', source: 'LA City Beat', category: 'la' },
  { url: 'https://losangeles.eater.com/rss/index.xml', source: 'Eater LA', category: 'la' },
  { url: 'https://la.streetsblog.org/feed/', source: 'Streetsblog LA', category: 'la' },
  { url: 'https://thesource.metro.net/feed/', source: 'LA Metro Source', category: 'la' },
  { url: 'https://www.hollywoodreporter.com/feed/', source: 'Hollywood Reporter', category: 'la' },
  { url: 'https://deadline.com/feed/', source: 'Deadline Hollywood', category: 'la' },
  { url: 'https://variety.com/feed/', source: 'Variety', category: 'la' },
  { url: 'https://www.kcrw.com/news/feed', source: 'KCRW News', category: 'la' },
];

// ============================================================================
// SAN FRANCISCO / SILICON VALLEY / BAY AREA
// ============================================================================
export const SF_FEEDS: FeedSource[] = [
  { url: 'https://sfist.com/feed/', source: 'SFist', category: 'sf' },
  { url: 'https://www.sfchronicle.com/local/feed/', source: 'SF Chronicle', category: 'sf' },
  { url: 'https://www.sfgate.com/feed/sfgFeed.xml', source: 'SFGate', category: 'sf' },
  { url: 'https://missionlocal.org/feed/', source: 'Mission Local', category: 'sf' },
  { url: 'https://www.sfexaminer.com/feed/', source: 'SF Examiner', category: 'sf' },
  { url: 'https://sf.curbed.com/rss/index.xml', source: 'Curbed SF', category: 'sf' },
  { url: 'https://sf.eater.com/rss/index.xml', source: 'Eater SF', category: 'sf' },
  { url: 'https://sf.streetsblog.org/feed/', source: 'Streetsblog SF', category: 'sf' },
  { url: 'https://www.bizjournals.com/sanfrancisco/feed/rss', source: 'SF Biz Journal', category: 'sf' },
  { url: 'https://www.mercurynews.com/feed/', source: 'Mercury News', category: 'sf' },
  { url: 'https://sanjosespotlight.com/feed/', source: 'San Jose Spotlight', category: 'sf' },
  { url: 'https://www.siliconvalley.com/feed/', source: 'Silicon Valley News', category: 'sf' },
  { url: 'https://paloaltoonline.com/feed/', source: 'Palo Alto Online', category: 'sf' },
  { url: 'https://www.almanacnews.com/feed/', source: 'Almanac News (Menlo Park)', category: 'sf' },
  { url: 'https://www.mv-voice.com/feed/', source: 'Mountain View Voice', category: 'sf' },
  { url: 'https://patch.com/california/san-francisco/rss.xml', source: 'Patch SF', category: 'sf' },
  { url: 'https://hoodline.com/feed', source: 'Hoodline SF', category: 'sf' },
  { url: 'https://48hills.org/feed/', source: '48 Hills', category: 'sf' },
  { url: 'https://www.kqed.org/news/feed', source: 'KQED News', category: 'sf' },
  { url: 'https://www.bizjournals.com/sanjose/feed/rss', source: 'Silicon Valley Biz Journal', category: 'sf' },
  { url: 'https://techcrunch.com/tag/san-francisco/feed/', source: 'TC San Francisco', category: 'sf' },
  { url: 'https://www.protocol.com/bulletins/feed', source: 'Protocol Bulletins', category: 'sf' },
];

// ============================================================================
// COMBINE ALL FEEDS
// ============================================================================
export const ALL_FEEDS: FeedSource[] = [
  ...VC_FEEDS,
  ...TECH_FEEDS,
  ...AI_FEEDS,
  ...CRYPTO_FEEDS,
  ...SECURITY_FEEDS,
  ...FINANCE_FEEDS,
  ...SCIENCE_FEEDS,
  ...SPACE_FEEDS,
  ...POLICY_FEEDS,
  ...CLIMATE_FEEDS,
  ...BIOTECH_FEEDS,
  ...GAMING_FEEDS,
  ...DESIGN_FEEDS,
  ...DEVOPS_FEEDS,
  ...OPENSOURCE_FEEDS,
  ...CULTURE_FEEDS,
  ...MEDIA_FEEDS,
  ...LEGAL_FEEDS,
  ...NEWSLETTER_FEEDS,
  ...ECOMMERCE_FEEDS,
  ...DEFENSE_FEEDS,
  ...LABOR_FEEDS,
  ...ENERGY_FEEDS,
  ...TRANSPORT_FEEDS,
  ...EDUCATION_FEEDS,
  ...FOOD_FEEDS,
  ...NYC_FEEDS,
  ...LA_FEEDS,
  ...SF_FEEDS,
];

// Feed count by category for dashboard display
export const FEED_COUNTS = {
  vc: VC_FEEDS.length,
  tech: TECH_FEEDS.length,
  ai: AI_FEEDS.length,
  crypto: CRYPTO_FEEDS.length,
  security: SECURITY_FEEDS.length,
  finance: FINANCE_FEEDS.length,
  science: SCIENCE_FEEDS.length,
  space: SPACE_FEEDS.length,
  policy: POLICY_FEEDS.length,
  climate: CLIMATE_FEEDS.length,
  biotech: BIOTECH_FEEDS.length,
  gaming: GAMING_FEEDS.length,
  design: DESIGN_FEEDS.length,
  devops: DEVOPS_FEEDS.length,
  opensource: OPENSOURCE_FEEDS.length,
  culture: CULTURE_FEEDS.length,
  media: MEDIA_FEEDS.length,
  legal: LEGAL_FEEDS.length,
  newsletter: NEWSLETTER_FEEDS.length,
  ecommerce: ECOMMERCE_FEEDS.length,
  defense: DEFENSE_FEEDS.length,
  labor: LABOR_FEEDS.length,
  energy: ENERGY_FEEDS.length,
  transport: TRANSPORT_FEEDS.length,
  education: EDUCATION_FEEDS.length,
  food: FOOD_FEEDS.length,
  nyc: NYC_FEEDS.length,
  la: LA_FEEDS.length,
  sf: SF_FEEDS.length,
  total: 0, // computed below
};
FEED_COUNTS.total = ALL_FEEDS.length;
