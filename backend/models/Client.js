import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    organizationName: {
        type: String,
        required: [true, 'Organization name is required'],
        trim: true
    },
    organizationType: {
        type: String,
        enum: ['school', 'office', 'hospital', 'society', 'coaching'],
        required: [true, 'Organization type is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    contactPerson: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true,
        default: ''
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // registeredAt equivalent
});

const Client = mongoose.model('Client', clientSchema);

export default Client;
