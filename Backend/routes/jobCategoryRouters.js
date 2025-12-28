const express = require('express');
const router = express.Router();
const upload = require('../middleware/JobCategoryUploadMidd');
const JobCategoryController = require('../controllers/JobCategoryController');
const JobSectorController = require('../controllers/JobSectorController');
const JobTypeController = require('../controllers/JobTypeController');

// Job Category Routes
router.get('/get_job_category_list', JobCategoryController.getJobCategoryList);
router.post('/create_job_category', upload('Category').single('category_image'), JobCategoryController.createJobCategory);
router.put('/update_job_category/:id', upload('Category').single('category_image'), JobCategoryController.updateJobCategory);

// Job SubCategory Routes
router.get('/get_job_subcategory_list', JobCategoryController.getJobSubCategoryList);
router.post('/create_job_subcategory', upload('SubCategory').single('subcategory_image'), JobCategoryController.createJobSubCategory);
router.put('/update_job_subcategory/:id', upload('SubCategory').single('subcategory_image'), JobCategoryController.updateJobSubCategory);

// Job Sector Routes
router.get('/get_job_sector_list', JobSectorController.getJobSectorList);
router.post('/create_job_sector', JobSectorController.createJobSector);
router.put('/update_job_sector/:id', JobSectorController.updateJobSector);

// Job Type Routes
router.get('/get_job_type_list', JobTypeController.getJobTypeList);
router.post('/create_job_type', JobTypeController.createJobType);
router.put('/update_job_type/:id', JobTypeController.updateJobType);

// CAREER PREFERENCES ROUTE
router.get('/get_career_preferences_list', JobSectorController.getCareerPreferencesList);
router.post('/add_career_preference', JobSectorController.addCareerPreference);

module.exports = router;
