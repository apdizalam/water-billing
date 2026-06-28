import express from 'express';
import Bill from '../models/Bill.js';

const router = express.Router();

// Get all bills
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const bills = await Bill.find(query).populate('customer').populate('customerId').sort({ createdAt: -1 });
    const out = bills.map(b => {
      const o = b.toObject();
      return {
        _id: o._id,
        billId: o.billId || null,
        supplyNo: o.supplyNo || '',
        idNo: o.idNo || null,
        customerId: o.customerId || o.customer || null,
        customerName: o.customerName || (o.customerId && o.customerId.fullName) || (o.customer && o.customer.name) || '',
        prevReading: o.prevReading !== undefined ? o.prevReading : null,
        currReading: o.currReading !== undefined ? o.currReading : null,
        prevDate: o.prevDate || null,
        currDate: o.currDate || null,
        units: o.units || 0,
        unitsUsed: o.unitsUsed !== undefined ? o.unitsUsed : (o.units || 0),
        amount: o.amount || 0,
        amountDue: o.amountDue !== undefined ? o.amountDue : (o.amount || 0),
        period: o.period || '',
        billDate: o.billDate || null,
        dueDate: o.dueDate || null,
        status: o.status || 'Pending',
        createdAt: o.createdAt || null
      };
    });
    res.json(out);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get next invoice sequence number
router.get('/next-id', async (req, res) => {
  try {
    const lastBillItem = await Bill.findOne().sort({ invoiceNo: -1 });
    let assignedSequence = 1;
    if (lastBillItem && lastBillItem.invoiceNo) {
      const lastNum = parseInt(lastBillItem.invoiceNo.replace('BILL-', ''), 10);
      if (!isNaN(lastNum)) {
        assignedSequence = lastNum + 1;
      }
    }
    res.json({ nextId: assignedSequence.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new bill
router.post('/', async (req, res) => {
  try {
    const {
      supplyNo, idNo, customerId, customer,
      prevReading, currReading, prevDate, currDate,
      billDate, period, amount, amountDue,
      status, dueDate, customerName
    } = req.body;

    const lastBillItem = await Bill.findOne().sort({ invoiceNo: -1 });
    let assignedSequence = 1;
    if (lastBillItem && lastBillItem.invoiceNo) {
      const lastNum = parseInt(lastBillItem.invoiceNo.replace('BILL-', ''), 10);
      if (!isNaN(lastNum)) {
        assignedSequence = lastNum + 1;
      }
    }

    const billData = {
      supplyNo: supplyNo || undefined,
      idNo: idNo || assignedSequence,
      customerId: customerId || customer || undefined,
      customer: customer || customerId || undefined,
      customerName: customerName || undefined,
      prevReading: prevReading !== undefined ? Number(prevReading) : undefined,
      currReading: currReading !== undefined ? Number(currReading) : undefined,
      prevDate: prevDate || undefined,
      currDate: currDate || undefined,
      previousDate: prevDate || undefined,
      currentDate: currDate || undefined,
      billDate: billDate || new Date(),
      period: period || undefined,
      amountDue: amountDue !== undefined ? Number(amountDue) : (amount !== undefined ? Number(amount) : undefined),
      amount: amount !== undefined ? Number(amount) : (amountDue !== undefined ? Number(amountDue) : undefined),
      dueDate: dueDate || undefined,
      status: status || 'Pending',
      invoiceNo: assignedSequence.toString(),
      billId: `BILL-${assignedSequence}`
    };

    const bill = new Bill(billData);
    const newBill = await bill.save();
    const populated = await Bill.findById(newBill._id).populate('customer').populate('customerId');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a bill
router.put('/:id', async (req, res) => {
  try {
    const updates = { ...req.body };

    // If readings are updated, recalculate units
    if (updates.currReading !== undefined || updates.prevReading !== undefined) {
      const existing = await Bill.findById(req.params.id);
      if (!existing) return res.status(404).json({ message: 'Bill not found.' });
      const curr = updates.currReading !== undefined ? Number(updates.currReading) : existing.currReading;
      const prev = updates.prevReading !== undefined ? Number(updates.prevReading) : existing.prevReading;
      if (typeof curr === 'number' && typeof prev === 'number') {
        updates.units = Math.max(0, curr - prev);
        updates.unitsUsed = updates.units;
      }
    }

    // Normalize amount fields
    if (updates.amount !== undefined && updates.amountDue === undefined) {
      updates.amountDue = Number(updates.amount);
    }
    if (updates.amountDue !== undefined && updates.amount === undefined) {
      updates.amount = Number(updates.amountDue);
    }

    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('customer').populate('customerId');

    if (!updatedBill) {
      return res.status(404).json({ message: 'Bill not found.' });
    }
    res.json(updatedBill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a bill
router.delete('/:id', async (req, res) => {
  try {
    const deletedBill = await Bill.findByIdAndDelete(req.params.id);
    if (!deletedBill) {
      return res.status(404).json({ message: 'Bill not found.' });
    }
    res.json({ message: 'Bill deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
