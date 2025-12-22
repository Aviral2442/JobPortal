const mongoose = require('mongoose');
const currentUnixTimeStamp = require('../utils/currentUnixTimeStamp');

const CareerPreferencesSchema = new mongoose.Schema({
    careerPreferenceName: { type: String, required: true, trim: true },
    careerPreferenceDescription: { type: String, default: "" },
    careerPreferenceStatus: { type: Number, default: 0 }, // 0: Inactive, 1: Active
    careerPreferenceCreatedAt: { type: Number, default: currentUnixTimeStamp },
    careerPreferenceUpdatedAt: { type: Number, default: currentUnixTimeStamp },
});

module.exports = mongoose.model('CareerPreferences', CareerPreferencesSchema);