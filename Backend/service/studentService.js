const { buildDateFilter } = require("../utils/dateFilters");
const { buildPagination } = require("../utils/paginationFilters");
const { currentUnixTimeStamp } = require("../utils/currentUnixTimeStamp");
const { convertIntoUnixTimeStamp } = require("../utils/convertIntoUnixTimeStamp");
const { saveBase64File } = require("../middleware/base64FileUpload");
const studentModel = require("../models/studentModel");
const studentAddressModel = require("../models/student/studentAddressModel");
const studentBasicDetailModel = require("../models/student/studentBasicDetailModel");
const StudentBankInfo = require("../models/student/studentBankDataModel");
const StudentBodyDetails = require("../models/student/studentBodyDetailModel");
const StudentPreferences = require("../models/student/studentCareerPreferenceModel");
const StudentCertifications = require("../models/student/studentCertificatesModel");
const StudentDocumentUpload = require("../models/student/studentDocumentUploadModel");
const StudentEducation = require("../models/student/studentEducationModel");
const StudentEmergencyContact = require("../models/student/studentEmergencyModel");
const StudentParentalInfo = require("../models/student/studentParentsModel");
const StudentSkills = require("../models/student/studentSkillModel");
const StudentSocialLinks = require("../models/student/studentSocialLinkModel");
const StudentExperience = require("../models/student/studentWorkExprienceModel");
const loginHistory = require("../models/LoginHistoryModel");
const JobType = require("../models/JobTypeModel");
const sendEmailOtp = require("../utils/emailOtp");
const sendMobileOtp = require("../utils/mobileNoOtp");
const NotificationModel = require("../models/NotificationModel");
const JobAppliedMapperModel = require("../models/JobAppliedMapperModel");

// STUDENT LIST SERVICE
exports.studentListService = async (query) => {
  try {
    const { dateFilter, fromDate, toDate, searchFilter, page, limit } = query;

    let filter = {};

    if (searchFilter) {
      filter.studentEmail = { $regex: searchFilter, $options: "i" };
      filter.studentMobileNo = { $regex: searchFilter, $options: "i" };
    }

    const dateQuery = buildDateFilter({
      dateFilter,
      fromDate,
      toDate,
      dateField: "studentCreatedAt",
    });

    filter = { ...filter, ...dateQuery };

    const {
      skip,
      limit: finalLimit,
      currentPage,
    } = buildPagination({
      dateFilter,
      fromDate,
      toDate,
      searchFilter,
      page,
      limit,
    });

    const totalCount = await studentModel.countDocuments(filter);
    const students = await studentModel
      .find(filter)
      .populate({
        path: "studentJobSector",
        model: "JobSector",
        select: "job_sector_name",
      })
      .sort({ studentCreatedAt: -1 })
      .skip(skip)
      .limit(finalLimit);

    return {
      result: 200,
      message: "Student list fetched successfully",
      totalCount,
      currentPage,
      totalPages: Math.ceil(totalCount / finalLimit),
      jsonData: {
        students: students,
      },
    };
  } catch (error) {
    return {
      result: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
};

// STUDENT LOGIN LOGOUT HISTORY SERVICE
exports.studentLoginLogoutHistory = async (query) => {
  try {
    const { dateFilter, fromDate, toDate, searchFilter, page, limit } = query;

    const dateQuery = buildDateFilter({
      dateFilter,
      fromDate,
      toDate,
      dateField: "createdAt",
    });

    filter = { ...dateQuery };

    const {
      skip,
      limit: finalLimit,
      currentPage,
    } = buildPagination({
      dateFilter,
      fromDate,
      toDate,
      searchFilter,
      page,
      limit,
    });

    const totalCount = await loginHistory.countDocuments(filter);
    const loginLogoutHistory = await loginHistory
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(finalLimit);

    return {
      result: 200,
      message: "Student login/logout history fetched successfully",
      totalCount,
      currentPage,
      totalPages: Math.ceil(totalCount / finalLimit),
      jsonData: {
        loginLogoutHistory: loginLogoutHistory,
      },
    };
  } catch (error) {
    return {
      result: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
};

// STUDENT PROGRESS METER SERVICE
exports.studentProgressMeter = async (studentId) => {
  try {
    const fetchStudent = await studentModel.findById(studentId);
    if (!fetchStudent) {
      return {
        result: 404,
        message: "Student not found",
        jsonData: {},
      };
    }

    const currentProfileComplete = fetchStudent.profileCompletion || {};

    const calculateCompletionPercentage = (currentProfileComplete) => {
      const totalSections = Object.keys(currentProfileComplete).length;
      const completedSections = Object.values(currentProfileComplete).filter(
        (value) => value === 1,
      ).length;
      const meterResult = Math.round(
        (completedSections / totalSections) * 100,
        2,
      );
      return meterResult;
    };

    return {
      result: 200,
      message: "Student profile completion fetched successfully",
      jsonData: {
        profileCompletion: currentProfileComplete,
        completionPercentage: calculateCompletionPercentage(
          currentProfileComplete,
        ),
      },
    };
  } catch (error) {
    return {
      result: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
};

// STUDENT ALL DETAILS SERVICE
exports.studentAllDetails = async (studentId) => {
  try {
    const studentDetails = await studentModel.findById(studentId);
    if (!studentDetails) {
      return {
        result: 404,
        message: "Student not found",
        jsonData: {},
      };
    }

    const studentPrimaryData = await studentModel.findById(studentId);
    const studentAddressData = await studentAddressModel.findOne({ studentId });
    const studentBasicData = await studentBasicDetailModel.findOne({
      studentId,
    });
    const studentBankData = await StudentBankInfo.findOne({ studentId });
    const studentBodyData = await StudentBodyDetails.findOne({ studentId });
    const studentPreferencesData = await StudentPreferences.findOne({
      studentId,
    }).populate({
      path: "preferredJobCategory",
      model: "CareerPreferences",
      select: "careerPreferenceName",
    });
    const studentCertificatesData = await StudentCertifications.findOne({
      studentId,
    });
    const studentDocumentUploadData = await StudentDocumentUpload.findOne({
      studentId,
    });
    const studentEducationData = await StudentEducation.find({ studentId });
    const studentEmergencyContactData = await StudentEmergencyContact.findOne({
      studentId,
    });
    const studentParentalInfoData = await StudentParentalInfo.findOne({
      studentId,
    });
    const studentSkillsData = await StudentSkills.findOne({ studentId });
    const studentSocialLinksData = await StudentSocialLinks.findOne({
      studentId,
    });
    const studentWorkExperienceData = await StudentExperience.findOne({
      studentId,
    });

    studentPrimaryData.studentJobSector =
      await require("../models/JobSectorModel").findById(
        studentPrimaryData.studentJobSector,
      );

    return {
      result: 200,
      message: "Student all details fetched successfully",
      jsonData: {
        studentPrimaryData,
        studentAddressData,
        studentBasicData,
        studentBankData,
        studentBodyData,
        studentPreferencesData,
        studentCertificatesData,
        studentDocumentUploadData,
        studentEducationData,
        studentEmergencyContactData,
        studentParentalInfoData,
        studentSkillsData,
        studentSocialLinksData,
        studentWorkExperienceData,
      },
    };
  } catch (error) {
    return {
      result: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
};

// STUDENT REGISTRATION SERVICE
exports.studentRegistration = async (studentData) => {
  try {
    const emailExists = await studentModel.findOne({
      studentEmail: studentData.studentEmail,
    });
    if (emailExists) {
      return {
        status: 409,
        message: "Student Entered Email is already registered",
        jsonData: {},
      };
    }

    const mobileExists = await studentModel.findOne({
      studentMobileNo: studentData.studentMobileNo,
    });
    if (mobileExists) {
      return {
        status: 409,
        message: "Student Entered Mobile No. is already registered",
        jsonData: {},
      };
    }

    if (studentData.studentReferralByCode) {
      const refStudent = await studentModel.findOne({
        studentReferralCode: studentData.studentReferralByCode,
      });

      if (!refStudent) {
        return {
          status: 400,
          message: "Invalid referral code provided",
          jsonData: {},
        };
      }

      studentData.studentReferralById = refStudent._id;
      studentData.studentReferralByCode = refStudent.studentReferralCode;
    }

    let studentProfilePic = null;
    if (studentData.studentProfilePic) {
      studentProfilePic = saveBase64File(
        studentData.studentProfilePic,
        "StudentProfile",
        "student",
        studentData.extension,
      );
    }

    const generateRandomReferralCode = async () => {
      const prefix = "CW";
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = prefix;
      for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }

      const exists = await studentModel.findOne({ studentReferralCode: code });
      if (exists) return generateRandomReferralCode();
      return code;
    };

    const newStudent = new studentModel({
      studentProfilePic,
      studentFirstName: studentData.studentFirstName,
      studentLastName: studentData.studentLastName,
      studentEmail: studentData.studentEmail,
      studentMobileNo: studentData.studentMobileNo,
      studentPassword: studentData.studentPassword,
      studentJobSector: studentData.studentJobSector,
      studentReferralCode: await generateRandomReferralCode(),
      studentReferralById: studentData.studentReferralById || null,
      studentReferralByCode: studentData.studentReferralByCode || null,
    });

    await newStudent.save();

    return {
      status: 200,
      message: "Student registered successfully",
      jsonData: {
        studentId: newStudent._id,
        studentFirstName: newStudent.studentFirstName,
        studentLastName: newStudent.studentLastName,
        studentEmail: newStudent.studentEmail,
        studentMobileNo: newStudent.studentMobileNo,
        studentJobSector: newStudent.studentJobSector,
        studentReferralCode: newStudent.studentReferralCode,
        studentProfilePic: newStudent.studentProfilePic,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during student registration",
      jsonData: {},
    };
  }
};

// STUDENT LOGIN V2 GOOGLE SERVICE
exports.studentLogin = async (studentLoginData) => {
  try {
    const { provider } = studentLoginData;

    let email = null;
    if (
      studentLoginData.studentEmailOrMobile &&
      studentLoginData.studentEmailOrMobile.includes("@")
    ) {
      email = studentLoginData.studentEmailOrMobile.toLowerCase().trim();
    }

    let student = await studentModel.findOne({
      $or: [
        { studentEmail: email },
        { studentMobileNo: studentLoginData.studentEmailOrMobile },
      ],
    });

    if (provider === "google") {
      if (!student) {
        student = await studentModel.create({
          studentFirstName: studentLoginData.studentFirstName,
          studentLastName: studentLoginData.studentLastName || "",
          studentEmail: email,
          studentProfilePic: studentLoginData.studentProfilePic || "",
          studentLastLoginType: studentLoginData.provider,
          studentJobSector: "697c55559f27582a27b27c2a",
        });
      } else {
        student.studentLastLoginType = "google";
        await student.save();
      }
    }

    else if (provider === "password") {
      if (!student) {
        return {
          status: 404,
          message: "Student not found",
        };
      }

      if (student.studentPassword !== studentLoginData.studentPassword) {
        return {
          status: 401,
          message: "Invalid password",
        };
      }

      student.studentLastLoginType = "password";
      await student.save();
    }

    else {
      return {
        status: 400,
        message: "Invalid login provider",
      };
    }

    return {
      status: 200,
      message: "Login successful",
      jsonData: {
        studentId: student._id,
        studentFirstName: student.studentFirstName,
        studentLastName: student.studentLastName,
        studentEmail: student.studentEmail,
        studentMobileNo: student.studentMobileNo,
        studentProfilePic: student.studentProfilePic,
        studentJobSector: student.studentJobSector,
        studentLastLoginType: student.studentLastLoginType,
      },
    };

  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during student login",
      error: error.message,
    };
  }
};

exports.studentLoginWithOtp = async (studentLoginCredentials) => {
  try {
    const input = studentLoginCredentials.studentEmailOrMobile.trim();
    const isEmail = input.includes("@");

    const studentLoginData = await studentModel.findOne({
      $or: [{ studentEmail: input.toLowerCase() }, { studentMobileNo: input }],
    });

    if (!studentLoginData) {
      return {
        status: 404,
        message: "Student not found with the provided email or mobile number",
        jsonData: {
          IsRedirectToRegister: true,
        },
      };
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Save OTP
    studentLoginData.studentOtp = otp;
    studentLoginData.studentOtpExpiry = expiry;
    await studentLoginData.save({ validateBeforeSave: false });

    // Login history
    await loginHistory.create({
      studentId: studentLoginData._id,
      loginType: "otpLogin",
      loginAt: currentUnixTimeStamp(),
    });

    // ===== EMAIL OTP =====
    if (isEmail) {
      const email = studentLoginData.studentEmail.toLowerCase();

      console.log(`Sending OTP to email: ${email}`, otp); // remove in prod
      await sendEmailOtp(email, otp);

      return {
        status: 200,
        message: "OTP sent to registered email successfully",
        jsonData: {
          studentId: studentLoginData._id,
          studentEmail: email,
        },
      };
    }

    // ===== MOBILE OTP =====
    const mobileNo = studentLoginData.studentMobileNo;

    const smsResult = await sendMobileOtp(mobileNo, otp);

    if (!smsResult || smsResult.success === false) {
      return {
        status: 500,
        message: "Failed to send OTP to mobile number",
        jsonData: {
          studentId: studentLoginData._id,
          studentMobileNo: mobileNo,
        },
      };
    }

    return {
      status: 200,
      message: "OTP sent to registered mobile number successfully",
      jsonData: {
        studentId: studentLoginData._id,
        studentMobileNo: mobileNo,
      },
    };
  } catch (error) {
    console.error("OTP Login Error:", error);
    return {
      status: 500,
      message: "An error occurred during student login with OTP",
      error: error.message,
    };
  }
};

// STUDENT LOGOUT SERVICE
exports.studentLogout = async (studentId) => {
  try {
    const student = await studentModel.findById(studentId);
    if (!student) {
      return {
        status: 404,
        message: "Student not found with the provided ID",
        jsonData: {},
      };
    }

    student.lastLogoutAt = currentUnixTimeStamp();
    await student.save();

    const updateLoginHistory = await loginHistory({
      studentId: studentId,
      logoutAt: currentUnixTimeStamp(),
    });

    await updateLoginHistory.save();

    return {
      status: 200,
      message: "Student logged out successfully",
      jsonData: {},
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during student logout",
      error: error.message,
    };
  }
};

// STUDENT FORGET PASSWORD SERVICE
exports.studentForgetPassword = async (studentForgetData) => {
  try {
    let forgetEmailOrMobileNo = studentForgetData.studentEmailOrMobileNo;

    if (!forgetEmailOrMobileNo) {
      return {
        status: 400,
        message: "Email or mobile number is required",
        jsonData: {},
      };
    }

    forgetEmailOrMobileNo = forgetEmailOrMobileNo.trim();

    const isEmail = forgetEmailOrMobileNo.includes("@");

    // lowercase only if it's an email
    const formattedInput = isEmail
      ? forgetEmailOrMobileNo.toLowerCase()
      : forgetEmailOrMobileNo;

    // 🔹 Find student
    const student = await studentModel.findOne({
      $or: [
        { studentEmail: formattedInput },
        { studentMobileNo: formattedInput },
      ],
    });

    if (!student) {
      return {
        status: 404,
        message: "Student not found with the provided email or mobile number",
        jsonData: {},
      };
    }

    // 🔹 Generate OTP
    const generateRandomOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const otp = generateRandomOTP();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // 🔹 Save OTP
    student.studentOtp = otp;
    student.studentOtpExpiry = expiry;
    await student.save();

    // 🔹 Send EMAIL OTP
    if (isEmail) {
      const lowercaseEmail = student.studentEmail.toLowerCase();
      console.log(`Sending OTP to email: ${lowercaseEmail}`, otp); // For testing purposes

      await sendEmailOtp(lowercaseEmail, otp);

      return {
        status: 200,
        message: "OTP sent to registered email successfully",
        jsonData: {
          studentId: student._id,
          studentEmail: student.studentEmail,
        },
      };
    }

    // 🔹 Mobile case
    const lowerCaseMobileNO = student.studentMobileNo;

    sendMobileOtp(lowerCaseMobileNO, otp);

    if (sendMobileOtp.success === false) {
      return {
        status: 500,
        message: "Failed to send OTP to mobile number",
        jsonData: {},
      };
    }
    return {
      status: 200,
      message: "OTP sent to registered mobile number successfully",
      jsonData: {
        studentId: student._id,
        studentMobileNo: student.studentMobileNo,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      status: 500,
      message: "An error occurred during password reset",
      error: error.message,
    };
  }
};

// VERIFY STUDENT OTP SERVICE
exports.verifyStudentOtp = async (studentOtpData) => {
  try {
    const studentEnterOtp = studentOtpData.studentOtp;
    const studentEmailOrMobile = await studentModel.findOne({
      $or: [
        { studentEmail: studentOtpData.studentEmailOrMobileNo },
        { studentMobileNo: studentOtpData.studentEmailOrMobileNo },
      ],
    });

    if (!studentEmailOrMobile) {
      return {
        status: 404,
        message: "Student not found with the provided email or mobile number",
        jsonData: {},
      };
    }

    if (studentEmailOrMobile.studentOtp !== studentEnterOtp) {
      return {
        status: 400,
        message: "Invalid OTP provided",
        jsonData: {},
      };
    }

    if (Date.now() > studentEmailOrMobile.studentOtpExpiry) {
      return {
        status: 400,
        message: "OTP has expired",
        jsonData: {},
      };
    }

    // OTP is valid
    studentEmailOrMobile.studentOtp = null;
    studentEmailOrMobile.studentOtpExpiry = null;
    await studentEmailOrMobile.save();

    return {
      status: 200,
      message: "OTP verified successfully",
      jsonData: {},
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during OTP verification",
      error: error.message,
    };
  }
};

// RESET STUDENT PASSWORD SERVICE
exports.resetStudentPassword = async (studentPasswordData) => {
  try {
    const studentNewPassword = studentPasswordData.studentNewPassword;

    const studentEmailOrMobile = await studentModel.findOne({
      $or: [
        { studentEmail: studentPasswordData.studentEmailOrMobileNo },
        { studentMobileNo: studentPasswordData.studentEmailOrMobileNo },
      ],
    });

    if (!studentEmailOrMobile) {
      return {
        status: 404,
        message: "Student not found with the provided email or mobile number",
        jsonData: {},
      };
    }

    studentEmailOrMobile.studentPassword = studentNewPassword;
    await studentEmailOrMobile.save();

    return {
      status: 200,
      message: "Password updated successfully",
      jsonData: {},
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during password update",
      error: error.message,
    };
  }
};

// UPDATE STUDENT ADDRESS SERVICE
exports.updateStudentAddress = async (studentId, studentAddressData) => {
  try {
    const fetchStudent = await studentModel.findById(studentId);
    if (!fetchStudent) {
      return {
        status: 404,
        message: "Student not found with the provided ID",
      };
    }

    if (studentAddressData.isPermanentSameAsCurrent === true) {
      studentAddressData.permanent = studentAddressData.current;
    }

    const updatedAddress = await studentAddressModel.findOneAndUpdate(
      { studentId },
      {
        current: studentAddressData.current,
        permanent: studentAddressData.permanent,
        isPermanentSameAsCurrent: studentAddressData.isPermanentSameAsCurrent,
        updatedAt: currentUnixTimeStamp(),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    if (studentId) {
      fetchStudent.profileCompletion.studentAddressData = 1;
      await fetchStudent.save();
    }

    return {
      status: 200,
      message: "Student address saved successfully",
      jsonData: updatedAddress,
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during student address update",
      error: error.message,
    };
  }
};

// UPDATE STUDENT BASIC DETAIL SERVICE
exports.updateStudentBasicDetail = async (
  studentId,
  studentBasicDetailData,
) => {
  try {
    const fetchStudent = await studentModel.findById(studentId);
    if (!fetchStudent) {
      return {
        status: 404,
        message: "Student not found with the provided ID",
        jsonData: {},
      };
    }

    const updateStdBasicData = await studentBasicDetailModel.findOneAndUpdate(
      { studentId },
      {
        studentDOB: studentBasicDetailData.studentDOB,
        studentGender: studentBasicDetailData.studentGender,
        studentAlternateMobileNo:
          studentBasicDetailData.studentAlternateMobileNo,
        studentMaritalStatus: studentBasicDetailData.studentMaritalStatus,
        studentMotherTongue: studentBasicDetailData.studentMotherTongue,
        studentNationality: studentBasicDetailData.studentNationality,
        studentCitizenship: studentBasicDetailData.studentCitizenship,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    if (studentId) {
      fetchStudent.profileCompletion.studentBasicData = 1;
      await fetchStudent.save();
    }

    return {
      status: 200,
      message: "Student basic detail saved successfully",
      jsonData: updateStdBasicData,
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during student basic detail update",
      error: error.message,
    };
  }
};

// UPDATE STUDENT BANK DETAILS SERVICE
exports.updateStudentBankDetails = async (studentId, studentBankData) => {
  try {
    const fetchStudent = await studentModel.findById(studentId);
    if (!fetchStudent) {
      return {
        status: 404,
        message: "Student not found with the provided ID",
        jsonData: {},
      };
    }

    console.log("Received bank data for update:", studentBankData);

    let studentBankPassbookUrl = null;

    if (studentBankData.passbookUrl) {
      studentBankPassbookUrl = saveBase64File(
        studentBankData.passbookUrl,
        "StudentBankPassbook",
        "student-passbook",
        studentBankData.extension,
      );
    }

    const updateData = {
      bankHolderName: studentBankData.bankHolderName,
      bankName: studentBankData.bankName,
      accountNumber: studentBankData.accountNumber,
      ifscCode: studentBankData.ifscCode,
      branchName: studentBankData.branchName,
      updatedAt: currentUnixTimeStamp(),
    };

    if (studentBankPassbookUrl) {
      updateData.passbookUrl = studentBankPassbookUrl;
    }

    const updateStdBankData = await StudentBankInfo.findOneAndUpdate(
      { studentId },
      { $set: updateData },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    fetchStudent.profileCompletion.studentBankData = 1;
    await fetchStudent.save();

    console.log(
      "Student bank details updated for studentId:",
      studentId,
      updateStdBankData,
    );

    return {
      status: 200,
      message: "Student bank detail saved successfully",
      jsonData: updateStdBankData,
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during student bank detail update",
      error: error.message,
    };
  }
};

// UPDATE STUDENT BODY DETAILS SERVICE
exports.updateStudentBodyDetails = async (
  studentId,
  studentBodyDetailsData,
) => {
  try {
    const fetchStudent = await studentModel.findById(studentId);
    if (!fetchStudent) {
      return {
        status: 404,
        message: "Student not found with the provided ID",
        jsonData: {},
      };
    }

    const updateStdBodyDetails = await StudentBodyDetails.findOneAndUpdate(
      { studentId },
      {
        heightCm: studentBodyDetailsData.heightCm,
        weightKg: studentBodyDetailsData.weightKg,
        bloodGroup: studentBodyDetailsData.bloodGroup,
        eyeColor: studentBodyDetailsData.eyeColor,
        hairColor: studentBodyDetailsData.hairColor,
        identificationMark1: studentBodyDetailsData.identificationMark1,
        identificationMark2: studentBodyDetailsData.identificationMark2,
        disability: studentBodyDetailsData.disability,
        disabilityType: studentBodyDetailsData.disabilityType,
        disabilityPercentage: studentBodyDetailsData.disabilityPercentage,
        updatedAt: currentUnixTimeStamp(),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    if (studentId) {
      fetchStudent.profileCompletion.studentBodyData = 1;
      await fetchStudent.save();
    }

    return {
      status: 200,
      message: "Student body detail saved successfully",
      jsonData: updateStdBodyDetails,
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during student body detail update",
      error: error.message,
    };
  }
};

// UPDATE STUDENT CAREER PREFERENCES SERVICE
exports.updateStudentPreferences = async (
  studentId,
  studentPreferencesData,
) => {
  try {
    const fetchStudent = await studentModel.findById(studentId);
    if (!fetchStudent) {
      return {
        status: 404,
        message: "Student not found with the provided ID",
        jsonData: {},
      };
    }

    const updateStdPrferenceData = await StudentPreferences.findOneAndUpdate(
      { studentId },
      {
        preferredJobCategory: studentPreferencesData.preferredJobCategory,
        preferredJobLocation: studentPreferencesData.preferredJobLocation,
        expectedSalaryMin: studentPreferencesData.expectedSalaryMin,
        expectedSalaryMax: studentPreferencesData.expectedSalaryMax,
        employmentType: studentPreferencesData.employmentType,
        willingToRelocate: studentPreferencesData.willingToRelocate,
        updatedAt: currentUnixTimeStamp(),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    if (studentId) {
      fetchStudent.profileCompletion.studentPreferencesData = 1;
      await fetchStudent.save();
    }

    return {
      status: 200,
      message: "Student career preferences saved successfully",
      jsonData: updateStdPrferenceData,
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during student career preferences update",
      error: error.message,
    };
  }
};

// UPDATE STUDENT CERTIFICATES SERVICE
exports.updateStudentCertificates = async (studentId, certificates) => {
  try {
    const fetchStudent = await studentModel.findById(studentId);
    if (!fetchStudent) {
      return {
        status: 404,
        message: "Student not found with the provided ID",
        jsonData: {},
      };
    }

    let studentCert = await StudentCertifications.findOne({ studentId });

    // 🆕 First-time creation
    if (!studentCert) {
      const processedCertificates = certificates.map((cert) => {
        // 🖼 save base64 image
        if (cert.certificateFile) {
          cert.certificateFile = saveBase64File(
            cert.certificateFile,
            "StudentCertificates",
            "student-certificate",
            cert.extension,
          );
        }
        return cert;
      });

      studentCert = new StudentCertifications({
        studentId,
        certificates: processedCertificates,
      });

      await studentCert.save();
    }
    // 🆕 Update existing document
    else {
      for (const cert of certificates) {
        // 🖼 Save image if exists
        if (cert.certificateFile) {
          cert.certificateFile = saveBase64File(
            cert.certificateFile,
            "StudentCertificates",
            "student-certificate",
            cert.extension,
          );
        }

        // ✏️ Update existing certificate
        if (cert.certificateId) {
          const index = studentCert.certificates.findIndex(
            (c) => c._id.toString() === cert.certificateId,
          );

          if (index === -1) {
            return {
              status: 404,
              message: "Certificate not found",
            };
          }

          studentCert.certificates[index] = {
            ...studentCert.certificates[index]._doc,
            ...cert,
          };
        }
        // ➕ Add new certificate
        else {
          studentCert.certificates.push(cert);
        }
      }

      await studentCert.save();
    }

    // ✅ profile completion
    fetchStudent.profileCompletion.studentCertificationsData = 1;
    await fetchStudent.save();

    return {
      status: 200,
      message: "Student certificates saved successfully",
      jsonData: studentCert,
    };
  } catch (error) {
    console.error("Certificate service error:", error);
    return {
      status: 500,
      message: "An error occurred during student certificates update",
      error: error.message,
    };
  }
};

// helper: allow only meaningful values
const hasValue = (val) =>
  val !== undefined &&
  val !== null &&
  (typeof val !== "string" || val.trim() !== "");

// UPDATE STUDENT DOCUMENT UPLOAD SERVICE
exports.updateStudentDocumentUpload = async (studentId, data) => {
  try {
    const student = await studentModel.findById(studentId);
    if (!student) {
      return { status: 404, message: "Student not found", jsonData: {} };
    }

    let existing = await StudentDocumentUpload.findOne({ studentId });
    if (!existing) {
      existing = new StudentDocumentUpload({ studentId });
    }

    /* ------------------ IDENTITY DOCUMENTS ------------------ */
    if (data.identityDocuments) {
      Object.entries(data.identityDocuments).forEach(([key, value]) => {
        if (hasValue(value)) {
          existing.identityDocuments[key] = value;
        }
      });
    }

    /* ------------------ IDENTITY FILE FIELDS ------------------ */
    const identityFileFields = [
      "aadharFrontImg",
      "aadharBackImg",
      "panImg",
      "drivingLicenseFrontImg",
      "categoryCertificateImg",
      "domicileCertificateImg",
      "incomeCertificateImg",
      "birthCertificateImg",
    ];

    identityFileFields.forEach((field) => {
      const fileData = data.identityDocuments?.[field];
      const extension = data.identityDocuments?.[`${field}Extension`];

      if (hasValue(fileData) && hasValue(extension)) {
        existing.identityDocuments[field] = saveBase64File(
          fileData,
          "StudentDocuments",
          field,
          extension,
        );
      }
    });

    /* ------------------ IDENTITY TEXT FIELDS ------------------ */
    const identityTextFields = [
      "aadharNumber",
      "panNumber",
      "voterId",
      "passportNumber",
      "drivingLicenseNo",
    ];

    identityTextFields.forEach((field) => {
      const value = data.identityDocuments?.[field];
      if (hasValue(value)) {
        existing.identityDocuments[field] = value;
      }
    });

    /* ------------------ OTHER DOCUMENTS ------------------ */
    if (Array.isArray(data.otherDocuments)) {
      data.otherDocuments.forEach((doc) => {
        // save file only if present
        if (hasValue(doc.documentFile) && hasValue(doc.extension)) {
          doc.documentFile = saveBase64File(
            doc.documentFile,
            "StudentDocuments",
            "other-document",
            doc.extension,
          );
        } else {
          delete doc.documentFile;
        }

        if (doc._id) {
          const index = existing.otherDocuments.findIndex(
            (e) => e._id.toString() === doc._id,
          );

          if (index !== -1) {
            Object.entries(doc).forEach(([key, value]) => {
              if (hasValue(value)) {
                existing.otherDocuments[index][key] = value;
              }
            });
          }
        } else {
          // push only if at least one valid value exists
          if (Object.values(doc).some(hasValue)) {
            existing.otherDocuments.push(doc);
          }
        }
      });
    }

    /* ------------------ FINAL SAVE ------------------ */
    existing.markModified("identityDocuments");
    existing.markModified("otherDocuments");
    existing.updatedAt = currentUnixTimeStamp();
    await existing.save();

    student.profileCompletion.studentDocumentsData = 1;
    await student.save();

    return {
      status: 200,
      message: "Student document updated successfully",
      jsonData: existing,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error updating student document",
      error: error.message,
    };
  }
};

// UPDATE STUDENT EDUCATION SERVICE
exports.updateStudentEducation = async (studentId, studentEducationData) => {
  try {
    const fetchStudent = await studentModel.findById(studentId);
    if (!fetchStudent) {
      return {
        status: 404,
        message: "Student not found with the provided ID",
        jsonData: {},
      };
    }

    if (studentEducationData.tenth?.marksheetFile) {
      studentEducationData.tenth.marksheetFile = saveBase64File(
        studentEducationData.tenth.marksheetFile,
        "StudentEducation",
        "tenth",
        studentEducationData.tenth.extension,
      );
    }

    if (studentEducationData.twelfth?.marksheetFile) {
      studentEducationData.twelfth.marksheetFile = saveBase64File(
        studentEducationData.twelfth.marksheetFile,
        "StudentEducation",
        "twelfth",
        studentEducationData.twelfth.extension,
      );
    }

    if (studentEducationData.graduation?.marksheetFile) {
      studentEducationData.graduation.marksheetFile = saveBase64File(
        studentEducationData.graduation.marksheetFile,
        "StudentEducation",
        "graduation",
        studentEducationData.graduation.extension,
      );
    }

    if (studentEducationData.postGraduation?.marksheetFile) {
      studentEducationData.postGraduation.marksheetFile = saveBase64File(
        studentEducationData.postGraduation.marksheetFile,
        "StudentEducation",
        "postGraduation",
        studentEducationData.postGraduation.extension,
      );
    }

    let additionalEducation = [];

    if (studentEducationData.additionalEducation) {
      additionalEducation = Array.isArray(
        studentEducationData.additionalEducation,
      )
        ? studentEducationData.additionalEducation
        : [studentEducationData.additionalEducation];

      additionalEducation = additionalEducation.map((item) => {
        if (item.marksheetFile) {
          item.marksheetFile = saveBase64File(
            item.marksheetFile,
            "StudentEducation",
            "additional",
            item.extension,
          );
        }
        return item;
      });
    }

    const updatestudentEducationData = {
      highestQualification: studentEducationData.highestQualification,
      tenth: studentEducationData.tenth,
      twelfth: studentEducationData.twelfth,
      graduation: studentEducationData.graduation,
      postGraduation: studentEducationData.postGraduation,
      additionalEducation,
      updatedAt: currentUnixTimeStamp(),
    };

    const updateStdEducationData = await StudentEducation.findOneAndUpdate(
      { studentId },
      updatestudentEducationData,
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    fetchStudent.profileCompletion.studentEducationData = 1;
    await fetchStudent.save();

    return {
      status: 200,
      message: "Student education updated successfully",
      jsonData: updateStdEducationData,
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during student education update",
      error: error.message,
    };
  }
};

// UPDATE STUDENT EMERGENCY CONTACT SERVICE
exports.updateStudentEmergencyData = async (
  studentId,
  studentEmergencyData,
) => {
  try {
    const fetchStudent = await studentModel.findById(studentId);
    if (!fetchStudent) {
      return {
        status: 404,
        message: "Student not found with the provided ID",
        jsonData: {},
      };
    }

    const updatestudentEmergencyData = {
      emergencyContactName: studentEmergencyData.emergencyContactName,
      emergencyRelation: studentEmergencyData.emergencyRelation,
      emergencyPhoneNumber: studentEmergencyData.emergencyPhoneNumber,
      emergencyAddress: studentEmergencyData.emergencyAddress,
      updatedAt: currentUnixTimeStamp(),
    };

    const updateStdEmergencyData =
      await StudentEmergencyContact.findOneAndUpdate(
        { studentId },
        updatestudentEmergencyData,
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );

    fetchStudent.profileCompletion.studentEmergencyData = 1;
    await fetchStudent.save();

    return {
      status: 200,
      message: "Student emergency contact updated successfully",
      jsonData: updateStdEmergencyData,
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during student emergency contact update",
      error: error.message,
    };
  }
};

// UPDATE STUDENT PARENTAL INFO SERVICE
exports.updateStudentParentsInfo = async (studentId, studentParentsData) => {
  try {
    const fetchStudent = await studentModel.findById(studentId);
    if (!fetchStudent) {
      return {
        status: 404,
        message: "Student not found with the provided ID",
        jsonData: {},
      };
    }

    const updateStdParentsData = await StudentParentalInfo.findOneAndUpdate(
      { studentId },
      {
        fatherName: studentParentsData.fatherName,
        fatherContactNumber: studentParentsData.fatherContactNumber,
        fatherOccupation: studentParentsData.fatherOccupation,
        fatherEmail: studentParentsData.fatherEmail,
        fatherAnnualIncome: studentParentsData.fatherAnnualIncome,
        motherName: studentParentsData.motherName,
        motherContactNumber: studentParentsData.motherContactNumber,
        motherOccupation: studentParentsData.motherOccupation,
        motherEmail: studentParentsData.motherEmail,
        motherAnnualIncome: studentParentsData.motherAnnualIncome,
        guardianName: studentParentsData.guardianName,
        guardianRelation: studentParentsData.guardianRelation,
        guardianContactNumber: studentParentsData.guardianContactNumber,
        numberOfFamilyMembers: studentParentsData.numberOfFamilyMembers,
        familyType: studentParentsData.familyType,
        updatedAt: currentUnixTimeStamp(),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    fetchStudent.profileCompletion.studentParentData = 1;
    await fetchStudent.save();

    return {
      status: 200,
      message: "Student parental info updated successfully",
      jsonData: updateStdParentsData,
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during student parental info update",
      error: error.message,
    };
  }
};

// UPDATE STUDENT SKILLS SERVICE
const cleanArray = (arr = []) =>
  Array.isArray(arr)
    ? arr
      .filter((v) => typeof v === "string")
      .map((v) => v.trim())
      .filter((v) => v !== "")
    : [];

exports.updateStudentSkills = async (studentId, data) => {
  try {
    const updateData = {
      hobbies: cleanArray(data.hobbies),
      technicalSkills: cleanArray(data.technicalSkills),
      softSkills: cleanArray(data.softSkills),
      computerKnowledge: cleanArray(data.computerKnowledge),
      languageProficiency: Array.isArray(data.languageProficiency)
        ? data.languageProficiency
        : [],
    };

    const result = await StudentSkills.findOneAndUpdate(
      { studentId },
      { $set: updateData },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );
    const fetchStudent = await studentModel.findById(studentId);
    if (fetchStudent) {
      fetchStudent.profileCompletion.studentSkillsData = 1;
      await fetchStudent.save();
    }
    return {
      status: 200,
      message: "Student skills updated successfully",
      data: result,
    };
  } catch (error) {
    console.error("updateStudentSkills error:", error);
    return {
      status: 500,
      message: "An error occurred during student skills update",
      error: error.message,
    };
  }
};

// UPDATE STUDENT SOCIAL LINK SERVICE
exports.updateStudentSocialLink = async (studentId, studentSocial) => {
  try {
    const fetchStudent = await studentModel.findById(studentId);
    if (!fetchStudent) {
      return {
        status: 404,
        message: "Student not found with the provided ID",
        jsonData: {},
      };
    }

    const updateStdSocialLink = await StudentSocialLinks.findOneAndUpdate(
      { studentId },
      {
        linkedInUrl: studentSocial.linkedInUrl,
        githubUrl: studentSocial.githubUrl,
        portfolioUrl: studentSocial.portfolioUrl,
        facebookUrl: studentSocial.facebookUrl,
        instagramUrl: studentSocial.instagramUrl,
        updatedAt: currentUnixTimeStamp(),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    fetchStudent.profileCompletion.studentSocialData = 1;
    await fetchStudent.save();

    return {
      status: 200,
      message: "Student social link updated successfully",
      jsonData: updateStdSocialLink,
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during student social link update",
      error: error.message,
    };
  }
};

// UPDATE STUDENT WORK EXPERIENCE SERVICE
exports.updateStudentWorkExperience = async (
  studentId,
  studentWorkExperienceData,
) => {
  try {
    const fetchStudent = await studentModel.findById(studentId);

    if (!fetchStudent) {
      return {
        status: 404,
        message: "Student not found with the provided ID",
        jsonData: {},
      };
    }

    let experiences = studentWorkExperienceData.experiences || [];

    if (!Array.isArray(experiences)) {
      experiences = [experiences];
    }

    experiences = await Promise.all(
      experiences
        .filter((exp) => exp && Object.keys(exp).length > 0) // remove empty objects
        .map(async (exp) => {
          // Handle startDate: if it's already a number (Unix timestamp), keep it; otherwise convert from string
          if (exp.startDate) {
            if (typeof exp.startDate === "number") {
              // Already a Unix timestamp, keep as is
              exp.startDate = exp.startDate;
            } else {
              // Convert from date string to Unix timestamp in seconds
              const timestamp = convertIntoUnixTimeStamp(exp.startDate);
              exp.startDate = timestamp ? Math.floor(timestamp / 1000) : null;
            }
          }
          // Handle endDate: if it's already a number (Unix timestamp), keep it; otherwise convert from string
          if (exp.endDate) {
            if (typeof exp.endDate === "number") {
              // Already a Unix timestamp, keep as is
              exp.endDate = exp.endDate;
            } else {
              // Convert from date string to Unix timestamp in seconds
              const timestamp = convertIntoUnixTimeStamp(exp.endDate);
              exp.endDate = timestamp ? Math.floor(timestamp / 1000) : null;
            }
          }

          // Handle certificate file upload (supports both data:URI and pure base64)
          if (exp.experienceCertificateFile) {
            exp.experienceCertificateFile = saveBase64File(
              exp.experienceCertificateFile,
              "StudentWorkExperience",
              "experience-certificate",
              exp.extension,
            );
          }

          return exp;
        }),
    );

    // Calculate total experience months from all experiences
    const totalExperienceMonths = experiences.reduce((sum, exp) => {
      return sum + (exp.experienceDurationMonths || 0);
    }, 0);

    const updateStdWorkExperienceData =
      await StudentExperience.findOneAndUpdate(
        { studentId },
        {
          experiences,
          totalExperienceMonths,
          updatedAt: currentUnixTimeStamp(),
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );

    fetchStudent.profileCompletion.studentWorkExperienceData = 1;
    await fetchStudent.save();

    return {
      status: 200,
      message: "Student work experience updated successfully",
      jsonData: updateStdWorkExperienceData,
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during student work experience update",
      error: error.message,
    };
  }
};

// UPLOAD STUDENT RESUME SERVICE
exports.uploadStudentResume = async (studentId, studentResumeData) => {
  try {
    const fetchStudent = await studentModel.findById(studentId);
    if (!fetchStudent) {
      return {
        status: 404,
        message: "Student not found with the provided ID",
        jsonData: {},
      };
    }

    if (!studentResumeData.studentResumeFile) {
      return {
        status: 400,
        message: "Resume file is required",
        jsonData: {},
      };
    }

    const resumeFilePath = saveBase64File(
      studentResumeData.studentResumeFile,
      "StudentResume",
      "resume",
      studentResumeData.extension,
    );

    fetchStudent.studentResumeFile = resumeFilePath;
    fetchStudent.profileCompletion.studentResume = 1;
    await fetchStudent.save();

    return {
      status: 200,
      message: "Student resume uploaded successfully",
      jsonData: {
        studentId: fetchStudent._id,
        studentResumeFile: resumeFilePath,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during student resume upload",
      jsonData: {
        error: error.message,
      },
    };
  }
};

// STUDENT REMOVE NOTIFICATION SERVICE
exports.studentRemoveNotification = async (data) => {
  try {
    const studentId = data.studentId;
    const notificationId = data.notificationId;

    const student = await studentModel.findById(studentId);
    if (!student) {
      return {
        status: 404,
        message: "Student not found with the provided ID",
        jsonData: null,
      };
    }

    const notification = await NotificationModel.findById(notificationId);
    if (!notification) {
      return {
        status: 404,
        message: "Notification not found with the provided ID",
        jsonData: {},
      };
    }

    const removeNotification = await NotificationModel.findByIdAndUpdate(
      notificationId,
      { $pull: { notifyNotToStudents: studentId } },
      { new: true },
    );

    return {
      status: 200,
      message: "Student notification removed successfully",
      jsonData: null,
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred during removing student notification",
      error: error.message,
    };
  }
};

// NOTIFICATION LIST FOR STUDENT SERVICE
exports.notificationListForStudent = async (studentId) => {
  try {
    const student = await studentModel.findById(studentId);
    if (!student) {
      return {
        status: 404,
        message: "Student not found with the provided ID",
        jsonData: {},
      };
    }

    const studentSector = student.studentJobSector;

    const getNotificationsList = await NotificationModel.find({
      notifyNotToStudents: { $nin: [studentId] },
      // notifyJobSector: studentSector
    }).sort({ notifyCreateAt: -1 });

    return {
      status: 200,
      message: "Notification list for student fetched successfully",
      jsonData: {
        getNotificationsList: getNotificationsList,
        notificationsCount: getNotificationsList.length,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "An error occurred while fetching notifications for student",
      error: error.message,
    };
  }
};

// STUDENT DASHBOARD DATA SERVICE
exports.studentDashboardData = async (studentId) => {
  try {

    const student = await studentModel.findById(studentId);
    if (!student) {
      return {
        status: 404,
        message: "Student not found with the provided ID",
        jsonData: {},
      };
    }

    const appliedJobsCount = await JobAppliedMapperModel.countDocuments({ studentId });

    const eligibleJobsCount = await JobAppliedMapperModel.countDocuments({ studentId });

    const allJobsCount = await JobAppliedMapperModel.countDocuments({ studentId });

    return {
      status: 200,
      message: "Student dashboard data fetched successfully",
      jsonData: {
        appliedJobsCount: appliedJobsCount,
        eligibleJobsCount: eligibleJobsCount,
        allJobsCount: allJobsCount,
      }
    };

  } catch (error) {
    return {
      status: 500,
      message: "An error occurred while fetching student dashboard data",
      error: error.message,
    };
  }
};