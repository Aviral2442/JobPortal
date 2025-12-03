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

// STUDENT REGISTRATION CONTROLLER
exports.studentRegistration = async (req, res) => {
    try {
        const studentProfilePic = req.file ? `/uploads/StudentProfile/${req.file.filename}` : null;
        const result = await studentService.studentRegistration({ ...req.body, studentProfilePic: studentProfilePic });
        return res.status(result.status).json(result);
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
        const passbookUrl = req.file ? `/uploads/StudentBankDetails/${req.file.filename}` : null;
        const studentBankData = { ...req.body, passbookUrl };
        const result = await studentService.updateStudentBankDetails(studentId, studentBankData);
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
