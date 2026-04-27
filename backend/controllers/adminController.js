import User from '../models/User.js';
import Client from '../models/Client.js';
import Worker from '../models/Worker.js';
import Request from '../models/Request.js';
import Assignment from '../models/Assignment.js';

// ============================================
// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
// ============================================
export const getDashboard = async (req, res) => {
    try {
        const totalClients = await Client.countDocuments();
        const totalWorkers = await Worker.countDocuments();
        const totalRequests = await Request.countDocuments();

        const activeJobs = await Request.countDocuments({
            status: { $in: ['assigned', 'approved'] }
        });

        const pendingApprovals = await Worker.countDocuments({
            status: 'pending'
        });

        res.json({
            success: true,
            stats: {
                totalClients,
                totalWorkers,
                totalRequests,
                activeJobs,
                pendingApprovals
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard stats'
        });
    }
};

// ============================================
// @desc    Get all requests with client info
// @route   GET /api/admin/requests
// @access  Private/Admin
// ============================================
export const getRequests = async (req, res) => {
    try {
        const requests = await Request.find()
            .sort({ createdAt: -1 })
            .populate('clientId', 'name email');

        // Enrich with client organization info
        const enrichedRequests = await Promise.all(
            requests.map(async (request) => {
                const reqObj = request.toObject();
                const client = await Client.findOne({ userId: request.clientId?._id });
                reqObj.clientName = client?.organizationName || request.clientId?.name || 'Unknown';
                return reqObj;
            })
        );

        res.json({
            success: true,
            requests: enrichedRequests
        });
    } catch (error) {
        console.error('Get requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch requests'
        });
    }
};

// ============================================
// @desc    Update request status
// @route   PUT /api/admin/requests/:id/status
// @access  Private/Admin
// ============================================
export const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['new', 'approved', 'assigned', 'completed', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const request = await Request.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: new Date() },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Emit Socket.io event for real-time update
        const io = req.app.get('io');
        if (io) {
            io.emit('requestStatusUpdate', {
                requestId: request._id,
                status: request.status,
                message: `Request status updated to ${status}`
            });
        }

        res.json({
            success: true,
            message: 'Request status updated',
            request
        });
    } catch (error) {
        console.error('Update request status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update request status'
        });
    }
};

// ============================================
// @desc    Get all workers with user info
// @route   GET /api/admin/workers
// @access  Private/Admin
// ============================================
export const getWorkers = async (req, res) => {
    try {
        const workers = await Worker.find().populate('userId', 'name email phone isActive');

        const workersData = workers.map(worker => {
            const w = worker.toObject();
            return {
                _id: w._id,
                userId: w.userId?._id,
                name: w.userId?.name || 'Unknown',
                email: w.userId?.email || 'N/A',
                phone: w.userId?.phone || 'N/A',
                isActive: w.userId?.isActive || false,
                skills: w.skills,
                experience: w.experience,
                idProof: w.idProof,
                uniformIssued: w.uniformIssued,
                isAvailable: w.isAvailable,
                currentAssignment: w.currentAssignment,
                status: w.status,
                createdAt: w.createdAt
            };
        });

        res.json({
            success: true,
            workers: workersData
        });
    } catch (error) {
        console.error('Get workers error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch workers'
        });
    }
};

// ============================================
// @desc    Get all clients
// @route   GET /api/admin/clients
// @access  Private/Admin
// ============================================
export const getClients = async (req, res) => {
    try {
        const clients = await Client.find().populate('userId', 'name email phone');

        const clientsData = clients.map(client => {
            const c = client.toObject();
            return {
                _id: c._id,
                userId: c.userId?._id,
                organizationName: c.organizationName,
                organizationType: c.organizationType,
                location: c.location,
                contactPerson: c.contactPerson,
                address: c.address,
                name: c.userId?.name || 'Unknown',
                email: c.userId?.email || 'N/A',
                createdAt: c.createdAt
            };
        });

        res.json({
            success: true,
            clients: clientsData
        });
    } catch (error) {
        console.error('Get clients error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch clients'
        });
    }
};

// ============================================
// @desc    Toggle worker active/inactive
// @route   PUT /api/admin/approve-worker/:id
// @access  Private/Admin
// ============================================
export const approveWorker = async (req, res) => {
    try {
        const { userId, isActive } = req.body;

        const targetUserId = userId || req.params.id;

        const user = await User.findById(targetUserId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Toggle isActive if not explicitly provided
        const newStatus = typeof isActive === 'boolean' ? isActive : !user.isActive;

        user.isActive = newStatus;
        await user.save();

        res.json({
            success: true,
            message: `Worker ${newStatus ? 'activated' : 'deactivated'} successfully`,
            isActive: newStatus
        });
    } catch (error) {
        console.error('Approve worker error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update worker status'
        });
    }
};

// ============================================
// @desc    Assign worker to client
// @route   POST /api/admin/assign-worker
// @access  Private/Admin
// ============================================
export const assignWorker = async (req, res) => {
    try {
        const { workerId, clientId, workLocation, workingHours, salary, startDate } = req.body;

        // Validate required fields
        if (!workerId || !clientId || !workLocation || !workingHours || !salary) {
            return res.status(400).json({
                success: false,
                message: 'Please provide workerId, clientId, workLocation, workingHours, and salary'
            });
        }

        // Create assignment
        const assignment = await Assignment.create({
            workerId,
            clientId,
            workLocation,
            workingHours,
            salary: parseFloat(salary),
            startDate: startDate ? new Date(startDate) : new Date(),
            status: 'active'
        });

        // Update worker availability
        await Worker.findOneAndUpdate(
            { _id: workerId },
            { isAvailable: false, currentAssignment: assignment._id }
        );

        // Emit Socket.io event
        const io = req.app.get('io');
        if (io) {
            io.emit('workerAssigned', {
                assignmentId: assignment._id,
                workerId,
                clientId,
                message: 'A worker has been assigned to a new job'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Worker assigned successfully',
            assignment
        });
    } catch (error) {
        console.error('Assign worker error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to assign worker'
        });
    }
};

// ============================================
// @desc    Mark assignment as completed
// @route   PUT /api/admin/assignment/:id/complete
// @access  Private/Admin
// ============================================
export const markAssignmentCompleted = async (req, res) => {
    try {
        const assignmentId = req.params.id;

        // Find assignment and update status
        const assignment = await Assignment.findByIdAndUpdate(
            assignmentId,
            { status: 'completed', endDate: new Date() },
            { new: true }
        );

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Update worker availability
        await Worker.findOneAndUpdate(
            { _id: assignment.workerId },
            { isAvailable: true, currentAssignment: null }
        );

        res.json({
            success: true,
            message: 'Job marked as completed. Worker is now available.',
            assignment
        });
    } catch (error) {
        console.error('Mark assignment completed error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete assignment'
        });
    }
};
