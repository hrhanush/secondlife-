const norm = (s = '') => s.trim().toLowerCase();

/** Approximate-location score between two places. 0 means no overlap. */
export function locationScore(a, b) {
  let score = 0;
  if (a.pincode && b.pincode) {
    if (a.pincode === b.pincode) score += 50;
    else if (a.pincode.slice(0, 3) === b.pincode.slice(0, 3)) score += 30;
  }
  if (norm(a.area) && norm(a.area) === norm(b.area)) score += 20;
  if (norm(a.city) && norm(a.city) === norm(b.city)) score += 10;
  return score;
}

export function rank(source, candidates) {
  return candidates
    .map((c) => ({ item: c, score: locationScore(source, c) }))
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score || y.item.createdAt - x.item.createdAt)
    .map(({ item, score }) => ({ ...item.toObject(), matchScore: score }));
}
