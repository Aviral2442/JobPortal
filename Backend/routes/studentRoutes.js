const express = require('express');
const router = express.Router();
const upload = require('../middleware/JobCategoryUploadMidd');
const studentController = require('../controllers/studentController');

router.get('/students_list', studentController.studentListService);
router.post('/student_registration', upload('StudentProfile').single('studentProfilePic'), studentController.studentRegistration);
router.post('/student_login', studentController.studentLogin);
router.post('/studentForgetPassword', studentController.studentForgetPassword);
router.post('/verifyStudentOtp', studentController.verifyStudentOtp);
router.post('/resetStudentPassword', studentController.resetStudentPassword);
router.put('/updateStudentAddress/:studentId', studentController.updateStudentAddress);
router.put('/updateStudentBasicDetails/:studentId', studentController.updateStudentBasicDetail);
router.put('/updateStudentBankDetails/:studentId', upload('StudentBankDetails').single('passbookUrl'), studentController.updateStudentBankDetails);
router.put('/updateStudentBodyDetails/:studentId', studentController.updateStudentBodyDetails);

module.exports = router;
