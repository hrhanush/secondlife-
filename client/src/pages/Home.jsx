import { Link } from 'react-router-dom';
import { api, useFetch } from '../api.js';
import ItemTag from '../components/ItemTag.jsx';
import { Loading } from '../components/States.jsx';
import { CATEGORIES } from '../constants.js';

export default function Home() {
  const stats = useFetch(() => api.stats(), []);
  const recent = useFetch(() => api.list('listings', { limit: 6 }), []);
  const s = stats.data?.data;
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>Someone nearby needs what you’re about to throw out.</h1>
            <p className="lead">Give away, swap or ask for furniture, books and household things. SecondLife matches every request with listings in the same category and neighbourhood.</p>
            <div className="row">
              <Link className="btn big" to="/items/new">Give something away</Link>
              <Link className="btn big ghost" to="/requests/new">Ask for an item</Link>
            </div>
            {s && (
              <p className="hero-stats">
                <strong>{s.available}</strong> items free now, <strong>{s.openRequests}</strong> open requests, <strong>{s.claimed}</strong> items already rehomed.
              </p>
            )}
          </div>
          <div className="match-demo" aria-hidden="true">
            <div className="demo-tag ask"><span className="tag-hole" /><small>Request</small><b>Study desk for a PG room</b><span>Indiranagar, 560038</span></div>
            <div className="demo-link"><span>matched</span></div>
            <div className="demo-tag give"><span className="tag-hole" /><small>Free listing</small><b>Solid wood study table</b><span>Indiranagar, 560038</span></div>
          </div>
        </div>
      </section>

      <section className="wrap page">
        <div className="section-head"><h2>Browse by category</h2></div>
        <div className="cat-grid">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/browse?category=${c.id}`} className="cat-tile"><span aria-hidden="true">{c.icon}</span>{c.label}</Link>
          ))}
        </div>

        <div className="section-head"><h2>Just listed</h2><Link to="/browse">See all items</Link></div>
        {recent.loading ? <Loading rows={3} /> : recent.error ? (
          <p className="muted">Couldn’t load recent items. Is the API running?</p>
        ) : recent.data.data.length === 0 ? (
          <p className="muted">Nothing listed yet. <Link to="/items/new">Be the first to give something.</Link></p>
        ) : (
          <div className="grid">{recent.data.data.map((i) => <ItemTag key={i._id} item={i} kind="listings" />)}</div>
        )}

        <div className="section-head"><h2>How it works</h2></div>
        <ol className="steps">
          <li><h3>Post or ask</h3><p>List what you’re giving away, or describe what you need. It takes about a minute.</p></li>
          <li><h3>Get matched</h3><p>We compare category and location: pincode first, then area and city.</p></li>
          <li><h3>Meet and hand over</h3><p>Contact each other, agree a public pickup spot, then mark the item as claimed.</p></li>
        </ol>
      </section>
    </>
  );
}
