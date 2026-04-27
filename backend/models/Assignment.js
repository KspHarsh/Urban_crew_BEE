import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Worker ID is required']
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Client ID is required']
    },
    workLocation: {
        type: String,
        required: [true, 'Work location is required'],
        trim: true
    },
    workingHours: {
        type: String,
        required: [true, 'Working hours is required'],
        trim: true
    },
    salary: {
        type: Number,
        required: [true, 'Salary is required']
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'replaced'],
        default: 'active'
    }
}, {
    timestamps: true
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;
