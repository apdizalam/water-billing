import mongoose from 'mongoose';

const meterSchema = new mongoose.Schema({
  meterNumber: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive', 'Maintenance'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Meter', meterSchema);
