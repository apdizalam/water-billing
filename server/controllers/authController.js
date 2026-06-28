import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Manager from '../models/Manager.js';

// Login controller: supports admin and manager roles
// Supports both bcrypt-hashed passwords (seeded users) and plain-text passwords (newly registered managers)
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Case-insensitive username lookup
    const user = await Manager.findOne({ username: new RegExp(`^${username}$`, 'i') });

    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    // Try bcrypt comparison first (for seeded/hashed passwords)
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (bcryptErr) {
      // bcrypt.compare throws if the stored value is not a valid bcrypt hash
      // This is expected for plain-text stored passwords — fall through to direct comparison
      isMatch = false;
    }

    // Fallback: direct plain-text comparison (for managers registered via the dashboard)
    if (!isMatch) {
      isMatch = (password === user.password);
    }

    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    const secret = process.env.JWT_SECRET || 'dev_jwt_secret';
    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Auth login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

export default { login };
