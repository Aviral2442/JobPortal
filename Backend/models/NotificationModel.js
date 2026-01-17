const mongoose = require('mongoose');
const currentUnixTime = require('../utils/currentUnixTimeStamp');

const NotificationSchema = new mongoose.Schema({
    notifyJobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs', required: true },
    notifyType: { type: String, required: true },
    notifyTitle: { type: String, required: true },
    notifyDesc: { type: String, required: true },
    notifyStatus: { type: String, enum: ['unread', 'read'], default: 'unread' },
    notifyNotToStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'student' }],
    notifyCreateAt: { type: Number, default: () => currentUnixTime.currentUnixTimeStamp() },
});

module.exports = mongoose.model('Notification', NotificationSchema);