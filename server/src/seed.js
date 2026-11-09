import 'dotenv/config';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Listing from './models/Listing.js';
import Request from './models/Request.js';

const key = () => crypto.randomBytes(16).toString('hex');
const base = { city: 'Bengaluru', ownerName: 'Asha R', ownerContact: 'asha@example.com' };

await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/secondlife');
await Promise.all([Listing.deleteMany({}), Request.deleteMany({})]);

await Listing.insertMany([
  { ...base, title: 'Solid wood study table', description: 'Sturdy teak study table with one drawer. Minor scratches on the top, easy to carry in a hatchback.', category: 'furniture', condition: 'good', area: 'Indiranagar', pincode: '560038' },
  { ...base, title: 'Box of 40 engineering textbooks', description: 'Mixed CSE and ECE textbooks, 2nd and 3rd semester. Free to a student who can pick up.', category: 'books', condition: 'good', area: 'Jayanagar', pincode: '560041', ownerName: 'Kiran M' },
  { ...base, title: 'Pressure cooker 5L', description: 'Works perfectly, new gasket fitted last month. Would swap for a non-stick pan.', category: 'kitchen', type: 'swap', swapFor: 'Non-stick pan', condition: 'like-new', area: 'Koramangala', pincode: '560034' },
  { ...base, title: 'Kids cycle (age 6-9)', description: 'Blue cycle with training wheels removed. Tyres recently replaced.', category: 'toys', condition: 'good', area: 'HSR Layout', pincode: '560102' },
  { ...base, title: 'Two-seater sofa', description: 'Grey fabric sofa, cushions in good shape. Needs two people to lift.', category: 'furniture', condition: 'fair', area: 'Indiranagar', pincode: '560008' },
].map((l) => ({ ...l, editKey: key() })));

await Request.insertMany([
  { title: 'Looking for a study desk', description: 'First-year student moving into a PG, need a basic study table.', category: 'furniture', city: 'Bengaluru', area: 'Indiranagar', pincode: '560038', requesterName: 'Rahul S', requesterContact: '9876543210', editKey: key() },
].map((r) => r));

console.log('Seeded demo data');
await mongoose.disconnect();
