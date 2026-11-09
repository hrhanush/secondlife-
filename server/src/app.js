import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import listings from './routes/listings.js';
import requests from './routes/requests.js';
import Listing from './models/Listing.js';
import Request from './models/Request.js';
import { asyncHandler } from './utils/AppError.js';
import { notFound, errorHandler } from './middleware/errors.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '50kb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 60_000, limit: 200, standardHeaders: true, legacyHeaders: false }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/stats', asyncHandler(async (_req, res) => {
  const [available, claimed, openRequests] = await Promise.all([
    Listing.countDocuments({ status: 'available' }),
    Listing.countDocuments({ status: 'claimed' }),
    Request.countDocuments({ status: 'open' }),
  ]);
  res.json({ data: { available, claimed, openRequests } });
}));
app.use('/api/listings', listings);
app.use('/api/requests', requests);

app.use(notFound);
app.use(errorHandler);
export default app;
