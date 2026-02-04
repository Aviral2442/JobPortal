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
router.put('/update_career_preference/:id', JobSectorController.updateCareerPreference);

// APPLY ON JOB ROUTE
router.post('/apply_on_job', JobCategoryController.applyOnJob);
router.get('/student_applied_jobs_list_and_counts/:studentId', JobCategoryController.studentAppliedJobsOn);
router.get('/job_applied_list_of_students', JobCategoryController.jobAppliedListOfStudents);
router.get('/upcomming_jobs_for_student/:studentId', JobCategoryController.upcommingJobForStudents);
router.post('/update_jobs_status/:jobId', JobCategoryController.updateJobStatus);
router.get('/recommended_jobs_list_for_student/:studentId', JobCategoryController.recommendJobsForStudent);
router.get('/featured_jobs_list_for_student/:studentId', JobCategoryController.featuredJobsForStudent);
router.get('/job_list_sector_wise/:studentId', JobCategoryController.jobListSectorWise);

// JOB SECTOR BASED JOB LIST ROUTES
router.get('/private_sector_job_list', JobCategoryController.privateSectorJobList);
router.get('/government_sector_job_list', JobCategoryController.governmentSectorJobList);
router.get('/psu_sector_job_list', JobCategoryController.psuSectorJobList);
router.get('/government_and_psu_sector_job_list', JobCategoryController.governmentAndPsuSectorJobList);
router.get('/job_full_details/:jobId', JobCategoryController.jobFullDetailsById);
router.get('/get_admit_card_list/:studentId', JobCategoryController.getAdmitCardListByStudentId);

// GOVERNMENT AND PSU ADMIT CARD ROUTES
router.get('/government_admit_card_list', JobCategoryController.govAdminCardList);
router.get('/psu_admit_card_list', JobCategoryController.psuAdminCardList);
router.post('/add_admit_card', JobCategoryController.addAdmitCard);
router.put('/update_admit_card/:admitCardId', JobCategoryController.updateAdmitCard);

// GOVERNMENT AND PSU ANSWER KEY ROUTES






module.exports = router;
