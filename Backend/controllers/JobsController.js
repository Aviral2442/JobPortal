const jobsService = require("../service/JobsService");

// Create a new job
exports.addJobsController = async (req, res) => {
    try {
        const jobData = req.body;
        console.log("Received job data:", jobData);
        const result = await jobsService.addJobsService(jobData);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get job by ID
exports.getJobByIdController = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const result = await jobsService.getJobByIdService(jobId);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update job by ID
exports.updateJobByIdController = async (req, res) => {
    try {
        const jobId = req.params.id;
        const updateData = req.body;
        const result = await jobsService.updateJobByIdService(jobId, updateData);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// HANDLE BULK UPLOAD OF JOBS
exports.bulkUploadJobsController = async (req, res) => {
    try {
        // Controller accepts either:
        // - multipart/form-data file under field `csv` (recommended)
        // - or a `csvPath` in request body pointing to a server-side CSV file
        let csvPath = null;

        // file upload via multer -> req.file.path
        if (req.file && req.file.path) {
            csvPath = req.file.path;
            console.log("Received CSV file for bulk upload:", csvPath);
        }

        // fallback to csvPath in body
        if (!csvPath && req.body && req.body.csvPath) {
            csvPath = req.body.csvPath;
            console.log("Received csvPath in body for bulk upload:", csvPath);
        }

        if (!csvPath) {
            return res.status(400).json({ status: 400, message: "CSV file is required (upload 'csv' file or provide csvPath)" });
        }
        console.log("Processing bulk upload from CSV path:", csvPath);
        const result = await jobsService.bulkUploadJobs(csvPath);
        return res.status(result.status || 200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};