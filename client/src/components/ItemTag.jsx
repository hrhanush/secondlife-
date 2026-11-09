import { Link } from 'react-router-dom';
import { catOf, condLabel, matchLabel, timeAgo } from '../constants.js';

/** A "hang tag" card used for both listings and requests. */
export default function ItemTag({ item, kind }) {
  const cat = catOf(item.category);
  const isListing = kind === 'listings';
  const to = isListing ? `/items/${item._id}` : `/requests/${item._id}`;
  const done = isListing ? item.status !== 'available' : item.status !== 'open';
  return (
    <Link to={to} className={`tag ${isListing ? 'is-listing' : 'is-request'} ${done ? 'done' : ''}`}>
      <span className="tag-hole" aria-hidden="true" />
      <div className="tag-thumb">
        {item.imageUrl ? <img src={item.imageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} /> : null}
        <span className="tag-icon" aria-hidden="true">{cat.icon}</span>
      </div>
      <div className="tag-body">
        <div className="chips">
          <span className={`chip ${isListing ? (item.type === 'swap' ? 'swap' : 'gift') : 'ask'}`}>{isListing ? (item.type === 'swap' ? 'Swap' : 'Free') : 'Wanted'}</span>
          {isListing && <span className="chip plain">{condLabel(item.condition)}</span>}
          {done && <span className="chip plain">{isListing ? item.status : 'Fulfilled'}</span>}
        </div>
        <h3>{item.title}</h3>
        <p className="muted">{item.area}, {item.city}</p>
        <p className="tiny muted">
          {item.matchScore ? <strong className="match">{matchLabel(item.matchScore)}</strong> : cat.label}
          {' '}{timeAgo(item.createdAt)}
        </p>
      </div>
    </Link>
  );
}
