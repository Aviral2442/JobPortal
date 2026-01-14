const mongoose = require('mongoose');
const currentUnixTime = require('../utils/currentUnixTimeStamp');

const JobAppliedMapperSchema = new mongoose.Schema({

    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
    applicationStatus: { type: String, enum: ['applied', 'in review', 'interview', 'offered', 'rejected'], default: 'applied' },
    appliedAt: { type: Number, default: () => currentUnixTime.currentUnixTimeStamp() },
    updatedAt: { type: Number, default: () => currentUnixTime.currentUnixTimeStamp() }
});

module.exports = mongoose.model('JobAppliedMapper', JobAppliedMapperSchema);