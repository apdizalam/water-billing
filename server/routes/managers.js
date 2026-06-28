import express from 'express';
import bcrypt from 'bcryptjs';
import Manager from '../models/Manager.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const managers = await Manager.find({}).sort({ createdAt: -1 });
    res.json(managers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch managers.' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { fullName, username, email, phone, phoneNumber, password } = req.body;
    const phoneVal = phone || phoneNumber || '';

    if (!fullName || !email || !phoneVal || !username || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingManager = await Manager.findOne({
      $or: [{ email }, { username }]
    });

    if (existingManager) {
      return res.status(400).json({ message: 'Email or Username already exists.' });
    }

    const newManager = new Manager({
      fullName,
      username,
      email,
      phoneNumber: phoneVal,
      password: password.toString().trim() // Retain real legible string format
    });

    await newManager.save();
    res.status(201).json(newManager);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Update a manager
router.put('/:id', async (req, res) => {
  try {
    const { fullName, email, phone, phoneNumber, username, password } = req.body;
    const phoneVal = phone || phoneNumber || '';
    const updateData = { fullName, email, phoneNumber: phoneVal, username };
    
    if (password) {
      updateData.password = password.toString().trim();
    }
    
    const updatedManager = await Manager.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedManager) {
      return res.status(404).json({ message: 'Manager not found.' });
    }
    res.json(updatedManager);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update manager.' });
  }
});

// Delete a manager
router.delete('/:id', async (req, res) => {
  try {
    const deletedManager = await Manager.findByIdAndDelete(req.params.id);
    if (!deletedManager) {
      return res.status(404).json({ message: 'Manager not found.' });
    }
    res.json({ message: 'Manager deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete manager.' });
  }
});

export default router;
