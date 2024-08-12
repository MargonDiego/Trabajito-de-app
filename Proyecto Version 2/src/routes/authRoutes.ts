// authRoutes.ts
import { Router } from 'express';
import { login ,verifyToken } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', login);
router.get('/verify-token', authenticateToken, verifyToken);

export default router;