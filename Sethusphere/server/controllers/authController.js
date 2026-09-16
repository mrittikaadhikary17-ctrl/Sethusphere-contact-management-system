import {
  OtpToken,
  PasswordResetToken,
  User,
} from '../models/index.js';
import {
  comparePassword,
  createOtp,
  createRandomToken,
  hashPassword,
  hashToken,
  isStrongPassword,
  passwordPolicyMessage,
  sanitizeUser,
  signAuthToken,
} from '../utils/auth.js';

const OTP_TTL_MS = 10 * 60 * 1000;
const RESET_TTL_MS = 30 * 60 * 1000;

const signInWithProvider = async (profile, provider) => {
  const email = String(profile.email || '').trim().toLowerCase();
  if (!email) {
    const error = new Error('The provider did not return an email address.');
    error.statusCode = 400;
    throw error;
  }
  let user = await User.findOne({ email });
  if (!user) {
    const name = String(profile.name || email.split('@')[0]).trim();
    const parts = name.split(/\s+/);
    user = await User.create({
      firstName: parts[0] || 'User',
      lastName: parts.slice(1).join(' ') || 'User',
      name,
      email,
      passwordHash: await hashPassword(createRandomToken()),
      authProvider: provider,
      providerId: profile.id || '',
      avatar: profile.avatar || '',
      isEmailVerified: true,
    });
  } else {
    user.authProvider = provider;
    user.providerId = profile.id || user.providerId;
    if (profile.avatar && !user.avatar) user.avatar = profile.avatar;
    user.lastLoginAt = new Date();
    await user.save();
  }
  return { token: signAuthToken(user), user: sanitizeUser(user) };
};

export async function providerSignIn(req, res) {
  const { provider, credential } = req.body || {};
  if (!['google', 'apple'].includes(provider) || !credential) {
    return res.status(400).json({ message: 'A supported provider credential is required.' });
  }
  if (provider === 'google') {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({ message: 'Google sign-in is not configured. Supply GOOGLE_CLIENT_ID.' });
    }
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!response.ok) return res.status(401).json({ message: 'Google credential could not be verified.' });
    const payload = await response.json();
    if (payload.aud !== process.env.GOOGLE_CLIENT_ID || payload.email_verified !== 'true') {
      return res.status(401).json({ message: 'Google credential could not be verified.' });
    }
    return res.json(await signInWithProvider({
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      avatar: payload.picture,
    }, provider));
  }
  return res.status(503).json({ message: 'Apple sign-in requires Apple provider configuration before it can be enabled.' });
}

const requireFields = (body, fields) => {
  const missing = fields.filter((field) => !String(body[field] || '').trim());
  if (missing.length) {
    const error = new Error(`Missing required fields: ${missing.join(', ')}.`);
    error.statusCode = 400;
    throw error;
  }
};

const issueEmailOtp = async (user) => {
  const otp = createOtp();
  await OtpToken.deleteMany({ userId: user._id, purpose: 'email-verification' });
  await OtpToken.create({
    userId: user._id,
    purpose: 'email-verification',
    otpHash: hashToken(otp),
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });
  return otp;
};

export async function signUp(req, res) {
  requireFields(req.body, ['name', 'email', 'password']);
  if (!isStrongPassword(req.body.password)) {
    return res.status(400).json({ message: passwordPolicyMessage });
  }

  const email = req.body.email.trim().toLowerCase();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'An account with that email already exists.' });
  }

  const nameParts = req.body.name.trim().split(/\s+/);
  const firstName = nameParts.shift();
  const lastName = nameParts.join(' ') || firstName;
  const user = await User.create({
    firstName,
    lastName,
    name: req.body.name.trim(),
    email,
    passwordHash: await hashPassword(req.body.password),
    avatar: typeof req.body.avatar === 'string' ? req.body.avatar : '',
  });
  const otp = await issueEmailOtp(user);

  const response = {
    message: 'Account created. Verify the email OTP to continue.',
    user: sanitizeUser(user),
  };
  if (process.env.NODE_ENV !== 'production') response.devOtp = otp;
  res.status(201).json(response);
}

export async function signIn(req, res) {
  requireFields(req.body, ['email', 'password']);
  const user = await User.findOne({ email: req.body.email.trim().toLowerCase() });
  if (!user || !(await comparePassword(req.body.password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  if (!user.isEmailVerified) {
    return res.status(403).json({
      message: 'Please verify your email before signing in.',
    });
  }

  user.lastLoginAt = new Date();
  await user.save();
  res.json({ token: signAuthToken(user), user: sanitizeUser(user) });
}

export async function verifyOtp(req, res) {
  requireFields(req.body, ['email', 'otp']);
  const user = await User.findOne({ email: req.body.email.trim().toLowerCase() });
  const token = user && await OtpToken.findOne({
    userId: user._id,
    purpose: 'email-verification',
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });
  if (!token || token.otpHash !== hashToken(req.body.otp.trim())) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }

  token.isUsed = true;
  token.usedAt = new Date();
  await token.save();
  user.isEmailVerified = true;
  await user.save();
  res.json({ token: signAuthToken(user), user: sanitizeUser(user) });
}

export async function forgotPassword(req, res) {
  requireFields(req.body, ['email']);
  const user = await User.findOne({ email: req.body.email.trim().toLowerCase() });
  const response = { message: 'If the account exists, reset instructions are ready.' };
  if (!user) return res.json(response);

  const resetToken = createRandomToken();
  await PasswordResetToken.deleteMany({ userId: user._id, isUsed: false });
  await PasswordResetToken.create({
    userId: user._id,
    tokenHash: hashToken(resetToken),
    expiresAt: new Date(Date.now() + RESET_TTL_MS),
  });
  if (process.env.NODE_ENV !== 'production') response.devResetToken = resetToken;
  res.json(response);
}

export async function resetPassword(req, res) {
  requireFields(req.body, ['token', 'password']);
  if (!isStrongPassword(req.body.password)) {
    return res.status(400).json({ message: passwordPolicyMessage });
  }

  const resetRecord = await PasswordResetToken.findOne({
    tokenHash: hashToken(req.body.token.trim()),
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });
  if (!resetRecord) return res.status(400).json({ message: 'Invalid or expired reset token.' });

  const user = await User.findById(resetRecord.userId);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  user.passwordHash = await hashPassword(req.body.password);
  await user.save();
  resetRecord.isUsed = true;
  resetRecord.usedAt = new Date();
  await resetRecord.save();
  res.json({ message: 'Password reset successfully.' });
}

export async function getProfile(req, res) {
  res.json({ user: sanitizeUser(req.user) });
}

export async function updateProfile(req, res) {
  const allowedFields = [
    'firstName', 'lastName', 'name', 'phone', 'avatar', 'profilePhoto',
    'designation', 'company', 'industry', 'location', 'bio', 'linkedinUrl', 'timezone',
  ];
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  }
  req.user.onboardingCompleted = true;
  await req.user.save();
  res.json({ user: sanitizeUser(req.user) });
}
