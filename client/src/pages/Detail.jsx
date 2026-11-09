import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, dropKey, getKey, useFetch } from '../api.js';
import ItemTag from '../components/ItemTag.jsx';
import { ErrorBox, Loading } from '../components/States.jsx';
import { useToast } from '../components/Toast.jsx';
import { catOf, condLabel, timeAgo } from '../constants.js';

export default function Detail({ kind }) {
  const { id } = useParams();
  const isListing = kind === 'listings';
  const other = isListing ? 'requests' : 'listings';
  const nav = useNavigate();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const item = useFetch(() => api.get(kind, id), [kind, id]);
  const matches = useFetch(() => api.matches(kind, id), [kind, id]);
  const key = getKey(kind, id);

  if (item.loading) return <div className="wrap page"><Loading rows={1} /></div>;
  if (item.error) return <div className="wrap page"><ErrorBox error={item.error} retry={item.error.status === 404 ? null : item.reload} /></div>;

  const it = item.data.data;
  const cat = catOf(it.category);
  const contact = isListing ? it.ownerContact : it.requesterContact;
  const person = isListing ? it.ownerName : it.requesterName;
  const isEmail = contact.includes('@');
  const statuses = isListing ? ['available', 'reserved', 'claimed'] : ['open', 'fulfilled'];

  const changeStatus = async (s) => {
    setBusy(true);
    try { await api.setStatus(kind, id, s, key); toast('Status updated'); item.reload(); matches.reload(); }
    catch (e) { toast(e.message, 'error'); } finally { setBusy(false); }
  };
  const remove = async () => {
    if (!window.confirm('Delete this post? This can’t be undone.')) return;
    setBusy(true);
    try { await api.remove(kind, id, key); dropKey(kind, id); toast('Post deleted'); nav(isListing ? '/browse' : '/requests'); }
    catch (e) { toast(e.message, 'error'); setBusy(false); }
  };

  return (
    <div className="wrap page">
      <Link to={isListing ? '/browse' : '/requests'} className="back">Back to {isListing ? 'items' : 'requests'}</Link>
      <div className="detail">
        <div className="detail-media">
          {it.imageUrl && <img src={it.imageUrl} alt={it.title} onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
          <span aria-hidden="true">{cat.icon}</span>
        </div>
        <div>
          <div className="chips">
            <span className={`chip ${isListing ? (it.type === 'swap' ? 'swap' : 'gift') : 'ask'}`}>{isListing ? (it.type === 'swap' ? 'Swap' : 'Free') : 'Wanted'}</span>
            <span className="chip plain">{cat.label}</span>
            {isListing && <span className="chip plain">{condLabel(it.condition)}</span>}
            <span className="chip plain">{it.status}</span>
          </div>
          <h1>{it.title}</h1>
          <p className="muted">{it.area}, {it.city}{it.pincode ? ` ${it.pincode}` : ''}. Posted {timeAgo(it.createdAt)}.</p>
          <p className="desc">{it.description}</p>
          {isListing && it.swapFor && <p><strong>Would like in return:</strong> {it.swapFor}</p>}

          <div className="contact-card">
            <h2>{isListing ? 'Interested?' : 'Have this item?'}</h2>
            <p>Contact {person}</p>
            <a className="btn" href={isEmail ? `mailto:${contact}?subject=${encodeURIComponent('SecondLife: ' + it.title)}` : `tel:${contact.replace(/\s/g, '')}`}>{isEmail ? 'Email' : 'Call'} {contact}</a>
            <p className="tiny muted">Agree a public pickup spot and check the item before you take it.</p>
          </div>

          {key && (
            <div className="owner-card">
              <h2>Manage your post</h2>
              <div className="row">
                {statuses.map((s) => <button key={s} className={`pill ${it.status === s ? 'on' : ''}`} disabled={busy || it.status === s} onClick={() => changeStatus(s)}>Mark {s}</button>)}
                <button className="btn danger small" disabled={busy} onClick={remove}>Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <section>
        <div className="section-head"><h2>{isListing ? 'Neighbours asking for this' : 'Items that match your request'}</h2></div>
        {matches.loading ? <Loading rows={3} /> : matches.error ? <ErrorBox error={matches.error} retry={matches.reload} /> : matches.data.data.length === 0 ? (
          <p className="muted">{isListing ? 'No open requests match yet. We check by category and location.' : 'Nothing matches yet. Check back soon, or browse all items.'} {!isListing && <Link to={`/browse?category=${it.category}`}>Browse {cat.label.toLowerCase()}</Link>}</p>
        ) : <div className="grid">{matches.data.data.map((m) => <ItemTag key={m._id} item={m} kind={other} />)}</div>}
      </section>
    </div>
  );
}
