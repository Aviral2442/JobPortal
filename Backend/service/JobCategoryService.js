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