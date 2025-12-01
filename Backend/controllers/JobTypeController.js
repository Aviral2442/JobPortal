const jobTypeService = require('../service/JobTypeService');

// Get Job Type List with Filters and Pagination
exports.getJobTypeList = async (req, res) => {
    try {
        const result = await jobTypeService.getJobTypeList(req.query);

        res.status(200).json(result);
    } catch (error) {
        console.log('Error in getJobTypeList Controller:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create Job Type
exports.createJobType = async (req, res) => {
    try {
        const { job_type_name } = req.body;
        if (!job_type_name) {
            return res.status(400).json({ status: false, message: 'Job Type name is required' });
        }
        const result = await jobTypeService.createJobType({ job_type_name });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error in createJobType Controller:', error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

// Update Job Type
exports.updateJobType = async (req, res) => {
    try {
        const { id, jobType_name } = req.body;
        if (!id || !jobType_name) {
            return res.status(400).json({ status: false, message: 'Job Type ID and name are required' });
        }
        const result = await jobTypeService.updateJobType({ id, jobType_name });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error in updateJobType Controller:', error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};