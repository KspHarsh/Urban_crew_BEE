import express from 'express';
import {
    getDashboard,
    getRequests,
    updateRequestStatus,
    getWorkers,
    getClients,
    approveWorker,
    assignWorker,
    markAssignmentCompleted
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Request management
router.get('/requests', getRequests);
router.put('/requests/:id/status', updateRequestStatus);

// Worker management
router.get('/workers', getWorkers);
router.put('/approve-worker/:id', approveWorker);
router.post('/assign-worker', assignWorker);
router.put('/assignment/:id/complete', markAssignmentCompleted);

// Client management
router.get('/clients', getClients);

export default router;
