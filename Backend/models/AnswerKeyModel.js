const mongoose = require('mongoose');
const currentUnixTime = require('../utils/currentUnixTimeStamp');

const AnswerKeySchema = new mongoose.Schema({
    answerKey_JobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs', required: true },
    answerKey_Title: { type: String, required: true },
    answerKey_Desc: { type: String, required: true },
    answerKey_FilePath: { type: String, required: true },
    answerKey_URL: { type: String, required: false },
    answerKey_ReleaseDate: { type: Number, required: true },
    answerKey_Status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    answerKey_CreatedAt: { type: Number, default: () => currentUnixTime.currentUnixTimeStamp() },
    answerKey_UpdatedAt: { type: Number, default: () => currentUnixTime.currentUnixTimeStamp() }
});

AnswerKeySchema.pre('save', function (next) {
    this.answerKey_UpdatedAt = currentUnixTime.currentUnixTimeStamp();
    next();
});

module.exports = mongoose.model('AnswerKey', AnswerKeySchema);