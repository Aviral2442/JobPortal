const express = require('express');
const router = express.Router();
const upload = require('../middleware/JobCategoryUploadMidd');
const studentController = require('../controllers/studentController');

router.get('/students_list', studentController.studentListService);
router.put('/studentAccountProgressMeter/:studentId', studentController.studentProgressMeter);
router.put('/studentAllDetails/:studentId', studentController.studentAllDetails);
router.post('/student_registration', upload('StudentProfile').single('studentProfilePic'), studentController.studentRegistration);
router.post('/student_login', studentController.studentLogin);
router.post('/studentForgetPassword', studentController.studentForgetPassword);
router.post('/verifyStudentOtp', studentController.verifyStudentOtp);
router.post('/resetStudentPassword', studentController.resetStudentPassword);
router.put('/updateStudentAddress/:studentId', studentController.updateStudentAddress);
router.put('/updateStudentBasicDetails/:studentId', studentController.updateStudentBasicDetail);
router.put('/updateStudentBankDetails/:studentId', upload('StudentBankDetails').single('passbookUrl'), studentController.updateStudentBankDetails);
router.put('/updateStudentBodyDetails/:studentId', studentController.updateStudentBodyDetails);
router.put('/updateStudentCareerPreferences/:studentId', studentController.updateStudentPreferences);
router.put('/updateStudentCertificates/:studentId', studentController.updateStudentCertificates);
router.put('/updateStudentDocumentUpload/:studentId', upload('StudentDocuments').any(), studentController.updateStudentDocumentUpload);
router.put('/updateStudentEducationDetails/:studentId', studentController.updateStudentEducation);
router.put('/updateStudentEmergencyContact/:studentId', studentController.updateStudentEmergencyData);
router.put('/updateStudentParentalInfo/:studentId', studentController.updateStudentParentsInfo);
router.put('/updateStudentSkills/:studentId', studentController.updateStudentSkills);
router.put('/updateStudentSocialLinks/:studentId', studentController.updateStudentSocialLink);
router.put('/updateStudentWorkExperience/:studentId', studentController.updateStudentWorkExperience);

module.exports = router;
