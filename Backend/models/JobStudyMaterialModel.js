const mongoose = require('mongoose');

const JobStudyMaterialSchema = new mongoose.Schema({
    studyMaterial_jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs', required: true },
    studyMaterial_title: { type: String, required: true },
    studyMaterial_description: { type: String, required: true },
    studyMaterial_link: { type: String, required: false },
    studyMaterial_files: [{
        file_name: { type: String, required: true },
        file_path: { type: String, required: true },
        file_downloadable: { type: Boolean, default: true },
    }],
    studyMaterial_status: { type: Number, default: 0 }, // 0 = Active, 1 = Inactive
    studyMaterial_createdAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
    studyMaterial_updatedAt: { type: Number, required: false, default: 0 },
});

module.exports = mongoose.model('JobStudyMaterial', JobStudyMaterialSchema);