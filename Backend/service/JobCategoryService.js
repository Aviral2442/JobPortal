const Job = require('../models/JobModel');
const Student = require('../models/studentModel');
const JobAppliedMapper = require('../models/JobAppliedMapperModel');
const JobCategoryModel = require('../models/JobCategoryModel');
const JobSubCategoryModel = require('../models/JobSubCategoryModel');
const moment = require('moment');

// Job Category List Service with Filters and Pagination
exports.getJobCategoryList = async (query) => {
    const {
        dateFilter,
        fromDate,
        toDate,
        searchFilter,
        page = 1,
        limit = 10
    } = query;

    const skip = (page - 1) * limit;
    const filter = {};

    // Search Filter
    if (searchFilter) {
        filter.category_name = { $regex: searchFilter, $options: 'i' };
    }

    // Date Filter
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
            filter.category_created_at = { $gte: startDate, $lte: endDate };
        }
    }

    // Pagination and Data Retrieval
    const total = await JobCategoryModel.countDocuments(filter);
    const data = await JobCategoryModel.find(filter)
        .populate({ path: 'category_job_sector', model: 'JobSector', select: 'job_sector_name' })
        .skip(skip)
        .limit(limit)
        .sort({ category_created_at: -1 });

    return {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        data
    };
};

// Job Category Service
exports.createJobCategory = async (data) => {
    try {
        const existingCheckName = await JobCategoryModel.findOne({ category_name: data.category_name });

        if (existingCheckName) {
            return { status: false, message: 'Category name already exists' };
        }

        const category_slug = data.category_name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

        const newCategory = new JobCategoryModel({
            category_name: data.category_name,
            category_job_sector: data.category_job_sector,
            category_image: data.category_image,
            category_slug,
            category_status: data.category_status || 0,
        });

        await newCategory.save();

        return {
            status: 200,
            message: 'Job category created successfully',
            jsonData: newCategory,
        };
    } catch (error) {
        console.error('Error in createJobCategory Service:', error);
        throw error;
    }
};

// Update Job Category Service
exports.updateJobCategory = async (categoryId, data) => {
    try {
        const allowedFields = [
            'category_name',
            'category_image',
            'category_slug',
            'category_status',
            'category_job_sector',
            'category_updated_at'
        ];

        const updateData = {};
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        });

        if (data.category_name) {
            updateData.category_slug = data.category_name.toLowerCase().replace(/\s+/g, '-');
        }

        const updatedCategory = await JobCategoryModel.findByIdAndUpdate(categoryId, updateData, { new: true });

        if (!updatedCategory) {
            return { status: 404, message: 'Job category not found' };
        }

        return {
            updatedCategory
        };

    } catch (error) {
        console.error('Error in updateJobCategory Service:', error);
        throw error;
    }
};

// Job SubCategory List Service with Filters and Pagination
exports.getJobSubCategoryList = async (query) => {
    const {
        dateFilter,
        fromDate,
        toDate,
        searchFilter,
        page = 1,
        limit = 10
    } = query;

    const skip = (page - 1) * limit;
    const filter = {};

    // Search Filter
    if (searchFilter) {
        filter.subcategory_name = { $regex: searchFilter, $options: 'i' };
    }

    // Date Filter
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
            filter.subcategory_created_at = { $gte: startDate, $lte: endDate };
        }

    }

    // Pagination and Data Retrieval
    const total = await JobSubCategoryModel.countDocuments(filter);
    const data = await JobSubCategoryModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ subcategory_created_at: -1 })
        .populate({
            path: 'subcategory_category_id',
            select: 'category_name'
        });

    return {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        data
    };
};

// Create Job Sub Category Service
exports.createJobSubCategory = async (data) => {
    try {

        const existingCheckName = await JobSubCategoryModel.findOne({ subcategory_name: data.subcategory_name });

        if (existingCheckName) {
            return { status: false, message: 'Subcategory name already exists' };
        }

        const subcategory_slug = data.subcategory_name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

        const newSubCategory = new JobSubCategoryModel({
            subcategory_category_id: data.subcategory_category_id,
            subcategory_name: data.subcategory_name,
            subcategory_slug,
            subcategory_image: data.subcategory_image
        });

        await newSubCategory.save();

        return {
            newSubCategory
        };

    } catch (error) {
        console.error('Error in createJobSubCategory Service:', error);
        throw error;
    }
};

// Update Job Sub Category Service
exports.updateJobSubCategory = async (subcategoryId, data) => {

    try {
        const allowedFields = [
            'subcategory_category_id',
            'subcategory_name',
            'subcategory_image',
            'subcategory_slug',
            'subcategory_status',
            'subcategory_updated_at'
        ];

        const updateData = {};
        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        }

        if (data.subcategory_name) {
            updateData.subcategory_slug = data.subcategory_name.toLowerCase().replace(/\s+/g, '-');
        }

        const result = await JobSubCategoryModel.findByIdAndUpdate(subcategoryId, updateData, { new: true });
        if (!result) {
            return { status: 404, message: 'Subcategory not found' };
        }

        return {
            result
        };
    } catch (error) {
        console.error('Error in updateJobSubCategory Service:', error);
        throw error;
    }
};

// APPLY ON JOB SERVICE
exports.applyOnJob = async (data) => {
    try {
        const { jobId, studentId } = data;

        // 1. Check Job
        const job = await Job.findById(jobId);
        if (!job) {
            return { status: 404, message: "Job not found" };
        }

        // 2. Check Student
        const student = await Student.findById(studentId);
        if (!student) {
            return { status: 404, message: "Student not found" };
        }

        // 3. Check if already applied
        const existingApplication = await JobAppliedMapper.findOne({
            studentId: student._id,
            jobId: job._id,
        });

        if (existingApplication) {
            return {
                status: 409,
                message: "You have already applied for this job",
            };
        }

        // 4. Create application
        const application = await JobAppliedMapper.create({
            studentId: student._id,
            jobId: job._id,
            applicationStatus: "applied",
        });

        return {
            status: 200,
            message: "Job application successful",
            jsonData: {
                applicationId: application._id,
            },
        };

    } catch (error) {
        console.error("Apply Job Service Error:", error);
        return {
            status: 500,
            message: "Server error",
        };
    }
};

// FETCH STUDENT APPLIED JOBS SERVICE
exports.studentAppliedJobsOn = async (studentId) => {
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return { status: 404, message: "Student not found" };
        }

        const appliedJobs = await JobAppliedMapper.find({ studentId })
            .populate({ path: 'jobId', model: 'Jobs', select: 'job_title job_category job_sector job_type' })
            .exec();

        const appliedJobsCount = appliedJobs.length;
        return {
            status: 200,
            message: "Applied jobs fetched successfully",
            jsonData: {
                appliedJobslist: appliedJobs,
                appliedJobsCount: appliedJobsCount
            },
        }
    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        return {
            status: 500,
            message: "Server error",
        };
    }
};

// JOB APPLIED LIST OF STUDENTS SERVICE
exports.jobAppliedListOfStudents = async (query) => {
    const {
        dateFilter,
        fromDate,
        toDate,
        searchFilter,
        page = 1,
        limit = 10
    } = query;

    const skip = (page - 1) * limit;
    const filter = {};

    // Search Filter
    if (searchFilter) {
        filter.$or = [
            { 'studentId.first_name': { $regex: searchFilter, $options: 'i' } },
            { 'jobId.job_title': { $regex: searchFilter, $options: 'i' } }
        ];
    }

    // Date Filter
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
            filter.appliedAt = { $gte: startDate, $lte: endDate };
        }
    }

    // Pagination and Data Retrieval
    const total = await JobAppliedMapper.countDocuments(filter);
    const data = await JobAppliedMapper.find(filter)
        .populate({ path: 'studentId', model: 'student', select: 'studentFirstName studentLastName studentEmail' })
        .populate({ path: 'jobId', model: 'Jobs', select: 'job_title job_category job_sector job_type' })
        .skip(skip)
        .limit(limit)
        .sort({ appliedAt: -1 });

    return {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        data
    };
};

// UPCOMMING JOBS FOR STUDENTS SERVICE
exports.upcommingJobForStudents = async (studentId) => {
    try {

        const student = await Student.findById(studentId);
        if (!student) {
            return { status: 404, message: "Student not found" };
        }

        const studentSector = student.studentJobSector;

        const sevenDaysFromNow = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);

        console.log(sevenDaysFromNow);

        const upcommingJobSectorWise = await Job.find({
            job_sector: studentSector,
            job_start_date: { $gte: sevenDaysFromNow }
        })

        const upcommingJobSectorWiseCount = upcommingJobSectorWise.length;

        return {
            status: 200,
            message: "Upcomming jobs fetched successfully",
            jsonData: {
                upcommingJobSectorWiseCount,
                upcommingJobSectorWise
            },
        }

    } catch (error) {
        console.error("Error in upcommingJobForStudents Service:", error);
        return {
            status: 500,
            message: "Server error",
        };
    }
};

// UPDATE JOB STATUS SERVICE
exports.updateJobStatus = async (jobId, updateColumnName, updateValue) => {
    try {

        const job = await Job.findById(jobId);
        if (!job) {
            return { status: 404, message: "Job not found" };
        }

        const validColumns = ['job_status', 'jobRecommendation', 'jobFeatured'];
        if (!validColumns.includes(updateColumnName)) {
            return { status: 400, message: "Invalid column name for update" };
        }

        const updateJobStatus = await Job.findByIdAndUpdate(jobId, {
            [updateColumnName]: updateValue
        }, { new: true });

        return {
            status: 200,
            message: "Job status updated successfully",
        };

    } catch (error) {
        console.error("Error in updateJobStatus Service:", error);
        return {
            status: 500,
            message: "Server error",
        };
    }
};

// RECOMMEND JOBS FOR STUDENT SERVICE
exports.recommendJobsForStudent = async (studentId) => {
    try {

        // i have to create a recommendation logic based on student's preferences and past applications

    } catch (error) {
        console.error("Error in recommendJobsForStudent Service:", error);
        return {
            status: 500,
            message: "Server error",
        };
    }
};