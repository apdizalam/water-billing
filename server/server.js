import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Routes
import customersRouter from './routes/customers.js';
import metersRouter from './routes/meters.js';
import billsRouter from './routes/bills.js';
import managersRouter from './routes/managers.js';
import authRouter from './routes/auth.js';
import Manager from './models/Manager.js';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
// Middleware
app.use(cors());
app.use(express.json());

// Main route
app.use('/api/customers', customersRouter);
app.use('/api/meters', metersRouter);
app.use('/api/bills', billsRouter);
app.use('/api/managers', managersRouter);
app.use('/api/auth', authRouter);

app.put('/api/admin/profile', async (req, res) => {
  try {
    const { name, email } = req.body;
    const admin = await Manager.findOne({ role: 'admin' });
    if (admin) {
      admin.fullName = name;
      admin.email = email;
      await admin.save();
    }
    res.status(200).json({ name, email, role: 'admin', username: 'admin' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const { default: Customer } = await import('./models/Customer.js');
    const { default: Bill } = await import('./models/Bill.js');
    
    const customersCount = await Customer.countDocuments();
    const paidBillsCount = await Bill.countDocuments({ status: 'PAID' });
    const overdueBillsCount = await Bill.countDocuments({ status: 'OVERDUE' });
    
    const bills = await Bill.find({ status: 'PAID' });
    const revenue = bills.reduce((acc, bill) => acc + bill.amount, 0);

    res.json({
      customers: customersCount,
      billsPaid: paidBillsCount,
      overdue: overdueBillsCount,
      revenue: revenue
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/admin-dashboard';

const seedAdmin = async () => {
  try {
    // Seed Admin account
    const admin = await Manager.findOne({ username: 'admin' });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123', salt);
      const newAdmin = new Manager({
        fullName: 'System Administrator',
        email: 'admin@shaaba.com',
        phoneNumber: '+252000000000',
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      await newAdmin.save();
      console.log('Seeded admin user (username: admin, password: 123)');
    }

    // Seed Manager account
    const mgr = await Manager.findOne({ username: 'manager' });
    if (!mgr) {
      const salt2 = await bcrypt.genSalt(10);
      const hashedPassword2 = await bcrypt.hash('123', salt2);
      const newManager = new Manager({
        fullName: 'System Manager',
        email: 'manager@shaaba.com',
        phoneNumber: '+252111111111',
        username: 'manager',
        password: hashedPassword2,
        role: 'manager'
      });
      await newManager.save();
      console.log('Seeded manager user (username: manager, password: 123)');
    }
  } catch (error) {
    console.error('Failed to seed admin user:', error);
  }
};

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedAdmin(); // Seed admin user after DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });
