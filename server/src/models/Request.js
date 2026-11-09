import mongoose from 'mongoose';
import { CATEGORIES } from '../utils/constants.js';

const requestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 600 },
    category: { type: String, enum: CATEGORIES, required: true, index: true },
    city: { type: String, required: true, trim: true, index: true },
    area: { type: String, required: true, trim: true },
    pincode: { type: String, trim: true, index: true },
    requesterName: { type: String, required: true, trim: true },
    requesterContact: { type: String, required: true, trim: true },
    status: { type: String, enum: ['open', 'fulfilled'], default: 'open', index: true },
    editKey: { type: String, select: false, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Request', requestSchema);
