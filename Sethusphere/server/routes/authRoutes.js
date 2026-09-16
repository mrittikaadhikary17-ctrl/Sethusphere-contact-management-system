import { Router } from 'express';
import {
  forgotPassword,
  getProfile,
  resetPassword,
  signIn,
  signUp,
  updateProfile,
  verifyOtp,
  providerSignIn,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/provider-signin', providerSignIn);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', requireAuth, getProfile);
router.patch('/profile', requireAuth, updateProfile);

export default router;
