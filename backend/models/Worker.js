import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    skills: {
        type: [String],
        default: []
    },
    experience: {
        type: String,
        default: ''
    },
    idProof: {
        type: String,
        default: ''
    },
    uniformIssued: {
        type: Boolean,
        default: false
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    currentAssignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'inactive'],
        default: 'approved'
    }
}, {
    timestamps: true // joinedAt equivalent
});

const Worker = mongoose.model('Worker', workerSchema);

export default Worker;
