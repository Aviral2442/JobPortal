const mongoose = require('mongoose');
const { currentUnixTimeStamp } = require('../utils/currentUnixTimeStamp');

const LoginHistorySchema = new mongoose.Schema({

    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: true },
    loginAt: { type: Number, default: null },
    logoutAt: { type: Number, default: null },

    createdAt: { type: Number, default: () => currentUnixTimeStamp() }
});

LoginHistorySchema.pre("save", function (next) {
    this.updatedAt = currentUnixTimeStamp();
    next();
});

module.exports = mongoose.model('loginHistory', LoginHistorySchema);