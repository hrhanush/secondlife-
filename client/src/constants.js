export const CATEGORIES = [
  { id: 'furniture', label: 'Furniture', icon: '🪑' },
  { id: 'books', label: 'Books', icon: '📚' },
  { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
  { id: 'appliances', label: 'Appliances', icon: '🔌' },
  { id: 'clothing', label: 'Clothing', icon: '👕' },
  { id: 'toys', label: 'Toys', icon: '🧸' },
  { id: 'electronics', label: 'Electronics', icon: '💻' },
  { id: 'decor', label: 'Decor', icon: '🪴' },
  { id: 'other', label: 'Other', icon: '📦' },
];
export const catOf = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[8];
export const CONDITIONS = [
  { id: 'like-new', label: 'Like new' },
  { id: 'good', label: 'Good' },
  { id: 'fair', label: 'Fair' },
  { id: 'needs-repair', label: 'Needs repair' },
];
export const condLabel = (id) => CONDITIONS.find((c) => c.id === id)?.label || id;

export function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return 'just now';
  const units = [[86400, 'day'], [3600, 'hour'], [60, 'minute']];
  for (const [sec, name] of units) {
    if (s >= sec) { const n = Math.floor(s / sec); return `${n} ${name}${n > 1 ? 's' : ''} ago`; }
  }
}
export function matchLabel(score) {
  if (score >= 80) return 'Same pincode and area';
  if (score >= 50) return 'Same pincode';
  if (score >= 40) return 'Same zone and area';
  if (score >= 30) return 'Nearby zone';
  if (score >= 20) return 'Same area';
  return 'Same city';
}
