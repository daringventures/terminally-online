import { fetchJSON, fmtNum } from '../fetch.mjs';

const PKGS = [
  'react', 'next', 'vue', 'svelte', 'angular', 'typescript', 'vite',
  'esbuild', 'tailwindcss', 'ai', 'langchain', 'drizzle-orm', 'prisma',
  'hono', 'express', 'fastify', 'zod', 'effect', 'bun',
];

export async function fetch_npm() {
  const res = await fetchJSON(
    `https://api.npmjs.org/downloads/point/last-week/${PKGS.filter(p => !p.startsWith('@')).join(',')}`
  );
  const rows = Object.entries(res)
    .filter(([, v]) => v)
    .map(([pkg, v]) => ({ pkg, dl: v.downloads }))
    .sort((a, b) => b.dl - a.dl);
  return rows.map((r, i) => [String(i + 1), r.pkg, fmtNum(r.dl) + '/wk']);
}
