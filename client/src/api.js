import { useCallback, useEffect, useState } from 'react';

const BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(message, status, details) { super(message); this.status = status; this.details = details; }
}

async function call(path, { method = 'GET', body, key } = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(key && { 'x-edit-key': key }) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0);
  }
  if (res.status === 204) return null;
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(json.error?.message || 'Request failed', res.status, json.error?.details);
  return json;
}

const qs = (params) => {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v && p.set(k, v));
  const s = p.toString();
  return s ? `?${s}` : '';
};

export const api = {
  stats: () => call('/stats'),
  list: (kind, params = {}) => call(`/${kind}${qs(params)}`),
  get: (kind, id) => call(`/${kind}/${id}`),
  matches: (kind, id) => call(`/${kind}/${id}/matches`),
  create: (kind, body) => call(`/${kind}`, { method: 'POST', body }),
  setStatus: (kind, id, status, key) => call(`/${kind}/${id}/status`, { method: 'PATCH', body: { status }, key }),
  remove: (kind, id, key) => call(`/${kind}/${id}`, { method: 'DELETE', key }),
};

// Edit keys live only in this browser, so only the poster can manage a post.
const KEYS = 'secondlife_keys';
const readKeys = () => { try { return JSON.parse(localStorage.getItem(KEYS)) || {}; } catch { return {}; } };
export const saveKey = (kind, id, key) => {
  try { localStorage.setItem(KEYS, JSON.stringify({ ...readKeys(), [`${kind}:${id}`]: key })); } catch { /* storage unavailable */ }
};
export const getKey = (kind, id) => readKeys()[`${kind}:${id}`];
export const dropKey = (kind, id) => {
  const k = readKeys(); delete k[`${kind}:${id}`];
  try { localStorage.setItem(KEYS, JSON.stringify(k)); } catch { /* ignore */ }
};

export function useFetch(fn, deps) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);
  const load = useCallback(() => {
    let live = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    run().then((r) => live && setState({ data: r, error: null, loading: false }))
      .catch((e) => live && setState({ data: null, error: e, loading: false }));
    return () => { live = false; };
  }, [run]);
  useEffect(load, [load]);
  return { ...state, reload: load };
}
