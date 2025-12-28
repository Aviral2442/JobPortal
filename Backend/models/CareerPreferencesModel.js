const mongoose = require('mongoose');
const currentUnixTime = require("../utils/currentUnixTimeStamp");

const CareerPreferencesSchema = new mongoose.Schema({
    careerPreferenceName: { type: String, required: true, trim: true },
    careerPreferenceDescription: { type: String, default: "" },
    careerPreferenceStatus: { type: Number, default: 0 }, // 0: Inactive, 1: Active
    careerPreferenceCreatedAt: { type: Number, default: () => currentUnixTime.currentUnixTimeStamp() },
    careerPreferenceUpdatedAt: { type: Number, default: () => currentUnixTime.currentUnixTimeStamp() },
});

module.exports = mongoose.model('CareerPreferences', CareerPreferencesSchema);