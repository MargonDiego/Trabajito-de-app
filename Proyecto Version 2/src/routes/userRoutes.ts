import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser , deleteUser} from '../controllers/userController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.post('/users', createUser);
router.get('/users', authenticateToken, getUsers);
router.get('/users/:id', authenticateToken, getUserById);
router.put('/users/:id', authenticateToken, updateUser);
router.delete('/users/:id',authenticateToken ,deleteUser);
export default router;