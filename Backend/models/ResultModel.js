const mongoose = require('mongoose');
const currentUnixTime = require('../utils/currentUnixTimeStamp');

const ResultSchema = new mongoose.Schema({
    result_JobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs', required: true },
    result_Title: { type: String, required: true },
    result_Desc: { type: String, required: true },
    result_FilePath: { type: String, required: true },
    result_URL: { type: String, required: false },
    result_ReleaseDate: { type: Number, required: true },
    result_Status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    result_CreatedAt: { type: Number, default: () => currentUnixTime.currentUnixTimeStamp() },
    result_UpdatedAt: { type: Number, default: () => currentUnixTime.currentUnixTimeStamp() }
});

ResultSchema.pre('save', function (next) {
    this.result_UpdatedAt = currentUnixTime.currentUnixTimeStamp();
    next();
});

module.exports = mongoose.model('Result', ResultSchema);