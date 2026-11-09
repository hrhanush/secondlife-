import crypto from 'crypto';
import { Router } from 'express';
import { AppError, asyncHandler } from '../utils/AppError.js';
import { checkId } from '../middleware/errors.js';
import { validate } from '../middleware/validate.js';

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Builds CRUD routes shared by listings and requests. */
export function buildRouter({ Model, schema, statusSchema, defaultStatus, matchesWith }) {
  const router = Router();

  const loadOwned = async (req) => {
    const doc = await Model.findById(req.params.id).select('+editKey');
    if (!doc) throw new AppError(404, 'Not found');
    const key = Buffer.from(req.get('x-edit-key') || '');
    const real = Buffer.from(doc.editKey);
    if (key.length !== real.length || !crypto.timingSafeEqual(key, real)) {
      throw new AppError(403, 'You need the original edit key to change this post. It is saved in the browser that created it.');
    }
    return doc;
  };
  const publicDoc = (doc) => { const o = doc.toObject(); delete o.editKey; return o; };

  router.get('/', asyncHandler(async (req, res) => {
    const { q, category, type, city, status = defaultStatus } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 50);
    const filter = {};
    if (status && status !== 'all') filter.status = String(status);
    if (category) filter.category = String(category);
    if (type) filter.type = String(type);
    if (city) filter.city = new RegExp(`^${escapeRegex(String(city).trim())}$`, 'i');
    if (q) {
      const rx = new RegExp(escapeRegex(String(q).trim()), 'i');
      filter.$or = [{ title: rx }, { description: rx }, { area: rx }];
    }
    const [data, total] = await Promise.all([
      Model.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Model.countDocuments(filter),
    ]);
    res.json({ data, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
  }));

  router.post('/', validate(schema), asyncHandler(async (req, res) => {
    const editKey = crypto.randomBytes(16).toString('hex');
    const doc = await Model.create({ ...req.body, editKey });
    res.status(201).json({ data: publicDoc(doc), editKey });
  }));

  router.get('/:id', checkId, asyncHandler(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) throw new AppError(404, 'Not found');
    res.json({ data: doc });
  }));

  router.put('/:id', checkId, validate(schema), asyncHandler(async (req, res) => {
    const doc = await loadOwned(req);
    doc.set(req.body);
    await doc.save();
    res.json({ data: publicDoc(doc) });
  }));

  router.patch('/:id/status', checkId, validate(statusSchema), asyncHandler(async (req, res) => {
    const doc = await loadOwned(req);
    doc.status = req.body.status;
    await doc.save();
    res.json({ data: publicDoc(doc) });
  }));

  router.delete('/:id', checkId, asyncHandler(async (req, res) => {
    const doc = await loadOwned(req);
    await doc.deleteOne();
    res.status(204).end();
  }));

  router.get('/:id/matches', checkId, asyncHandler(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) throw new AppError(404, 'Not found');
    res.json({ data: await matchesWith(doc) });
  }));

  return router;
}
