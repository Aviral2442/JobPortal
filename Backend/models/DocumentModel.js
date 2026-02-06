const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    document_title: { type: String, required: true },
    document_short_desc: { type: String, required: true },
    document_long_desc: { type: String, required: true },
    document_formated_desc1: { type: String, required: false, default: " " },
    document_formated_desc2: { type: String, required: false, default: " " },
    document_formated_desc3: { type: String, required: false, default: " " },
    document_formated_desc4: { type: String, required: false, default: " " },
    document_important_dates: [{
        dates_label: { type: String, required: true },
        dates_value: { type: String, required: true }
    }],
    document_important_links: [{
        links_label: { type: String, required: true },
        links_url: { type: String, required: true }
    }],
    document_application_fees: [{
        links_label: { type: String, required: true },
        links_url: { type: String, required: true }
    }],
    document_posted_date: { type: Number, default: 0, required: false },
    document_status: { type: Number, default: 0 }, // 0 = Active, 1 = Inactive
    document_created_date: { type: Number, default: () => Math.floor(Date.now() / 1000) },
    document_last_updated_date: { type: Number, required: false, default: 0 },
});

DocumentSchema.pre('save', function (next) {
    this.document_last_updated_date = Math.floor(Date.now() / 1000);
    next();
});

module.exports = mongoose.model('Documents', DocumentSchema);