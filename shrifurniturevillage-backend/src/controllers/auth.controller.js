import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export async function adminLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const user = await User.findOne({ email });
  // Debugging: print user info when not in production
  if (process.env.NODE_ENV !== 'production') {
    console.debug('adminLogin debug: input email=', email);
    console.debug('adminLogin debug: found user=', !!user);
    if (user) {
      console.debug('adminLogin debug: user.role=', user.role);
      console.debug('adminLogin debug: has passwordHash=', !!user.passwordHash);
    }
  }

  // allow case-insensitive role match (fixes records with uppercase roles)
  if (!user || (String(user.role || '').toLowerCase() !== 'admin')) return res.status(401).json({ error: 'Unauthorized' });
  if (!user.passwordHash) return res.status(401).json({ error: 'Password not set' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (process.env.NODE_ENV !== 'production') console.debug('adminLogin debug: bcrypt.compare result=', ok);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: user._id.toString(), email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
}

export async function createAdminIfMissing(req, res) {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: 'User exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, role: 'admin', name });
  res.status(201).json({ id: user._id, email: user.email, role: user.role });
}


