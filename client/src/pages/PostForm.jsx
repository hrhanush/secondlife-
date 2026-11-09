import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, saveKey } from '../api.js';
import { useToast } from '../components/Toast.jsx';
import { CATEGORIES, CONDITIONS } from '../constants.js';

const emailOrPhone = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\+?[0-9\s-]{10,14}$/.test(v);

function Field({ label, error, hint, children }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <span className="label">{label}</span>
      {children}
      {hint && !error && <span className="hint">{hint}</span>}
      {error && <span className="err" role="alert">{error}</span>}
    </label>
  );
}

export default function PostForm({ kind }) {
  const isListing = kind === 'listings';
  const nav = useNavigate();
  const toast = useToast();
  const [v, setV] = useState({ title: '', description: '', category: '', type: 'gift', condition: 'good', swapFor: '', imageUrl: '', city: '', area: '', pincode: '', name: '', contact: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  const clientCheck = () => {
    const e = {};
    if (v.title.trim().length < 3) e.title = 'Give it a short title (at least 3 characters)';
    if (v.description.trim().length < 10) e.description = 'Add a few details (at least 10 characters)';
    if (!v.category) e.category = 'Choose a category';
    if (v.city.trim().length < 2) e.city = 'Enter your city';
    if (v.area.trim().length < 2) e.area = 'Enter your area or locality';
    if (v.pincode && !/^\d{6}$/.test(v.pincode)) e.pincode = 'Pincode must be 6 digits';
    if (v.name.trim().length < 2) e[isListing ? 'ownerName' : 'requesterName'] = 'Enter your name';
    if (!emailOrPhone(v.contact.trim())) e[isListing ? 'ownerContact' : 'requesterContact'] = 'Enter a valid email or phone number';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = clientCheck();
    setErrors(e);
    if (Object.keys(e).length) { document.querySelector('.has-error input, .has-error select, .has-error textarea')?.focus(); return; }
    const base = { title: v.title, description: v.description, category: v.category, city: v.city, area: v.area, pincode: v.pincode };
    const body = isListing
      ? { ...base, type: v.type, condition: v.condition, swapFor: v.type === 'swap' ? v.swapFor : '', imageUrl: v.imageUrl, ownerName: v.name, ownerContact: v.contact }
      : { ...base, requesterName: v.name, requesterContact: v.contact };
    setBusy(true);
    try {
      const res = await api.create(kind, body);
      saveKey(kind, res.data._id, res.editKey);
      toast(isListing ? 'Item posted. Nearby requests are shown below.' : 'Request posted. Here are items that match.');
      nav(isListing ? `/items/${res.data._id}` : `/requests/${res.data._id}`);
    } catch (err) {
      const map = {};
      err.details?.forEach((d) => { map[d.field] = d.message; });
      setErrors(map);
      toast(err.message, 'error');
    } finally { setBusy(false); }
  };

  const nameKey = isListing ? 'ownerName' : 'requesterName';
  const contactKey = isListing ? 'ownerContact' : 'requesterContact';
  return (
    <div className="wrap page narrow">
      <Link to={isListing ? '/browse' : '/requests'} className="back">Back</Link>
      <h1>{isListing ? 'Give something away' : 'Ask for an item'}</h1>
      <p className="muted">{isListing ? 'Describe the item and where nearby it can be collected. Your contact details are shown on the listing.' : 'Tell neighbours what you need. We’ll show matching items as soon as you post.'}</p>

      <form className="form" onSubmit={submit} noValidate>
        <Field label="Title" error={errors.title}><input value={v.title} onChange={set('title')} maxLength={80} placeholder={isListing ? 'Solid wood study table' : 'Study desk for a PG room'} /></Field>
        <Field label="Category" error={errors.category}>
          <select value={v.category} onChange={set('category')}>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </Field>
        {isListing && (
          <div className="two">
            <Field label="Offer as" error={errors.type}>
              <select value={v.type} onChange={set('type')}><option value="gift">Free gift</option><option value="swap">Swap</option></select>
            </Field>
            <Field label="Condition" error={errors.condition}>
              <select value={v.condition} onChange={set('condition')}>{CONDITIONS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
            </Field>
          </div>
        )}
        {isListing && v.type === 'swap' && (
          <Field label="Looking to swap for" error={errors.swapFor} hint="Optional"><input value={v.swapFor} onChange={set('swapFor')} maxLength={100} placeholder="A non-stick pan" /></Field>
        )}
        <Field label="Description" error={errors.description} hint={`${v.description.length}/${isListing ? 1000 : 600}`}>
          <textarea rows={4} value={v.description} onChange={set('description')} maxLength={isListing ? 1000 : 600} placeholder={isListing ? 'Size, condition, any flaws, pickup notes' : 'What you need and any size or timing details'} />
        </Field>
        {isListing && <Field label="Photo link" error={errors.imageUrl} hint="Optional. Paste an image URL."><input type="url" value={v.imageUrl} onChange={set('imageUrl')} placeholder="https://" /></Field>}

        <fieldset>
          <legend>Approximate location</legend>
          <div className="two">
            <Field label="City" error={errors.city}><input value={v.city} onChange={set('city')} autoComplete="address-level2" /></Field>
            <Field label="Area" error={errors.area}><input value={v.area} onChange={set('area')} placeholder="Indiranagar" /></Field>
          </div>
          <Field label="Pincode" error={errors.pincode} hint="Optional, but gives the closest matches"><input inputMode="numeric" maxLength={6} value={v.pincode} onChange={set('pincode')} autoComplete="postal-code" /></Field>
        </fieldset>

        <fieldset>
          <legend>Your contact details</legend>
          <div className="two">
            <Field label="Name" error={errors[nameKey]}><input value={v.name} onChange={set('name')} autoComplete="name" /></Field>
            <Field label="Email or phone" error={errors[contactKey]}><input value={v.contact} onChange={set('contact')} autoComplete="email" /></Field>
          </div>
        </fieldset>

        <button className="btn big" disabled={busy}>{busy ? 'Posting…' : isListing ? 'Post item' : 'Post request'}</button>
      </form>
    </div>
  );
}
