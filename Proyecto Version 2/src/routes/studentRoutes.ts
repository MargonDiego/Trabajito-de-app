import { Router } from 'express';
import { 
  getAllStudents, 
  getStudentById, 
  createStudent, 
  updateStudent, 
  deleteStudent, 
  checkRutExists,
  getStudentSummary,
  getGradeDistribution,
  getRecentlyEnrolledStudents
} from '../controllers/studentController';

const router = Router();

// Coloca las rutas específicas primero
router.get('/students/summary', getStudentSummary);
router.get('/students/grade-distribution', getGradeDistribution);
router.get('/students/recently-enrolled', getRecentlyEnrolledStudents);
router.get('/students/check-rut/:rut', checkRutExists);

// Luego, coloca las rutas más generales
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

export default router;