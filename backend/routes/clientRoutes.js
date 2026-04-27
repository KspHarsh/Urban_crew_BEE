import express from 'express';
import { getDashboard, createRequest, getRequests } from '../controllers/clientController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All client routes require authentication + client role
router.use(protect);
router.use(authorize('client'));

router.get('/dashboard', getDashboard);
router.post('/request', createRequest);
router.get('/requests', getRequests);

export default router;
