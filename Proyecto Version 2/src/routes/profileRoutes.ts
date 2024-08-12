import { Router } from 'express';
import { 
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile
} from '../controllers/profileController';

const router = Router();

// Ruta para obtener un perfil por ID
router.get('/profiles/:id', getProfileById);

// Ruta para crear un nuevo perfil
router.post('/profiles', createProfile);

// Ruta para actualizar un perfil
router.put('/profiles/:id', updateProfile);

// Ruta para eliminar un perfil
router.delete('/profiles/:id', deleteProfile);

export default router;