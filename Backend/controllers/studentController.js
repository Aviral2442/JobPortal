const studentService = require("../service/studentService");

// STUDENT LIST CONTROLLER
exports.studentListService = async (req, res) => {
  try {
    const result = await studentService.studentListService(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

// STUDENT LOGIN LOGOUT HISTORY CONTROLLER
exports.studentLoginLogoutHistory = async (req, res) => {
  try {
    const result = await studentService.studentLoginLogoutHistory(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
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
      message: "Internal server error",
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
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

// STUDENT LOGIN CONTROLLER
exports.studentLogin = async (req, res) => {
  try {
    const result = await studentService.studentLogin(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

// Student Login USING OPT
exports.studentLoginWithOtp = async (req, res) => {
  try {
    const result = await studentService.studentLoginWithOtp(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error", error: error.message });
  }
};

// STUDENT LOGOUT CONTROLLER
exports.studentLogout = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const result = await studentService.studentLogout(studentId);
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

// STUDENT FORGET PASSWORD CONTROLLER
exports.studentForgetPassword = async (req, res) => {
  try {
    const result = await studentService.studentForgetPassword(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// VERIFY STUDENT OTP CONTROLLER
exports.verifyStudentOtp = async (req, res) => {
  try {
    const result = await studentService.verifyStudentOtp(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// RESET STUDENT PASSWORD CONTROLLER
exports.resetStudentPassword = async (req, res) => {
  try {
    const result = await studentService.resetStudentPassword(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// UPDATE STUDENT PRIMARY DETAILS CONTROLLER
exports.updateStudentPrimaryDetails = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const primaryDetailsData = req.body;
    const result = await studentService.updateStudentPrimaryDetails(studentId, primaryDetailsData);
    return res.status(result.status).json(result);
  }
  catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// UPDATE STUDENT ADDRESS CONTROLLER
exports.updateStudentAddress = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const studentAddressData = req.body;
    const result = await studentService.updateStudentAddress(
      studentId,
      studentAddressData,
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// UPDATE STUDENT BASIC DETAIL CONTROLLER
exports.updateStudentBasicDetail = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const studentBasicData = req.body;
    const result = await studentService.updateStudentBasicDetail(
      studentId,
      studentBasicData,
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// UPDATE STUDENT BANK DETAILS CONTROLLER
exports.updateStudentBankDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = await studentService.updateStudentBankDetails(
      studentId,
      req.body,
    );

    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// UPDATE STUDENT BODY DETAILS CONTROLLER
exports.updateStudentBodyDetails = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const studentBodyData = req.body;
    const result = await studentService.updateStudentBodyDetails(
      studentId,
      studentBodyData,
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// UPDATE STUDENT CAREER PREFERENCES CONTROLLER
exports.updateStudentPreferences = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const studentPreferencesData = req.body;
    const result = await studentService.updateStudentPreferences(
      studentId,
      studentPreferencesData,
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// UPDATE STUDENT CERTIFICATES CONTROLLER
exports.updateStudentCertificates = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    let certificates = [];

    // ✅ CASE 1: Flutter / bulk upload
    if (Array.isArray(req.body?.certificates)) {
      console.log("Flutter → certificates[]");
      certificates = req.body.certificates;

      // ✅ CASE 2: Postman / Web array
    } else if (Array.isArray(req.body)) {
      console.log("Web → body[]");
      certificates = req.body;

      // ✅ CASE 3: Admin Panel → single object
    } else if (req.body && typeof req.body === "object") {
      console.log("Panel → single certificate object");
      certificates = [req.body];
    } else {
      return res.status(400).json({
        status: 400,
        message: "Invalid certificate payload",
      });
    }

    // 🧹 Normalize & validate
    certificates = certificates.map((cert) => ({
      certificationName: cert.certificationName,
      issuingOrganization: cert.issuingOrganization,
      issueDate: Number(cert.issueDate),
      expirationDate: cert.expirationDate ? Number(cert.expirationDate) : null,
      credentialId: cert.credentialId || null,
      certificateUrl: cert.certificateUrl || null,
      extension: cert.extension,
      certificateFile: cert.certificateFile || null,
      certificateId: cert.certificateId || null, // for update
    }));

    console.log("Final normalized certificates:", certificates);

    const result = await studentService.updateStudentCertificates(
      studentId,
      certificates,
    );

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Certificate update error:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// UPDATE STUDENT DOCUMENT UPLOAD CONTROLLER
exports.updateStudentDocumentUpload = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const studentDocumentData = req.body;
    console.log(
      "Updating documents for studentId:",
      studentId,
      "with data:",
      studentDocumentData,
    );
    const result = await studentService.updateStudentDocumentUpload(
      studentId,
      studentDocumentData,
    );

    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// UPDATE STUDENT EDUCATION CONTROLLER
exports.updateStudentEducation = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    console.log(req.body);
    const result = await studentService.updateStudentEducation(
      studentId,
      req.body,
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// UPDATE STUDENT EMERGENCY DATA CONTROLLER
exports.updateStudentEmergencyData = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const studentEmergencyData = req.body;
    const result = await studentService.updateStudentEmergencyData(
      studentId,
      studentEmergencyData,
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// UPDATE STUDENT PARENTS INFO CONTROLLER
exports.updateStudentParentsInfo = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const studentParentsData = req.body;
    const result = await studentService.updateStudentParentsInfo(
      studentId,
      studentParentsData,
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// UPDATE STUDENT SKILLS MODEL CONTROLLER
exports.updateStudentSkills = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const data = req.body;

    if (!studentId) {
      return res.status(400).json({
        status: 400,
        message: "studentId is required"
      });
    }

    const result = await studentService.updateStudentSkills(studentId, data);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message
    });
  }
};

// UPDATE STUDENT SOCIAL LINK CONTROLLER
exports.updateStudentSocialLink = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const studentSocialLinkData = req.body;
    const result = await studentService.updateStudentSocialLink(
      studentId,
      studentSocialLinkData,
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// UPDATE STUDENT WORK EXPERIENCE CONTROLLER
exports.updateStudentWorkExperience = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    let data = req.body;

    // Parse experiences if it's a JSON string (from FormData)
    if (data.experiences && typeof data.experiences === "string") {
      try {
        data.experiences = JSON.parse(data.experiences);
      } catch (parseError) {
        console.error("Failed to parse experiences JSON:", parseError);
        return res
          .status(400)
          .json({ status: 400, message: "Invalid experiences data format" });
      }
    }

    console.log(
      "Updating work experience for studentId:",
      studentId,
      "with data:",
      data,
    );
    const result = await studentService.updateStudentWorkExperience(
      studentId,
      data,
    );
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// STUDENT PROGRESS METER CONTROLLER
exports.studentProgressMeter = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const result = await studentService.studentProgressMeter(studentId);
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// UPLOAD STUDENT RESUME CONTROLLER
exports.uploadStudentResume = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const result = await studentService.uploadStudentResume(
      studentId,
      req.body,
    );
    console.log("Upload resume result:", result);
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// STUDENT REMOVE NOTIFICATION CONTROLLER
exports.studentRemoveNotification = async (req, res) => {
  try {
    const data = {
      studentId: req.body.studentId,
      notificationId: req.body.notificationId,
    };

    const result = await studentService.studentRemoveNotification(data);
    return res.status(result.status).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// NOTIFICATION LIST FOR STUDENT CONTROLLER
exports.notificationListForStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const result = await studentService.notificationListForStudent(studentId);
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// STUDENT DASHBOARD DATA CONTROLLER
exports.studentDashboardData = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const result = await studentService.studentDashboardData(studentId);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// STUDENT JOB Admit Card LIST WITH FILTER CONTROLLER
exports.studentJobAdmitCardListWithFilter = async (req, res) => {
  try {

    const studentId = req.params.studentId;
    const filter = req.query;
    const result = await studentService.studentJobAdmitCardListWithFilter(studentId, filter);
    return res.status(result.status).json(result);

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// STUDENT JOB ANSWER KEY LIST WITH FILTER CONTROLLER
exports.studentJobAnswerKeyListWithFilter = async (req, res) => {
  try {

    const studentId = req.params.studentId;
    const filter = req.query;
    const result = await studentService.studentJobAnswerKeyListWithFilter(studentId, filter);
    return res.status(result.status).json(result);

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// STUDENT JOB RESULT LIST WITH FILTER CONTROLLER
exports.studentJobResultListWithFilter = async (req, res) => {
  try {

    const studentId = req.params.studentId;
    const filter = req.query;
    const result = await studentService.studentJobResultListWithFilter(studentId, filter);
    return res.status(result.status).json(result);

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};