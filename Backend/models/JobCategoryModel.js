const mongoose = require('mongoose');

const JobCategorySchema = new mongoose.Schema({
    category_job_sector: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSector', required: true },
    category_name: { type: String, required: true, unique: true },
    category_image: { type: String, required: true },
    category_slug: { type: String, unique: true },
    category_status: { type: Number, default: 0 }, // 0 = Active, 1 = Inactive
    category_created_at: { type: Number, default: () => Math.floor(Date.now() / 1000) }, // UNIX time
    category_updated_at: { type: Number, default: null },
});

module.exports = mongoose.model('JobCategory', JobCategorySchema);
