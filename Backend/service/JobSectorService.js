const JobSectorModel = require('../models/JobSectorModel');
const CareerPreferencesModel = require('../models/CareerPreferencesModel');
const moment = require('moment');

// JOB SECTOR LIST SERVICE
exports.getJobSectorList = async (query) => {
    const { dateFilter, fromDate, toDate, searchFilter, page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;
    const filter = {};

    // 🔍 Search Filter
    if (searchFilter) {
        filter.job_sector_name = { $regex: searchFilter, $options: 'i' };
    }

    // 📅 Date Filter
    if (dateFilter) {
        const today = moment().startOf('day');
        const now = moment().endOf('day');
        let startDate, endDate;

        switch (dateFilter) {
            case 'today':
                startDate = today.unix();
                endDate = now.unix();
                break;
            case 'yesterday':
                startDate = today.subtract(1, 'days').unix();
                endDate = now.subtract(1, 'days').unix();
                break;
            case 'this_week':
                startDate = moment().startOf('week').unix();
                endDate = moment().endOf('week').unix();
                break;
            case 'this_month':
                startDate = moment().startOf('month').unix();
                endDate = moment().endOf('month').unix();
                break;
            case 'custom':
                if (fromDate && toDate) {
                    startDate = moment(fromDate, 'YYYY-MM-DD').startOf('day').unix();
                    endDate = moment(toDate, 'YYYY-MM-DD').endOf('day').unix();
                }
                break;
        }

        if (startDate && endDate) {
            filter.job_sector_created_at = { $gte: startDate, $lte: endDate };
        }
    }

    // 📄 Pagination and Data Retrieval
    const total = await JobSectorModel.countDocuments(filter);
    const data = await JobSectorModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ job_sector_created_at: -1 });

    return {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        data,
    };
};

// JOB SECTOR CREATE SERVICE
exports.createJobSector = async (data) => {
    const existingSector = await JobSectorModel.findOne({ job_sector_name: data.job_sector_name });

    if (existingSector) {
        return { status: false, message: 'Job sector name already exists' };
    }

    const newSector = new JobSectorModel({
        job_sector_name: data.job_sector_name,
        job_sector_status: data.job_sector_status || 0,
    });

    await newSector.save();

    return {
        status: 200,
        message: 'Job sector created successfully',
        jsonData: newSector,
    };
};

// JOB SECTOR UPDATE SERVICE
exports.updateJobSector = async (id, data) => {
    const allowedFields = ['job_sector_name', 'job_sector_status'];
    const updateData = {};

    allowedFields.forEach(field => {
        if (data[field] !== undefined) updateData[field] = data[field];
    });

    const updatedSector = await JobSectorModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedSector) {
        return { status: 404, message: 'Job sector not found' };
    }

    return { updatedSector };
};

// JOB PREFERENCES LIST SERVICE
exports.getCareerPreferencesList = async () => {

    const data = await CareerPreferencesModel.find();

    return {
        status: 200,
        message: 'Career preferences fetched successfully',
        jsonData: {
            data: data
        },
    };
};

// ADD CAREER PREFERENCE SERVICE
exports.addCareerPreference = async (data) => {
    try {
        const newPreference = new CareerPreferencesModel({
            careerPreferenceName: data.careerPreferenceName,
            careerPreferenceDescription: data.careerPreferenceDescription,
        });

        await newPreference.save();

        return {
            status: 200,
            message: 'Career preference added successfully',
        };
    } catch (error) {
        console.error('Error in addCareerPreference Service:', error);
        throw error;
    }
};