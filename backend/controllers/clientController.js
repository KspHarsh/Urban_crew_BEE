import Request from '../models/Request.js';
import Client from '../models/Client.js';

// ============================================
// @desc    Get client dashboard stats
// @route   GET /api/client/dashboard
// @access  Private/Client
// ============================================
export const getDashboard = async (req, res) => {
    try {
        const clientRequests = await Request.find({ clientId: req.user._id })
            .sort({ createdAt: -1 });

        const pendingCount = clientRequests.filter(
            r => r.status === 'new' || r.status === 'approved'
        ).length;
        const assignedCount = clientRequests.filter(
            r => r.status === 'assigned'
        ).length;

        res.json({
            success: true,
            stats: {
                activeStaff: assignedCount,
                pendingRequests: pendingCount,
                totalRequests: clientRequests.length
            },
            requests: clientRequests.slice(0, 5) // Latest 5
        });
    } catch (error) {
        console.error('Client dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data'
        });
    }
};

// ============================================
// @desc    Create a new staffing request
// @route   POST /api/client/request
// @access  Private/Client
// ============================================
export const createRequest = async (req, res) => {
    try {
        const { serviceType, numberOfWorkers, location, duration, notes } = req.body;

        // Validate required fields
        if (!serviceType || !numberOfWorkers || !location || !duration) {
            return res.status(400).json({
                success: false,
                message: 'Please provide serviceType, numberOfWorkers, location, and duration'
            });
        }

        const request = await Request.create({
            clientId: req.user._id,
            serviceType,
            numberOfWorkers: parseInt(numberOfWorkers),
            location,
            duration,
            notes: notes || '',
            status: 'new',
            assignedWorkers: []
        });

        // Emit Socket.io event for real-time update
        const io = req.app.get('io');
        if (io) {
            io.emit('newRequest', {
                requestId: request._id,
                serviceType: request.serviceType,
                message: `New ${serviceType} request created`
            });
        }

        res.status(201).json({
            success: true,
            message: 'Request created successfully',
            request
        });
    } catch (error) {
        console.error('Create request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create request'
        });
    }
};

// ============================================
// @desc    Get all requests for current client
// @route   GET /api/client/requests
// @access  Private/Client
// ============================================
export const getRequests = async (req, res) => {
    try {
        const requests = await Request.find({ clientId: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            requests
        });
    } catch (error) {
        console.error('Get client requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch requests'
        });
    }
};
