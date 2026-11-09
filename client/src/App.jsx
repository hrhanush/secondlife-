import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Browse from './pages/Browse.jsx';
import Detail from './pages/Detail.jsx';
import PostForm from './pages/PostForm.jsx';
import Requests from './pages/Requests.jsx';

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link to="/" className="brand" aria-label="SecondLife home"><span className="brand-mark">♻</span>SecondLife</Link>
        <button className="menu-btn" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
        <nav id="nav" className={open ? 'open' : ''}>
          <NavLink to="/browse">Browse items</NavLink>
          <NavLink to="/requests">Requests</NavLink>
          <NavLink to="/requests/new" className="nav-ghost">Ask for an item</NavLink>
          <NavLink to="/items/new" className="btn small">Give something</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/items/new" element={<PostForm kind="listings" />} />
          <Route path="/items/:id" element={<Detail kind="listings" />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/requests/new" element={<PostForm kind="requests" />} />
          <Route path="/requests/:id" element={<Detail kind="requests" />} />
          <Route path="*" element={<div className="wrap page"><div className="empty"><h1>Page not found</h1><p>That page doesn’t exist.</p><Link className="btn" to="/">Go home</Link></div></div>} />
        </Routes>
      </main>
      <footer className="site-footer"><div className="wrap">SecondLife keeps useful things in use. Meet in public places and check items before you take them.</div></footer>
    </>
  );
}
