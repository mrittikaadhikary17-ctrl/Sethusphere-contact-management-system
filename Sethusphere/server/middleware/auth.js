import { User } from '../models/index.js';
import { verifyAuthToken } from '../utils/auth.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.get('authorization');
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token required.' });
    }

    const payload = verifyAuthToken(header.slice(7));
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Authenticated user not found.' });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired authentication token.' });
    }
    next(error);
  }
}
