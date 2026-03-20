import { fetchJSON, trunc } from '../fetch.mjs';

export async function fetch_iss() {
  const [pos, astros] = await Promise.all([
    fetchJSON('http://api.open-notify.org/iss-now.json'),
    fetchJSON('http://api.open-notify.org/astros.json'),
  ]);

  const lat = Number(pos.iss_position.latitude).toFixed(2);
  const lng = Number(pos.iss_position.longitude).toFixed(2);

  const rows = [['ISS', 'Station', `${lat},${lng}`]];

  const people = (astros.people ?? []).map(p => [
    trunc(p.name, 80),
    p.craft,
    'aboard',
  ]);

  return [...rows, ...people];
}
