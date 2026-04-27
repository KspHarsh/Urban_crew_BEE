import express from 'express';
import { getDashboard, getJobs, updateAvailability } from '../controllers/workerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All worker routes require authentication + worker role
router.use(protect);
router.use(authorize('worker'));

router.get('/dashboard', getDashboard);
router.get('/jobs', getJobs);
router.put('/availability', updateAvailability);

export default router;
