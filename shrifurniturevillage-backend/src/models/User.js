import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String }, // optional if using Firebase only
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    name: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);


