const JobType = require('../models/JobTypeModel');
const moment = require('moment');
const { buildDateFilter } = require('../utils/dateFilters');
const { buildPagination } = require('../utils/paginationFilters');

// JOB TYPE LIST SERVICE
exports.getJobTypeList = async (query) => {
    try {
        const {
            dateFilter,
            fromDate,
            toDate,
            searchFilter,
            page,
            limit
        } = query;

        let filter = {};

        // 🔍 Search filter
        if (searchFilter) {
            filter.jobType_name = { $regex: searchFilter, $options: "i" };
        }

        // 📅 Date filter (Reusable)
        const dateQuery = buildDateFilter({
            dateFilter,
            fromDate,
            toDate,
            dateField: "jobType_created_at"
        });

        filter = { ...filter, ...dateQuery };

        // 📄 Pagination (Reusable)
        const { skip, limit: finalLimit, currentPage } = buildPagination({
            dateFilter,
            fromDate,
            toDate,
            searchFilter,
            page,
            limit
        });

        // Database Query
        const totalCount = await JobType.countDocuments(filter);
        const jobTypes = await JobType.find(filter)
            .sort({ jobType_created_at: -1 })
            .skip(skip)
            .limit(finalLimit);

        return {
            result: 200,
            message: "Job Type list fetched successfully",
            totalCount,
            currentPage,
            totalPages: Math.ceil(totalCount / finalLimit),
            jsonData: {
                jobTypes: jobTypes
            }
        };
    } catch (error) {
        return {
            result: 500,
            message: "Internal server error",
            error: error.message
        };
    }
};

// CREATE JOB TYPE SERVICE
exports.createJobType = async (data) => {
    try {
        const newJobType = new JobType({
            job_type_name: data.job_type_name
        });

        const savedJobType = await newJobType.save();

        return {
            success: 200,
            message: `Job Type created successfully`,
            jsonData: savedJobType
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};