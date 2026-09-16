import mongoose from 'mongoose';

const otpTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    purpose: {
      type: String,
      enum: ['email-verification', 'password-reset', 'login'],
      required: true,
    },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

otpTokenSchema.index({ userId: 1, purpose: 1, expiresAt: 1 });

const OtpToken = mongoose.model('OtpToken', otpTokenSchema, 'otpTokens');

export default OtpToken;
