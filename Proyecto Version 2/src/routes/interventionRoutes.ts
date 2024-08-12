import { Router } from 'express';
import {
  getAllInterventions,
  getInterventionById,
  createIntervention,
  updateIntervention,
  deleteIntervention,
  getInterventionsByStudent,
  addInterventionComment,
  getInterventionComments,
  updateInterventionComment,
  deleteInterventionComment,
} from '../controllers/interventionController';

const router = Router();

router.get('/interventions', getAllInterventions);
router.get('/interventions/:id', getInterventionById);
router.post('/interventions', createIntervention);
router.put('/interventions/:id', updateIntervention);
router.delete('/interventions/:id', deleteIntervention);
router.get('/students/:studentId/interventions', getInterventionsByStudent);
router.post('/interventions/:id/comments', addInterventionComment);
router.get('/interventions/:id/comments', getInterventionComments);
router.put('/interventions/:id/comments/:commentId', updateInterventionComment);
router.delete('/interventions/:id/comments/:commentId', deleteInterventionComment);

export default router;
