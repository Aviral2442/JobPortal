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
        const { category_name, category_status, category_job_sector } = req.body;

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
            category_job_sector,
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

// GET JOB CATEGORY LIST USING SECTOR ID CONTROLLER
exports.getJobCategoryListUsingSectorId = async (req, res) => {
    try {
        const sectorId = req.params.sectorId;
        if (!sectorId) {
            return res.status(400).json({
                status: 400,
                message: 'Sector ID is required',
            });
        }
        const result = await JobCategoryService.getJobCategoryListUsingSectorId(sectorId);
        res.status(200).json({
            status: 200,
            message: 'Job category list fetched successfully',
            jsonData: result.jsonData,});
    } catch (error) {
        console.error('Error in getJobCategoryListUsingSectorId Controller:', error);
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

// GET SUBCATEGORY LIST USING CATEGORY ID CONTROLLER
exports.getSubCategoryListUsingCategoryId = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        if (!categoryId) {
            return res.status(400).json({
                status: 400,
                message: 'Category ID is required',
            });
        }
        const result = await JobCategoryService.getSubCategoryListUsingCategoryId(categoryId);
        res.status(200).json({
            status: 200,
            message: 'Job subcategory list fetched successfully',
            jsonData: result.jsonData,
        });
    } catch (error) {
        console.error('Error in getSubCategoryListUsingCategoryId Controller:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

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

// JOB APPLIED LIST OF STUDENTS CONTROLLER
exports.jobAppliedListOfStudents = async (req, res) => {

    try {
        const result = await JobCategoryService.jobAppliedListOfStudents(req.query);

        res.status(200).json({
            status: 200,
            message: 'Job applied list of students fetched successfully',
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

// UPCOMMING JOB FOR STUDENTS CONTROLLER
exports.upcommingJobForStudents = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const response = await JobCategoryService.upcommingJobForStudents(studentId);
        return res.status(response.status).json({
            status: response.status,
            message: response.message,
            jsonData: response.jsonData || null,
        });
    } catch (error) {
        console.error("Upcomming Job For Students Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// UPDATE JOB STATUS CONTROLLER
exports.updateJobStatus = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const { updateColumnName, updateValue } = req.body;
        const response = await JobCategoryService.updateJobStatus(jobId, updateColumnName, updateValue);
        return res.status(response.status).json({
            status: response.status,
            message: response.message,
        });
    }
    catch (error) {
        console.error("Update Job Status Controller Error:", error);
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

// FEATURED JOBS FOR STUDENT CONTROLLER
exports.featuredJobsForStudent = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const response = await JobCategoryService.featuredJobsForStudent(studentId);
        return res.status(response.status).json({
            status: response.status,
            message: response.message,
            jsonData: response.jsonData || null,
        });
    } catch (error) {
        console.error("Featured Jobs For Student Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// JOB LIST SECTOR WISE CONTROLLER
exports.jobListSectorWise = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const response = await JobCategoryService.jobListSectorWise(studentId);
        return res.status(response.status).json({
            status: response.status,
            message: response.message,
            jsonData: response.jsonData,
        });
    } catch (error) {
        console.error("Job List Sector Wise Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// PRIVATE SECTOR JOB LIST CONTROLLER
exports.privateSectorJobList = async (req, res) => {
    try {
        const result = await JobCategoryService.privateSectorJobList(req.query);

        res.status(200).json({
            status: 200,
            message: 'Private sector job list fetched successfully',
            jsonData: result,
        });
    } catch (error) {
        console.error('Error in privateSectorJobList Controller:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// GOVERNMENT SECTOR JOB LIST CONTROLLER
exports.governmentSectorJobList = async (req, res) => {
    try {
        const result = await JobCategoryService.governmentSectorJobList(req.query);

        res.status(200).json({
            status: 200,
            message: 'Government sector job list fetched successfully',
            jsonData: result,
        });
    } catch (error) {
        console.error('Error in governmentSectorJobList Controller:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// PSU SECTOR JOB LIST CONTROLLER
exports.psuSectorJobList = async (req, res) => {
    try {
        const result = await JobCategoryService.psuSectorJobList(req.query);

        res.status(200).json({
            status: 200,
            message: 'PSU sector job list fetched successfully',
            jsonData: result,
        });
    } catch (error) {
        console.error('Error in psuSectorJobList Controller:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// ALL SECTOR JOB LIST CONTROLLER
exports.governmentAndPsuSectorJobList = async (req, res) => {
    try {
        const result = await JobCategoryService.governmentAndPsuSectorJobList(req.query);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in allSectorJobList Controller:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// JOB FULL DETAILS BY ID CONTROLLER
exports.jobFullDetailsById = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const response = await JobCategoryService.jobFullDetailsById(jobId);
        return res.status(response.status).json({
            status: response.status,
            message: response.message,
            jsonData: response.jsonData || null,
        });
    } catch (error) {
        console.error("Job Full Details By Id Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// GET ADMIT CARD LIST BY STUDENT ID CONTROLLER
exports.getAdmitCardListByStudentId = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const response = await JobCategoryService.getAdmitCardListByStudentId(studentId);
        return res.status(response.status).json({
            status: response.status,
            message: response.message,
            jsonData: response.jsonData || null,
        });
    } catch (error) {
        console.error("Job admit card By Id Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// GOVERNMENT ADMIN CARD LIST CONTROLLER
exports.govAdminCardList = async (req, res) => {
    try {
        const result = await JobCategoryService.govAdminCardList(req.query);

        res.status(200).json({
            status: 200,
            message: 'Government admin card list fetched successfully',
            jsonData: result,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// ADD ADMIT CARD CONTROLLER
exports.addAdmitCard = async (req, res) => {
    try {
        const result = await JobCategoryService.addAdmitCard(req.body);
        console.log("Add Admit Card Result:", result);
        return res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// GET ADMIT CARD DETAILS BY ID CONTROLLER
exports.getAdmitCardListById = async (req, res) => {
    try {
        const admitCardId = req.params.admitCardId;
        const response = await JobCategoryService.getAdmitCardListById(admitCardId);
        return res.status(response.status).json({
            status: response.status,
            message: response.message,
            jsonData: response.jsonData || null,
        });
    } catch (error) {
        console.error("Get Admit Card Details By Id Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};


// UPDATE ADMIT CARD CONTROLLER
exports.updateAdmitCard = async (req, res) => {
    try {
        const admitCardId = req.params.admitCardId;
        const updateData = req.body;
        const result = await JobCategoryService.updateAdmitCard(admitCardId, updateData);
        return res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// PSU ADMIN CARD LIST CONTROLLER
exports.psuAdminCardList = async (req, res) => {
    try {
        const result = await JobCategoryService.psuAdminCardList(req.query);

        res.status(200).json({
            status: 200,
            message: 'PSU admin card list fetched successfully',
            jsonData: result,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// GOVERNMENT ANSWER KEY LIST CONTROLLER
exports.govAnswerKeyList = async (req, res) => {
    try {
        const result = await JobCategoryService.govAnswerKeyList(req.query);
        res.status(200).json({
            status: 200,
            message: 'Government answer key list fetched successfully',
            jsonData: result,
        });
    } catch (error) {
        console.error('Error in govAnswerKeyList Controller:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// PSU ANSWER KEY LIST CONTROLLER
exports.psuAnswerKeyList = async (req, res) => {
    try {
        const result = await JobCategoryService.psuAnswerKeyList(req.query);
        res.status(200).json({
            status: 200,
            message: 'PSU answer key list fetched successfully',
            jsonData: result,
        });
    } catch (error) {
        console.error('Error in psuAnswerKeyList Controller:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// ADD ANSWER KEY CONTROLLER
exports.addAnswerKey = async (req, res) => {
    try {
        const result = await JobCategoryService.addAnswerKey(req.body);
        console.log("Add Answer Key Result:", result);
        return res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// GET ANSWER KEY DETAILS BY ID CONTROLLER
exports.getAnswerKeyListById = async (req, res) => {
    try {
        const answerKeyId = req.params.answerKeyId;
        const response = await JobCategoryService.getAnswerKeyListById(answerKeyId);
        return res.status(response.status).json({
            status: response.status,
            message: response.message,
            jsonData: response.jsonData || null,
        });
    } catch (error) {
        console.error("Get Answer Key Details By Id Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// UPDATE ANSWER KEY CONTROLLER
exports.updateAnswerKey = async (req, res) => {
    try {
        const answerKeyId = req.params.answerKeyId;
        const updateData = req.body;
        const result = await JobCategoryService.updateAnswerKey(answerKeyId, updateData);
        return res.status(result.status).json(result);
} catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// GOVERNMENT RESULT LIST CONTROLLER
exports.govResultList = async (req, res) => {
    try {
        const result = await JobCategoryService.govResultList(req.query);
        res.status(200).json({
            status: 200,
            message: 'Government result list fetched successfully',
            jsonData: result,
        });
    } catch (error) {
        console.error('Error in govResultList Controller:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// PSU RESULT LIST CONTROLLER
exports.psuResultList = async (req, res) => {
    try {
        const result = await JobCategoryService.psuResultList(req.query);
        res.status(200).json({
            status: 200,
            message: 'PSU result list fetched successfully',
            jsonData: result,
        });
    } catch (error) {
        console.error('Error in psuResultList Controller:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// ADD RESULT CONTROLLER
exports.addResult = async (req, res) => {
    try {
        const result = await JobCategoryService.addResult(req.body);
        console.log("Add Result:", result);
        return res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// GET RESULT DETAILS BY ID CONTROLLER
exports.getResultListById = async (req, res) => {
    try {
        const resultId = req.params.resultId;
        const response = await JobCategoryService.getResultListById(resultId);
        return res.status(response.status).json({
            status: response.status,
            message: response.message,
            jsonData: response.jsonData || null,
        });
    } catch (error) {
        console.error("Get Result Details By Id Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// UPDATE RESULT CONTROLLER
exports.updateResult = async (req, res) => {
    try {
        const resultId = req.params.resultId;
        const updateData = req.body;
        const result = await JobCategoryService.updateResult(resultId, updateData);
        return res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// ...................................  DOCUMENT CONTROLLERS ....................................................
exports.getDocumentList = async (req, res) => {
    try {
        const result = await JobCategoryService.getDocumentList(req.query);
        res.status(200).json({
            status: 200,
            message: 'Document list fetched successfully',
            jsonData: result,
        });
    } catch (error) {
        console.error('Error in getDocumentList Controller:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// ADD DOCUMENT CONTROLLER
exports.addDocument = async (req, res) => {
    try {
        const result = await JobCategoryService.addDocument(req.body);
        console.log("Add Document Result:", result);
        return res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// UPDATE DOCUMENT CONTROLLER
exports.updateDocument = async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const updateData = req.body;
        const result = await JobCategoryService.updateDocument(documentId, updateData);
        return res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// GET DOCUMENT DETAILS BY ID CONTROLLER
exports.getDocumentListById = async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const response = await JobCategoryService.getDocumentListById(documentId);
        return res.status(response.status).json({
            status: response.status,
            message: response.message,
            jsonData: response.jsonData || null,
        });
    } catch (error) {
        console.error("Get Document Details By Id Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// GET STATE DATA
exports.getStateData = async (req, res) => {
    try {
        const stateData = await JobCategoryService.getStateData();
        return res.status(stateData.status).json({
            status: stateData.status,
            message: stateData.message,
            jsonData: stateData.jsonData || null,
        });
    } catch (error) {
        console.error("Get State Data Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// GET CITY DATA BY STATE ID
exports.getCityDataByStateId = async (req, res) => {
    try {
        const stateId = req.params.stateId;
        const search = req.query.search || "";

        if (!stateId) {
            return res.status(400).json({
                status: 400,
                message: "State ID is required",
            });
        }

        const cityData = await JobCategoryService.getCityDataByStateId(stateId, search);

        return res.status(cityData.status).json({
            status: cityData.status,
            message: cityData.message,
            jsonData: cityData.jsonData || null,
        });

    } catch (error) {
        console.error("Search City Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};
