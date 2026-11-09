import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, useFetch } from '../api.js';
import ItemTag from '../components/ItemTag.jsx';
import { Empty, ErrorBox, Loading } from '../components/States.jsx';
import { CATEGORIES } from '../constants.js';

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const type = params.get('type') || '';
  const city = params.get('city') || '';
  const page = params.get('page') || '1';
  const [search, setSearch] = useState(q);
  const [cityText, setCityText] = useState(city);

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries({ page: '1', ...patch }).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: true });
  };

  // debounce the free-text filters
  useEffect(() => { const t = setTimeout(() => search !== q && update({ q: search }), 350); return () => clearTimeout(t); }, [search]); // eslint-disable-line
  useEffect(() => { const t = setTimeout(() => cityText !== city && update({ city: cityText }), 350); return () => clearTimeout(t); }, [cityText]); // eslint-disable-line

  const { data, error, loading, reload } = useFetch(() => api.list('listings', { q, category, type, city, page, limit: 12 }), [q, category, type, city, page]);
  const clear = () => { setSearch(''); setCityText(''); setParams({}, { replace: true }); };
  const filtered = q || category || type || city;

  return (
    <div className="wrap page">
      <div className="page-head">
        <h1>Items available near you</h1>
        <Link className="btn" to="/items/new">Give something</Link>
      </div>

      <div className="filters">
        <input type="search" placeholder="Search items or areas" aria-label="Search items" value={search} onChange={(e) => setSearch(e.target.value)} />
        <input type="text" placeholder="City" aria-label="City" value={cityText} onChange={(e) => setCityText(e.target.value)} />
        <select aria-label="Gift or swap" value={type} onChange={(e) => update({ type: e.target.value })}>
          <option value="">Gift and swap</option><option value="gift">Free gifts</option><option value="swap">Swaps</option>
        </select>
      </div>
      <div className="chip-scroll" role="group" aria-label="Category">
        <button className={`pill ${!category ? 'on' : ''}`} onClick={() => update({ category: '' })}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`pill ${category === c.id ? 'on' : ''}`} aria-pressed={category === c.id} onClick={() => update({ category: c.id })}>{c.icon} {c.label}</button>
        ))}
      </div>

      {loading ? <Loading /> : error ? <ErrorBox error={error} retry={reload} /> : data.data.length === 0 ? (
        <Empty title={filtered ? 'No items match these filters' : 'No items listed yet'} text={filtered ? 'Try a different category or city, or post a request so neighbours can find you.' : 'Be the first to list something.'}>
          <div className="row center">{filtered && <button className="btn ghost" onClick={clear}>Clear filters</button>}<Link className="btn" to="/requests/new">Ask for an item</Link></div>
        </Empty>
      ) : (
        <>
          <p className="muted" aria-live="polite">{data.total} item{data.total !== 1 && 's'} found</p>
          <div className="grid">{data.data.map((i) => <ItemTag key={i._id} item={i} kind="listings" />)}</div>
          {data.pages > 1 && (
            <div className="pager">
              <button className="btn ghost small" disabled={data.page <= 1} onClick={() => update({ page: String(data.page - 1) })}>Previous</button>
              <span>Page {data.page} of {data.pages}</span>
              <button className="btn ghost small" disabled={data.page >= data.pages} onClick={() => update({ page: String(data.page + 1) })}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
