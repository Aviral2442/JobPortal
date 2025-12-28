const JobSectorService = require('../service/JobSectorService');

// JOB SECTOR LIST CONTROLLER
exports.getJobSectorList = async (req, res) => {
    try {
        const result = await JobSectorService.getJobSectorList(req.query);
        res.status(200).json({
            status: 200,
            message: 'Job sector list fetched successfully',
            jsonData: result,
        });
    } catch (error) {
        console.error('Error in getJobSectorList Controller:', error);
        res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// JOB SECTOR CREATE CONTROLLER
exports.createJobSector = async (req, res) => {
    try {
        const { job_sector_name, job_sector_status } = req.body;

        if (!job_sector_name) {
            return res.status(400).json({ status: false, message: 'Job sector name is required' });
        }

        const result = await JobSectorService.createJobSector({ job_sector_name, job_sector_status });
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in createJobSector Controller:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

// JOB SECTOR UPDATE CONTROLLER
exports.updateJobSector = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await JobSectorService.updateJobSector(id, req.body);

        if (result.status === 404) {
            return res.status(404).json({ status: false, message: 'Job sector not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Job sector updated successfully',
            jsonData: result.updatedSector,
        });
    } catch (error) {
        console.error('Error in updateJobSector Controller:', error);
        res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// JOB PREFERENCES LIST CONTROLLER
exports.getCareerPreferencesList = async (req, res) => {
    try {
        const result = await JobSectorService.getCareerPreferencesList();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in getJobPreferencesList Controller:', error);
        res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// ADD CAREER PREFERENCE CONTROLLER
exports.addCareerPreference = async (req, res) => {
    try {
        const { careerPreferenceName, careerPreferenceDescription } = req.body;
        if (!careerPreferenceName) {
            return res.status(400).json({ status: false, message: 'Career preference name is required' });
        }
        const result = await JobSectorService.addCareerPreference({ careerPreferenceName, careerPreferenceDescription });
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in addCareerPreference Controller:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};