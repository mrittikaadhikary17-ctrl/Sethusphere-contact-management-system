import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    authProvider: { type: String, enum: ['password', 'google', 'apple'], default: 'password' },
    providerId: { type: String, default: '' },
    phone: { type: String, trim: true },
    avatar: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
    designation: { type: String, default: '' },
    company: { type: String, default: '' },
    industry: { type: String, default: '' },
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    role: { type: String, default: 'user' },
    permissions: { type: [String], default: [] },
    timezone: { type: String, default: 'Asia/Kolkata (IST +5:30)' },
    isEmailVerified: { type: Boolean, default: false },
    onboardingCompleted: { type: Boolean, default: false },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema, 'users');

export default User;
