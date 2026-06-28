import express from 'express';
import Meter from '../models/Meter.js';

const router = express.Router();

// Get all meters
router.get('/', async (req, res) => {
  try {
    const meters = await Meter.find().populate('customer').sort({ createdAt: -1 });
    res.json(meters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new meter
router.post('/', async (req, res) => {
  const meter = new Meter({
    meterNumber: req.body.meterNumber,
    customer: req.body.customer,
    location: req.body.location
  });

  try {
    const newMeter = await meter.save();
    res.status(201).json(newMeter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a meter
router.put('/:id', async (req, res) => {
  try {
    const updatedMeter = await Meter.findByIdAndUpdate(
      req.params.id,
      {
        meterNumber: req.body.meterNumber,
        customer: req.body.customer,
        location: req.body.location,
        status: req.body.status
      },
      { new: true }
    );
    if (!updatedMeter) {
      return res.status(404).json({ message: 'Meter not found.' });
    }
    res.json(updatedMeter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a meter
router.delete('/:id', async (req, res) => {
  try {
    const deletedMeter = await Meter.findByIdAndDelete(req.params.id);
    if (!deletedMeter) {
      return res.status(404).json({ message: 'Meter not found.' });
    }
    res.json({ message: 'Meter deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
