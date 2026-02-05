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