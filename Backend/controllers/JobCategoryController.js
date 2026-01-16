const JobCategoryService = require('../service/JobCategoryService');

// Get Job Category List Controller
exports.getJobCategoryList = async (req, res) => {

    try {
        const result = await JobCategoryService.getJobCategoryList(req.query);

        res.status(200).json({
            status: 200,
            message: 'Job category list fetched successfully',
            jsonData: result,
        });
    } catch (error) {
        console.error('Error in getJobCategoryList Controller:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }

};

// Create Job Category Controller
exports.createJobCategory = async (req, res) => {
    try {
        const { category_name, category_status } = req.body;

        if (!category_name) {
            return res.status(400).json({ status: false, message: 'Category name is required' });
        }

        if (!req.file) {
            return res.status(400).json({ status: false, message: 'Category image is required' });
        }

        const category_image = `/uploads/Category/${req.file.filename}`;

        const result = await JobCategoryService.createJobCategory({
            category_name,
            category_image,
            category_status,
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error in createJobCategory Controller:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

// Update Job Category Controller
exports.updateJobCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const updateData = req.body;

        if (req.file) {
            updateData.category_image = `/uploads/Category/${req.file.filename}`;
        }

        updateData.category_updated_at = Math.floor(Date.now() / 1000);

        const result = await JobCategoryService.updateJobCategory(categoryId, updateData);

        if (result.status === 404) {
            return res.status(404).json({ status: false, message: 'Job category not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Job category updated successfully',
            jsonData: result.updatedCategory,
        });
    } catch (error) {
        console.error('Error in updateJobCategory Controller:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get Job Subcategory List Controller
exports.getJobSubCategoryList = async (req, res) => {
    try {
        const result = await JobCategoryService.getJobSubCategoryList(req.query);
        res.status(200).json({
            status: 200,
            message: 'Job subcategory list fetched successfully',
            jsonData: result,
        });
    } catch (error) {
        console.error('Error in getJobSubCategoryList Controller:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Create Job Subcategory Controller
exports.createJobSubCategory = async (req, res) => {

    try {
        const { subcategory_category_id, subcategory_name } = req.body;

        if (!subcategory_category_id) {
            return res.status(400).json({ status: false, message: 'Subcategory category ID is required' });
        }

        if (!subcategory_name) {
            return res.status(400).json({ status: false, message: 'Subcategory name is required' });
        }

        if (!req.file) {
            return res.status(400).json({ status: false, message: 'Subcategory image is required' });
        }

        const subcategory_image = `/uploads/SubCategory/${req.file.filename}`;

        const result = await JobCategoryService.createJobSubCategory({
            subcategory_category_id,
            subcategory_name,
            subcategory_image,
        });

        res.status(200).json({
            status: 200,
            message: 'Job subcategory created successfully',
            jsonData: result,
        });
    } catch (error) {
        console.error('Error in Create Job Sub Category Controller:', error);
        res.status(500).json({ status: false, message: 'Internal server error', error: error.message });
    }

};

// Update Job Subcategory Controller
exports.updateJobSubCategory = async (req, res) => {

    try {
        const subcategoryId = req.params.id;
        const updateData = req.body;

        if (req.file) {
            updateData.subcategory_image = `/uploads/SubCategory/${req.file.filename}`;
        }

        updateData.subcategory_updated_at = Math.floor(Date.now() / 1000);

        const result = await JobCategoryService.updateJobSubCategory(subcategoryId, updateData);

        if (result.status === 404) {
            return res.status(404).json({ status: false, message: 'Job subcategory not found' });
        }

        res.status(200).json({
            status: 200,
            message: 'Job subcategory updated successfully',
            jsonData: result,
        });

    } catch (error) {
        console.error('Error in Update Job Sub Category Controller:', error);
        res.status(500).json({ status: false, message: 'Internal server error', error: error.message });
    }

};

// Apply On Job Controller
exports.applyOnJob = async (req, res) => {
    try {
        const response = await JobCategoryService.applyOnJob(req.body);

        return res.status(response.status).json({
            status: response.status,
            message: response.message,
            jsonData: response.jsonData || null,
        });

    } catch (error) {
        console.error("Apply Job Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// STUDENT APPLIED JOBS CONTROLLER
exports.studentAppliedJobsOn = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const response = await JobCategoryService.studentAppliedJobsOn(studentId);
        return res.status(response.status).json({
            status: response.status,
            message: response.message,
            jsonData: response.jsonData || null,
        });

    } catch (error) {
        console.error("Student Applied Jobs Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// RECOMMEND JOBS FOR STUDENT CONTROLLER
exports.recommendJobsForStudent = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const response = await JobCategoryService.recommendJobsForStudent(studentId);
        return res.status(response.status).json({
            status: response.status,
            message: response.message,
            jsonData: response.jsonData || null,
        });
    } catch (error) {
        console.error("Recommend Jobs For Student Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};