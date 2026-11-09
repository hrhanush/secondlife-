import mongoose from 'mongoose';
import { CATEGORIES, CONDITIONS, LISTING_TYPES } from '../utils/constants.js';

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    category: { type: String, enum: CATEGORIES, required: true, index: true },
    type: { type: String, enum: LISTING_TYPES, default: 'gift' },
    condition: { type: String, enum: CONDITIONS, default: 'good' },
    swapFor: { type: String, trim: true, maxlength: 100 },
    imageUrl: { type: String, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    area: { type: String, required: true, trim: true },
    pincode: { type: String, trim: true, index: true },
    ownerName: { type: String, required: true, trim: true },
    ownerContact: { type: String, required: true, trim: true },
    status: { type: String, enum: ['available', 'reserved', 'claimed'], default: 'available', index: true },
    editKey: { type: String, select: false, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Listing', listingSchema);
