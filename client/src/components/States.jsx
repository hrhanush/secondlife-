export const Loading = ({ rows = 6 }) => (
  <div className="grid" aria-busy="true" aria-label="Loading">
    {Array.from({ length: rows }).map((_, i) => <div key={i} className="skeleton" />)}
  </div>
);

export const ErrorBox = ({ error, retry }) => (
  <div className="empty" role="alert">
    <h2>We couldn’t load this</h2>
    <p>{error?.message || 'Something went wrong.'}</p>
    {retry && <button className="btn" onClick={retry}>Try again</button>}
  </div>
);

export const Empty = ({ title, text, children }) => (
  <div className="empty"><h2>{title}</h2><p>{text}</p>{children}</div>
);
