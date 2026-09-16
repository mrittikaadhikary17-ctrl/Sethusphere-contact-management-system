import mongoose from 'mongoose';

const passwordResetTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

passwordResetTokenSchema.index({ userId: 1, expiresAt: 1 });

const PasswordResetToken = mongoose.model(
  'PasswordResetToken',
  passwordResetTokenSchema,
  'passwordResetTokens'
);

export default PasswordResetToken;
