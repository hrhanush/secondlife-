import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, useFetch } from '../api.js';
import ItemTag from '../components/ItemTag.jsx';
import { Empty, ErrorBox, Loading } from '../components/States.jsx';
import { CATEGORIES } from '../constants.js';

export default function Requests() {
  const [category, setCategory] = useState('');
  const { data, error, loading, reload } = useFetch(() => api.list('requests', { category, limit: 24 }), [category]);
  return (
    <div className="wrap page">
      <div className="page-head">
        <h1>What neighbours are looking for</h1>
        <Link className="btn" to="/requests/new">Ask for an item</Link>
      </div>
      <p className="muted">Got something on this list? Open a request, then contact the person directly.</p>
      <div className="chip-scroll" role="group" aria-label="Category">
        <button className={`pill ${!category ? 'on' : ''}`} onClick={() => setCategory('')}>All</button>
        {CATEGORIES.map((c) => <button key={c.id} className={`pill ${category === c.id ? 'on' : ''}`} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>{c.icon} {c.label}</button>)}
      </div>
      {loading ? <Loading /> : error ? <ErrorBox error={error} retry={reload} /> : data.data.length === 0 ? (
        <Empty title="No open requests" text="Need something? Post a request and we’ll show you matching listings straight away."><Link className="btn" to="/requests/new">Ask for an item</Link></Empty>
      ) : <div className="grid">{data.data.map((r) => <ItemTag key={r._id} item={r} kind="requests" />)}</div>}
    </div>
  );
}
