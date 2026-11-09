import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.js';

export const notFound = (req, _res, next) => next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));

export const checkId = (req, _res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new AppError(400, 'Invalid id'));
  next();
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong';
  let details = err.details;

  if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  }
  if (err.type === 'entity.parse.failed') { status = 400; message = 'Malformed JSON body'; }
  if (status === 500) { console.error(err); message = 'Something went wrong on our side. Please try again.'; }

  res.status(status).json({ error: { message, ...(details && { details }) } });
};
