const mongoose = require('mongoose');

const DynamicContentSchema = new mongoose.Schema({
    privacyPolicy: { type: String },
    aboutUs: { type: String },
    helpCenter: { type: String },
    termsAndConditions: { type: String },
    contactSupportNumber: { type: String },
    contactSupportEmail: { type: String },
});

module.exports = mongoose.model('DynamicContent', DynamicContentSchema);