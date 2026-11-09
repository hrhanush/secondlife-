import Listing from '../models/Listing.js';
import Request from '../models/Request.js';
import { buildRouter } from './factory.js';
import { requestSchema, requestStatusSchema } from '../middleware/validate.js';
import { rank } from '../utils/matching.js';

export default buildRouter({
  Model: Request,
  schema: requestSchema,
  statusSchema: requestStatusSchema,
  defaultStatus: 'open',
  // available listings in the same category, nearest first
  matchesWith: async (request) => rank(request, await Listing.find({ category: request.category, status: 'available' }).limit(200)),
});
