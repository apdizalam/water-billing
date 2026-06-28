import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  supplyNo: { type: String },
  idNo: { type: Number },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  customerName: { type: String },

  prevReading: { type: Number },
  currReading: { type: Number },
  prevDate: { type: Date },
  currDate: { type: Date },
  previousDate: { type: Date },
  currentDate: { type: Date },
  units: { type: Number, default: 0 },
  unitsUsed: { type: Number, default: 0 },

  amount: { type: Number },
  amountDue: { type: Number },
  period: { type: String },
  billDate: { type: Date },
  dueDate: { type: Date },
  status: {
    type: String,
    enum: ['PAID', 'OVERDUE', 'PENDING', 'Paid', 'Overdue', 'Pending'],
    default: 'Pending'
  },

  invoiceNo: { type: String },
  billId: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate billId and compute units before saving
billSchema.pre('save', async function (next) {
  try {
    if (typeof this.currReading === 'number' && typeof this.prevReading === 'number') {
      this.units = Math.max(0, this.currReading - this.prevReading);
    }
    if (this.units !== undefined) this.unitsUsed = this.units;

    // Sync amount / amountDue
    if (this.amountDue !== undefined && this.amount === undefined) {
      this.amount = this.amountDue;
    } else if (this.amount !== undefined && this.amountDue === undefined) {
      this.amountDue = this.amount;
    }

    if (this.isNew && !this.billId) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const prefix = `BILL-${year}${month}-`;
      const lastBill = await this.constructor.findOne({ billId: { $regex: new RegExp(`^${prefix}`) } }).sort({ billId: -1 });
      let seq = '0001';
      if (lastBill && lastBill.billId) {
        const parts = lastBill.billId.split('-');
        const lastSeq = parseInt(parts[2] || '0');
        seq = String(lastSeq + 1).padStart(4, '0');
      }
      this.billId = `${prefix}${seq}`;
    }

    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('Bill', billSchema);
