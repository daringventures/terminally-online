import { fetchJSON, fmtNum } from '../fetch.mjs';

const PKGS = [
  'numpy', 'pandas', 'torch', 'tensorflow', 'transformers',
  'langchain', 'openai', 'anthropic', 'fastapi', 'django',
  'flask', 'pydantic', 'requests', 'scikit-learn', 'matplotlib',
];

export async function fetch_pypi() {
  const results = [];
  for (const pkg of PKGS) {
    try {
      const data = await fetchJSON(`https://pypistats.org/api/packages/${pkg}/recent`);
      results.push({ pkg, dl: data.data?.last_week ?? 0 });
    } catch { /* skip */ }
  }
  results.sort((a, b) => b.dl - a.dl);
  return results.map((r, i) => [String(i + 1), r.pkg, fmtNum(r.dl) + '/wk']);
}
