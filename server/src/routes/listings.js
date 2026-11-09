import Listing from '../models/Listing.js';
import Request from '../models/Request.js';
import { buildRouter } from './factory.js';
import { listingSchema, listingStatusSchema } from '../middleware/validate.js';
import { rank } from '../utils/matching.js';

export default buildRouter({
  Model: Listing,
  schema: listingSchema,
  statusSchema: listingStatusSchema,
  defaultStatus: 'available',
  // open requests wanting this kind of item, nearest first
  matchesWith: async (listing) => rank(listing, await Request.find({ category: listing.category, status: 'open' }).limit(200)),
});
