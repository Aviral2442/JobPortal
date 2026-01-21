const mongoose = require('mongoose');
const currentUnixTime = require('../utils/currentUnixTimeStamp');

const AdmitCardSchema = new mongoose.Schema({
    admitCard_JobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs', required: true },
    admitCard_Title: { type: String, required: true },
    admitCard_Desc: { type: String, required: true },
    admitCard_FilePath: { type: String, required: true },
    admitCard_URL: { type: String, required: false },
    admitCard_ReleaseDate: { type: Number, required: true },
    admitCard_Status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    admitCard_CreatedAt: { type: Number, default: () => currentUnixTime.currentUnixTimeStamp() },
    admitCard_UpdatedAt: { type: Number, default: () => currentUnixTime.currentUnixTimeStamp() }
});

AdmitCardSchema.pre('save', function (next) {
    this.admitCard_UpdatedAt = currentUnixTime.currentUnixTimeStamp();
    next();
});

module.exports = mongoose.model('AdmitCard', AdmitCardSchema);