import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required.');
  }
  return process.env.JWT_SECRET;
};

export const hashPassword = (password) => bcrypt.hash(password, 12);

export const isStrongPassword = (password) =>
  typeof password === 'string' &&
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /\d/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

export const passwordPolicyMessage =
  'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';

export const comparePassword = (password, passwordHash) =>
  bcrypt.compare(password, passwordHash);

export const signAuthToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const verifyAuthToken = (token) => jwt.verify(token, getJwtSecret());

export const createRandomToken = () => crypto.randomBytes(32).toString('hex');

export const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const createOtp = () => crypto.randomInt(100000, 1000000).toString();

export const sanitizeUser = (user) => {
  const plainUser = user.toObject ? user.toObject() : { ...user };
  delete plainUser.passwordHash;
  delete plainUser.__v;
  return plainUser;
};
