const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/students_list', studentController.studentListService);
router.get('/studentLoginLogoutHistory', studentController.studentLoginLogoutHistory);
router.put('/studentAccountProgressMeter/:studentId', studentController.studentProgressMeter);
router.get('/studentAllDetails/:studentId', studentController.studentAllDetails);
router.post('/student_registration', studentController.studentRegistration);
router.post('/studentLoginWithOtp', studentController.studentLoginWithOtp);
router.post('/student_login', studentController.studentLogin);
router.post('/studentLogout/:studentId', studentController.studentLogout);
router.post('/studentForgetPassword', studentController.studentForgetPassword);
router.post('/verifyStudentOtp', studentController.verifyStudentOtp);
router.post('/resetStudentPassword', studentController.resetStudentPassword);
router.put('/updateStudentPrimaryDetails/:studentId', studentController.updateStudentPrimaryDetails);
router.put('/updateStudentAddress/:studentId', studentController.updateStudentAddress);
router.put('/updateStudentBasicDetails/:studentId', studentController.updateStudentBasicDetail);
router.put('/updateStudentBankDetails/:studentId', studentController.updateStudentBankDetails);
router.put('/updateStudentBodyDetails/:studentId', studentController.updateStudentBodyDetails);
router.put('/updateStudentCareerPreferences/:studentId', studentController.updateStudentPreferences);
router.put('/updateStudentCertificates/:studentId', studentController.updateStudentCertificates);
router.put('/updateStudentDocumentUpload/:studentId', studentController.updateStudentDocumentUpload);
router.put('/updateStudentEducationDetails/:studentId', studentController.updateStudentEducation);
router.put('/updateStudentEmergencyContact/:studentId', studentController.updateStudentEmergencyData);
router.put('/updateStudentParentalInfo/:studentId', studentController.updateStudentParentsInfo);
router.put('/updateStudentSkills/:studentId', studentController.updateStudentSkills);
router.put('/updateStudentSocialLinks/:studentId', studentController.updateStudentSocialLink);
router.put('/updateStudentWorkExperience/:studentId', studentController.updateStudentWorkExperience);
router.put('/uploadStudentResume/:studentId', studentController.uploadStudentResume);
router.put('/removeNotification', studentController.studentRemoveNotification);
router.get('/studentNotifications/:studentId', studentController.notificationListForStudent);

router.get('/student_dashboard_data/:studentId', studentController.studentDashboardData);
router.get('/student_job_admit_card_list/:studentId', studentController.studentJobAdmitCardListWithFilter);
router.get('/student_job_answer_key_list/:studentId', studentController.studentJobAnswerKeyListWithFilter);
router.get('/student_job_result_list/:studentId', studentController.studentJobResultListWithFilter);

module.exports = router;
