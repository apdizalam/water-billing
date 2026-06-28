import express from 'express';
import Customer from '../models/Customer.js';

const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new customer
router.post('/', async (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address
  });

  try {
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address
      },
      { new: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.json({ message: 'Customer deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
