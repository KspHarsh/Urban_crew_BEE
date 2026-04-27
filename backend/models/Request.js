import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Client ID is required']
    },
    serviceType: {
        type: String,
        enum: ['cleaning', 'helper', 'mts', 'hospital', 'school', 'security', 'society', 'short-term'],
        required: [true, 'Service type is required']
    },
    numberOfWorkers: {
        type: Number,
        required: [true, 'Number of workers is required'],
        min: [1, 'At least 1 worker required']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    duration: {
        type: String,
        enum: ['monthly', 'yearly', 'on-call'],
        required: [true, 'Duration is required']
    },
    notes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['new', 'approved', 'assigned', 'completed', 'cancelled'],
        default: 'new'
    },
    assignedWorkers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true // createdAt and updatedAt
});

const Request = mongoose.model('Request', requestSchema);

export default Request;
