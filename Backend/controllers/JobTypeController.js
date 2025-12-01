const jobTypeService = require('../service/JobTypeService');

// JOB TYPE LIST CONTROLLER
exports.getJobTypeList = async (req, res) => {
    try {
        const result = await jobTypeService.getJobTypeList(req.query);

        res.status(200).json(result);
    } catch (error) {
        console.log('Error in getJobTypeList Controller:', error);
        res.status(500).json({ error: error.message });
    }
};

// CREATE JOB TYPE CONTROLLER
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

// UPDATE JOB TYPE CONTROLLER
exports.updateJobType = async (req, res) => {
    try {
        const { id, job_type_name } = req.body;
        if (!id || !job_type_name) {
            return res.status(400).json({ status: false, message: 'Job Type ID and name are required' });
        }
        const result = await jobTypeService.updateJobType({ id, job_type_name });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error in updateJobType Controller:', error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};