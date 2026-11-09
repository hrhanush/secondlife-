import { z } from 'zod';
import { AppError } from '../utils/AppError.js';
import { CATEGORIES, CONDITIONS, LISTING_TYPES } from '../utils/constants.js';

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
    return next(new AppError(400, 'Please fix the highlighted fields.', details));
  }
  req.body = result.data;
  next();
};

const text = (label, min, max) =>
  z.string({ required_error: `${label} is required` }).trim().min(min, `${label} must be at least ${min} characters`).max(max, `${label} must be at most ${max} characters`);

const contact = z
  .string({ required_error: 'Contact is required' })
  .trim()
  .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\+?[0-9\s-]{10,14}$/.test(v), 'Enter a valid email or phone number');

const blank = (schema) => schema.optional().or(z.literal('').transform(() => undefined));

const place = {
  city: text('City', 2, 60),
  area: text('Area', 2, 60),
  pincode: blank(z.string().trim().regex(/^\d{6}$/, 'Pincode must be 6 digits')),
};

const category = z.enum(CATEGORIES, { errorMap: () => ({ message: 'Choose a valid category' }) });

export const listingSchema = z.object({
  title: text('Title', 3, 80),
  description: text('Description', 10, 1000),
  category,
  type: z.enum(LISTING_TYPES).default('gift'),
  condition: z.enum(CONDITIONS).default('good'),
  swapFor: blank(z.string().trim().max(100)),
  imageUrl: blank(z.string().trim().url('Image must be a valid URL')),
  ...place,
  ownerName: text('Name', 2, 60),
  ownerContact: contact,
});

export const requestSchema = z.object({
  title: text('Title', 3, 80),
  description: text('Description', 10, 600),
  category,
  ...place,
  requesterName: text('Name', 2, 60),
  requesterContact: contact,
});

export const listingStatusSchema = z.object({ status: z.enum(['available', 'reserved', 'claimed']) });
export const requestStatusSchema = z.object({ status: z.enum(['open', 'fulfilled']) });
