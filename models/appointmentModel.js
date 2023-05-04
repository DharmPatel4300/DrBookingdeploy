const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'user id required'],
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctors',
        required: [true, 'user id required'],
    },
    date: {
        type: String,
        required: [true, 'date is required'],
    },
    status: {
        type: String,
        required: [true, 'status is required'],
        default: "pending"
    },
    time: {
        type: String,
        required: [true, 'status is required'],
    },

},
    { timestamps: true }
)

const appointmentModel = mongoose.model('appointments',appointmentSchema);

module.exports = appointmentModel;