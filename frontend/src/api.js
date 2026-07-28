const BASE = '/api';

export async function getFilms(params = {}) {
  const q = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
  );
  const res = await fetch(`${BASE}/films?${q}`);
  if (!res.ok) throw new Error('Failed to fetch films');
  return res.json();
}

export async function getFilm(id) {
  const res = await fetch(`${BASE}/films/${id}`);
  if (!res.ok) throw new Error('Failed to fetch film');
  return res.json();
}

export async function setWatched(id, watched) {
  const res = await fetch(`${BASE}/films/${id}/watched`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ watched }),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${BASE}/films/stats/summary`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function startSync() {
  const res = await fetch(`${BASE}/sync`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to start sync');
  return res.json();
}

export async function getSyncStatus() {
  const res = await fetch(`${BASE}/sync/status`);
  if (!res.ok) throw new Error('Failed to fetch sync status');
  return res.json();
}
