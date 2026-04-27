import Worker from '../models/Worker.js';
import Assignment from '../models/Assignment.js';
import Client from '../models/Client.js';

// ============================================
// @desc    Get worker dashboard (current assignment)
// @route   GET /api/worker/dashboard
// @access  Private/Worker
// ============================================
export const getDashboard = async (req, res) => {
    try {
        // Get worker profile
        const worker = await Worker.findOne({ userId: req.user._id });

        if (!worker) {
            return res.status(404).json({
                success: false,
                message: 'Worker profile not found'
            });
        }

        // Find active assignment
        const activeAssignment = await Assignment.findOne({
            workerId: worker._id,
            status: 'active'
        });

        let assignment = null;

        if (activeAssignment) {
            // Get client info
            const client = await Client.findOne({ userId: activeAssignment.clientId });

            assignment = {
                _id: activeAssignment._id,
                clientName: client?.organizationName || 'Unknown',
                workLocation: activeAssignment.workLocation,
                workingHours: activeAssignment.workingHours,
                salary: activeAssignment.salary,
                startDate: activeAssignment.startDate,
                status: activeAssignment.status
            };
        }

        res.json({
            success: true,
            worker: {
                _id: worker._id,
                userId: worker.userId,
                skills: worker.skills,
                experience: worker.experience,
                isAvailable: worker.isAvailable,
                status: worker.status
            },
            assignment
        });
    } catch (error) {
        console.error('Worker dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data'
        });
    }
};

// ============================================
// @desc    Get worker job history
// @route   GET /api/worker/jobs
// @access  Private/Worker
// ============================================
export const getJobs = async (req, res) => {
    try {
        const worker = await Worker.findOne({ userId: req.user._id });

        if (!worker) {
            return res.status(404).json({
                success: false,
                message: 'Worker profile not found'
            });
        }

        const assignments = await Assignment.find({ workerId: worker._id })
            .sort({ createdAt: -1 });

        // Enrich with client info
        const jobs = await Promise.all(
            assignments.map(async (assignment) => {
                const client = await Client.findOne({ userId: assignment.clientId });

                // Calculate duration
                let duration = 'Ongoing';
                if (assignment.startDate && assignment.endDate) {
                    const months = Math.round(
                        (assignment.endDate - assignment.startDate) / (1000 * 60 * 60 * 24 * 30)
                    );
                    duration = `${months} month${months !== 1 ? 's' : ''}`;
                } else if (assignment.startDate) {
                    const now = new Date();
                    const months = Math.round(
                        (now - assignment.startDate) / (1000 * 60 * 60 * 24 * 30)
                    );
                    duration = months > 0 ? `${months} month${months !== 1 ? 's' : ''}` : 'Less than a month';
                }

                return {
                    _id: assignment._id,
                    clientName: client?.organizationName || 'Unknown',
                    organizationType: client?.organizationType || 'N/A',
                    workLocation: assignment.workLocation,
                    workingHours: assignment.workingHours,
                    salary: assignment.salary,
                    startDate: assignment.startDate,
                    endDate: assignment.endDate,
                    status: assignment.status,
                    duration,
                    createdAt: assignment.createdAt
                };
            })
        );

        res.json({
            success: true,
            jobs
        });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch job history'
        });
    }
};

// ============================================
// @desc    Toggle worker availability
// @route   PUT /api/worker/availability
// @access  Private/Worker
// ============================================
export const updateAvailability = async (req, res) => {
    try {
        const worker = await Worker.findOne({ userId: req.user._id });

        if (!worker) {
            return res.status(404).json({
                success: false,
                message: 'Worker profile not found'
            });
        }

        // Toggle availability
        worker.isAvailable = !worker.isAvailable;
        await worker.save();

        res.json({
            success: true,
            message: `You are now marked as ${worker.isAvailable ? 'Available' : 'Unavailable'}`,
            isAvailable: worker.isAvailable
        });
    } catch (error) {
        console.error('Update availability error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update availability'
        });
    }
};
