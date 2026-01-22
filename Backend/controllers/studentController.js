const studentService = require("../service/studentService");

// STUDENT LIST CONTROLLER
exports.studentListService = async (req, res) => {
    try {
        const result = await studentService.studentListService(req.query);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};

// STUDENT LOGIN LOGOUT HISTORY CONTROLLER
exports.studentLoginLogoutHistory = async (req, res) => {
    try {
        const result = await studentService.studentLoginLogoutHistory(req.query);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};

// STUDENT REGISTRATION CONTROLLER
exports.studentRegistration = async (req, res) => {
    try {
        const result = await studentService.studentRegistration(req.body);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
        });
    }
};

// STUDENT ALL DETAILS CONTROLLER
exports.studentAllDetails = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const result = await studentService.studentAllDetails(studentId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};

// STUDENT LOGIN CONTROLLER
exports.studentLogin = async (req, res) => {
    try {
        const result = await studentService.studentLogin(req.body);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};

// STUDENT LOGOUT CONTROLLER
exports.studentLogout = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const result = await studentService.studentLogout(studentId);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};

// STUDENT FORGET PASSWORD CONTROLLER
exports.studentForgetPassword = async (req, res) => {
    try {

        const result = await studentService.studentForgetPassword(req.body);
        return res.status(result.status).json(result);

    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// VERIFY STUDENT OTP CONTROLLER
exports.verifyStudentOtp = async (req, res) => {
    try {
        const result = await studentService.verifyStudentOtp(req.body);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// RESET STUDENT PASSWORD CONTROLLER
exports.resetStudentPassword = async (req, res) => {
    try {
        const result = await studentService.resetStudentPassword(req.body);
        return res.status(result.status).json(result);
    }
    catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// UPDATE STUDENT ADDRESS CONTROLLER
exports.updateStudentAddress = async (req, res) => {

    try {
        const studentId = req.params.studentId;
        const studentAddressData = req.body;
        const result = await studentService.updateStudentAddress(studentId, studentAddressData);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }

};

// UPDATE STUDENT BASIC DETAIL CONTROLLER
exports.updateStudentBasicDetail = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const studentBasicData = req.body;
        const result = await studentService.updateStudentBasicDetail(studentId, studentBasicData);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// UPDATE STUDENT BANK DETAILS CONTROLLER
exports.updateStudentBankDetails = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const result = await studentService.updateStudentBankDetails(studentId, req.body);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// UPDATE STUDENT BODY DETAILS CONTROLLER
exports.updateStudentBodyDetails = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const studentBodyData = req.body;
        const result = await studentService.updateStudentBodyDetails(studentId, studentBodyData);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// UPDATE STUDENT CAREER PREFERENCES CONTROLLER
exports.updateStudentPreferences = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const studentPreferencesData = req.body;
        const result = await studentService.updateStudentPreferences(studentId, studentPreferencesData);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// UPDATE STUDENT CERTIFICATES CONTROLLER
exports.updateStudentCertificates = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const studentCertificateData = req.body;
        const result = await studentService.updateStudentCertificates(studentId, studentCertificateData);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// UPDATE STUDENT DOCUMENT UPLOAD CONTROLLER
exports.updateStudentDocumentUpload = async (req, res) => {
    try {
        const studentId = req.params.studentId;

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                req.body[file.fieldname] = `/uploads/StudentDocuments/${file.filename}`;
            });
        }

        const studentDocumentData = req.body;
        const result = await studentService.updateStudentDocumentUpload(studentId, studentDocumentData);

        return res.status(result.status).json(result);

    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// UPDATE STUDENT EDUCATION CONTROLLER
exports.updateStudentEducation = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const studentEducationData = req.body;
        const result = await studentService.updateStudentEducation(studentId, studentEducationData);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// UPDATE STUDENT EMERGENCY DATA CONTROLLER
exports.updateStudentEmergencyData = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const studentEmergencyData = req.body;
        const result = await studentService.updateStudentEmergencyData(studentId, studentEmergencyData);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// UPDATE STUDENT PARENTS INFO CONTROLLER
exports.updateStudentParentsInfo = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const studentParentsData = req.body;
        const result = await studentService.updateStudentParentsInfo(studentId, studentParentsData);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// UPDATE STUDENT SKILLS MODEL CONTROLLER
exports.updateStudentSkills = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const studentSkillsData = req.body;
        const result = await studentService.updateStudentSkills(studentId, studentSkillsData);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// UPDATE STUDENT SOCIAL LINK CONTROLLER
exports.updateStudentSocialLink = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const studentSocialLinkData = req.body;
        const result = await studentService.updateStudentSocialLink(studentId, studentSocialLinkData);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// UPDATE STUDENT WORK EXPERIENCE CONTROLLER
exports.updateStudentWorkExperience = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const studentWorkExperienceData = req.body;
        const result = await studentService.updateStudentWorkExperience(studentId, studentWorkExperienceData);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// STUDENT PROGRESS METER CONTROLLER
exports.studentProgressMeter = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const result = await studentService.studentProgressMeter(studentId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// UPLOAD STUDENT RESUME CONTROLLER
exports.uploadStudentResume = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const studentResumeData = req.file ? { studentResumeFile: `/uploads/StudentResume/${req.file.filename}` } : null;
        const result = await studentService.uploadStudentResume(studentId, studentResumeData);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// STUDENT REMOVE NOTIFICATION CONTROLLER
exports.studentRemoveNotification = async (req, res) => {
    try {

        const data = {
            studentId: req.body.studentId,
            notificationId: req.body.notificationId
        };

        const result = await studentService.studentRemoveNotification(data);
        return res.status(result.status).json(result);

    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// NOTIFICATION LIST FOR STUDENT CONTROLLER
exports.notificationListForStudent = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const result = await studentService.notificationListForStudent(studentId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};