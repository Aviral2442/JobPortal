const { buildDateFilter } = require('../utils/dateFilters');
const { buildPagination } = require('../utils/paginationFilters');
const { currentUnixTimeStamp } = require('../utils/currentUnixTimeStamp');
const { convertIntoUnixTimeStamp } = require('../utils/convertIntoUnixTimeStamp');
const { saveBase64File } = require('../middleware/base64FileUpload');
const studentModel = require('../models/studentModel');
const studentAddressModel = require('../models/student/studentAddressModel');
const studentBasicDetailModel = require('../models/student/studentBasicDetailModel');
const StudentBankInfo = require('../models/student/studentBankDataModel');
const StudentBodyDetails = require('../models/student/studentBodyDetailModel');
const StudentPreferences = require('../models/student/studentCareerPreferenceModel');
const StudentCertifications = require('../models/student/studentCertificatesModel');
const StudentDocumentUpload = require('../models/student/studentDocumentUploadModel');
const StudentEducation = require('../models/student/studentEducationModel');
const StudentEmergencyContact = require('../models/student/studentEmergencyModel');
const StudentParentalInfo = require('../models/student/studentParentsModel');
const StudentSkills = require('../models/student/studentSkillModel');
const StudentSocialLinks = require('../models/student/studentSocialLinkModel');
const StudentExperience = require('../models/student/studentWorkExprienceModel');
const loginHistory = require('../models/LoginHistoryModel');
const JobType = require('../models/JobTypeModel');
const sendEmailOtp = require('../utils/emailOtp');
const sendMobileOtp = require('../utils/mobileNoOtp');
const NotificationModel = require('../models/NotificationModel');

// STUDENT LIST SERVICE
exports.studentListService = async (query) => {
    try {
        const {
            dateFilter,
            fromDate,
            toDate,
            searchFilter,
            page,
            limit
        } = query;

        let filter = {};

        if (searchFilter) {
            filter.studentEmail = { $regex: searchFilter, $options: "i" };
            filter.studentMobileNo = { $regex: searchFilter, $options: "i" };
        }

        const dateQuery = buildDateFilter({
            dateFilter,
            fromDate,
            toDate,
            dateField: "studentCreatedAt"
        });

        filter = { ...filter, ...dateQuery };

        const { skip, limit: finalLimit, currentPage } = buildPagination({
            dateFilter,
            fromDate,
            toDate,
            searchFilter,
            page,
            limit
        });

        const totalCount = await studentModel.countDocuments(filter);
        const students = await studentModel.find(filter)
            .populate({ path: 'studentJobSector', model: 'JobSector', select: 'job_sector_name' })
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
                students: students
            }
        };
    } catch (error) {
        return {
            result: 500,
            message: "Internal server error",
            error: error.message
        };
    }
};

// STUDENT LOGIN LOGOUT HISTORY SERVICE
exports.studentLoginLogoutHistory = async (query) => {
    try {
        const {
            dateFilter,
            fromDate,
            toDate,
            searchFilter,
            page,
            limit
        } = query;

        const dateQuery = buildDateFilter({
            dateFilter,
            fromDate,
            toDate,
            dateField: "createdAt"
        });

        filter = { ...dateQuery };

        const { skip, limit: finalLimit, currentPage } = buildPagination({
            dateFilter,
            fromDate,
            toDate,
            searchFilter,
            page,
            limit
        });

        const totalCount = await loginHistory.countDocuments(filter);
        const loginLogoutHistory = await loginHistory.find(filter)
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
                loginLogoutHistory: loginLogoutHistory
            }
        };
    } catch (error) {
        return {
            result: 500,
            message: "Internal server error",
            error: error.message
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
                message: "Student not found"
            };
        }

        const currentProfileComplete = fetchStudent.profileCompletion || {};

        const calculateCompletionPercentage = (currentProfileComplete) => {
            const totalSections = Object.keys(currentProfileComplete).length;
            const completedSections = Object.values(currentProfileComplete).filter(value => value === 1).length;
            const meterResult = Math.round(((completedSections / totalSections) * 100), 2);
            return meterResult;
        };

        return {
            result: 200,
            message: "Student profile completion fetched successfully",
            jsonData: {
                profileCompletion: currentProfileComplete,
                completionPercentage: calculateCompletionPercentage(currentProfileComplete)
            }
        };

    } catch (error) {
        return {
            result: 500,
            message: "Internal server error",
            error: error.message
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
                message: "Student not found"
            };
        }

        const studentPrimaryData = await studentModel.findById(studentId);
        const studentAddressData = await studentAddressModel.findOne({ studentId });
        const studentBasicData = await studentBasicDetailModel.findOne({ studentId });
        const studentBankData = await StudentBankInfo.findOne({ studentId });
        const studentBodyData = await StudentBodyDetails.findOne({ studentId });
        const studentPreferencesData = await StudentPreferences.findOne({ studentId });
        const studentCertificatesData = await StudentCertifications.findOne({ studentId });
        const studentDocumentUploadData = await StudentDocumentUpload.findOne({ studentId });
        const studentEducationData = await StudentEducation.find({ studentId });
        const studentEmergencyContactData = await StudentEmergencyContact.findOne({ studentId });
        const studentParentalInfoData = await StudentParentalInfo.findOne({ studentId });
        const studentSkillsData = await StudentSkills.findOne({ studentId });
        const studentSocialLinksData = await StudentSocialLinks.findOne({ studentId });
        const studentWorkExperienceData = await StudentExperience.findOne({ studentId });

        studentPrimaryData.studentJobSector = await require('../models/JobSectorModel').findById(studentPrimaryData.studentJobSector);

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
                studentWorkExperienceData
            }
        };

    } catch (error) {
        return {
            result: 500,
            message: "Internal server error",
            error: error.message
        };
    }
};

// STUDENT REGISTRATION SERVICE
exports.studentRegistration = async (studentData) => {
    try {
        const emailExists = await studentModel.findOne({ studentEmail: studentData.studentEmail });
        if (emailExists) {
            return { status: 409, message: 'Student Entered Email is already registered' };
        }

        const mobileExists = await studentModel.findOne({ studentMobileNo: studentData.studentMobileNo });
        if (mobileExists) {
            return { status: 409, message: 'Student Entered Mobile No. is already registered' };
        }

        // Referral logic (unchanged)
        if (studentData.studentReferralByCode) {
            const refStudent = await studentModel.findOne({
                studentReferralCode: studentData.studentReferralByCode
            });

            if (!refStudent) {
                return { status: 400, message: 'Invalid referral code provided' };
            }

            studentData.studentReferralById = refStudent._id;
            studentData.studentReferralByCode = refStudent.studentReferralCode;
        }
        console.log('Student Data Received for Registration:', studentData);
        // ✅ Handle base64 profile image
        let studentProfilePic = null;
        if (studentData.studentProfilePic) {
            studentProfilePic = saveBase64File(
                studentData.studentProfilePic,
                'StudentProfile',
                'student'
            );
        }

        const generateRandomReferralCode = async () => {
            const prefix = 'CW';
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
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
        console.log('New Student Object Created:', newStudent);
        await newStudent.save();

        return {
            status: 200,
            message: 'Student registered successfully',
            jsonData: {
                studentId: newStudent._id,
                studentFirstName: newStudent.studentFirstName,
                studentLastName: newStudent.studentLastName,
                studentEmail: newStudent.studentEmail,
                studentMobileNo: newStudent.studentMobileNo,
                studentJobSector: newStudent.studentJobSector,
                studentReferralCode: newStudent.studentReferralCode,
                studentProfilePic: newStudent.studentProfilePic
            },
        };
    } catch (error) {
        console.error('Error in studentRegistration:', error);
        return { status: 500, message: 'An error occurred during student registration' };
    }
};

// STUDENT LOGIN SERVICE
exports.studentLogin = async (studentLoginData) => {
    try {

        const student = await studentModel.findOne({
            $or: [
                { studentEmail: studentLoginData.studentEmailOrMobile },
                { studentMobileNo: studentLoginData.studentEmailOrMobile }
            ]
        });

        if (!student) {
            return {
                status: 404,
                message: 'Student not found with the provided email or mobile number',
                jsonData: {
                    IsRedirectToRegister: true
                }
            };
        }


        if (student.studentPassword !== studentLoginData.studentPassword) {
            return {
                status: 401,
                message: 'Incorrect password'
            };
        }

        student.lastLoginAt = currentUnixTimeStamp();
        await student.save();

        const saveLoginHistory = await loginHistory({
            studentId: student._id,
            loginAt: currentUnixTimeStamp()
        })

        await saveLoginHistory.save();

        return {
            status: 200,
            message: 'Student logged in successfully',
            jsonData: {
                studentId: student._id,
                studentFirstName: student.studentFirstName,
                studentLastName: student.studentLastName,
                studentEmail: student.studentEmail,
                studentMobileNo: student.studentMobileNo,
                studentJobSector: student.studentJobSector,
                studentProfilePic: student.studentProfilePic
            }
        };

    } catch (error) {
        console.error("Login Error:", error);
        return {
            status: 500,
            message: 'An error occurred during student login',
            error: error.message
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
                message: 'Student not found with the provided ID'
            };
        }

        student.lastLogoutAt = currentUnixTimeStamp();
        await student.save();

        const updateLoginHistory = await loginHistory(
            {
                studentId: studentId,
                logoutAt: currentUnixTimeStamp()
            }
        );

        await updateLoginHistory.save();

        return {
            status: 200,
            message: 'Student logged out successfully'
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during student logout',
            error: error.message
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
                message: 'Email or mobile number is required'
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
                { studentMobileNo: formattedInput }
            ]
        });

        if (!student) {
            return {
                status: 404,
                message: 'Student not found with the provided email or mobile number'
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
                message: 'OTP sent to registered email successfully',
                jsonData: {
                    studentId: student._id,
                    studentEmail: student.studentEmail
                }
            };
        }

        // 🔹 Mobile case
        const lowerCaseMobileNO = student.studentMobileNo;

        sendMobileOtp(lowerCaseMobileNO, otp);

        if (sendMobileOtp.success === false) {
            return {
                status: 500,
                message: 'Failed to send OTP to mobile number'
            };
        }
        return {
            status: 200,
            message: 'OTP sent to registered mobile number successfully',
            jsonData: {
                studentId: student._id,
                studentMobileNo: student.studentMobileNo
            }
        };

    } catch (error) {
        console.log(error);

        return {
            status: 500,
            message: 'An error occurred during password reset',
            error: error.message
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
                { studentMobileNo: studentOtpData.studentEmailOrMobileNo }
            ]
        });

        if (!studentEmailOrMobile) {
            return {
                status: 404,
                message: 'Student not found with the provided email or mobile number'
            };
        }

        if (studentEmailOrMobile.studentOtp !== studentEnterOtp) {
            return {
                status: 400,
                message: 'Invalid OTP provided'
            };
        }

        if (Date.now() > studentEmailOrMobile.studentOtpExpiry) {
            return {
                status: 400,
                message: 'OTP has expired'
            };
        }

        // OTP is valid
        studentEmailOrMobile.studentOtp = null;
        studentEmailOrMobile.studentOtpExpiry = null;
        await studentEmailOrMobile.save();

        return {
            status: 200,
            message: 'OTP verified successfully'
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during OTP verification',
            error: error.message
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
                { studentMobileNo: studentPasswordData.studentEmailOrMobileNo }
            ]
        });

        if (!studentEmailOrMobile) {
            return {
                status: 404,
                message: 'Student not found with the provided email or mobile number'
            };
        }

        studentEmailOrMobile.studentPassword = studentNewPassword;
        await studentEmailOrMobile.save();

        return {
            status: 200,
            message: 'Password updated successfully'
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during password update',
            error: error.message
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
                message: 'Student not found with the provided ID'
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
                updatedAt: currentUnixTimeStamp()
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        if (studentId) {
            fetchStudent.profileCompletion.studentAddressData = 1;
            await fetchStudent.save();
        }

        return {
            status: 200,
            message: 'Student address saved successfully',
            jsonData: updatedAddress
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during student address update',
            error: error.message
        };
    }
};

// UPDATE STUDENT BASIC DETAIL SERVICE
exports.updateStudentBasicDetail = async (studentId, studentBasicDetailData) => {
    try {
        const fetchStudent = await studentModel.findById(studentId);
        if (!fetchStudent) {
            return {
                status: 404,
                message: 'Student not found with the provided ID'
            };
        }

        const updateStdBasicData = await studentBasicDetailModel.findOneAndUpdate(
            { studentId },
            {
                studentDOB: studentBasicDetailData.studentDOB,
                studentGender: studentBasicDetailData.studentGender,
                studentAlternateMobileNo: studentBasicDetailData.studentAlternateMobileNo,
                studentMaritalStatus: studentBasicDetailData.studentMaritalStatus,
                studentMotherTongue: studentBasicDetailData.studentMotherTongue,
                studentNationality: studentBasicDetailData.studentNationality,
                studentCitizenship: studentBasicDetailData.studentCitizenship
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        if (studentId) {
            fetchStudent.profileCompletion.studentBasicData = 1;
            await fetchStudent.save();
        }

        return {
            status: 200,
            message: 'Student basic detail saved successfully',
            jsonData: updateStdBasicData
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during student basic detail update',
            error: error.message
        }
    }
};

// UPDATE STUDENT BANK DETAILS SERVICE
exports.updateStudentBankDetails = async (studentId, studentBankData) => {
    try {

        const fetchStudent = await studentModel.findById(studentId);
        if (!fetchStudent) {
            return {
                status: 404,
                message: 'Student not found with the provided ID'
            };
        }

        let studentBankPassbookUrl = null;
        if (studentBankData.passbookUrl) {
            studentBankPassbookUrl = saveBase64File(
                studentBankData.passbookUrl,
                'StudentBankPassbook',
                'student'
            );
        }

        const updateStdBankData = await StudentBankInfo.findOneAndUpdate(
            { studentId },
            {
                bankHolderName: studentBankData.bankHolderName,
                bankName: studentBankData.bankName,
                accountNumber: studentBankData.accountNumber,
                ifscCode: studentBankData.ifscCode,
                branchName: studentBankData.branchName,
                passbookUrl: studentBankPassbookUrl,
                updatedAt: currentUnixTimeStamp()
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        if (studentId) {
            fetchStudent.profileCompletion.studentBankData = 1;
            await fetchStudent.save();
        }

        return {
            status: 200,
            message: 'Student bank detail saved successfully',
            jsonData: updateStdBankData
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during student bank detail update',
            error: error.message
        };
    }
};

// UPDATE STUDENT BODY DETAILS SERVICE
exports.updateStudentBodyDetails = async (studentId, studentBodyDetailsData) => {
    try {
        const fetchStudent = await studentModel.findById(studentId);
        if (!fetchStudent) {
            return {
                status: 404,
                message: 'Student not found with the provided ID'
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
                updatedAt: currentUnixTimeStamp()
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        if (studentId) {
            fetchStudent.profileCompletion.studentBodyData = 1;
            await fetchStudent.save();
        }

        return {
            status: 200,
            message: 'Student body detail saved successfully',
            jsonData: updateStdBodyDetails
        };
    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during student body detail update',
            error: error.message
        };
    }
};

// UPDATE STUDENT CAREER PREFERENCES SERVICE
exports.updateStudentPreferences = async (studentId, studentPreferencesData) => {
    try {

        const fetchStudent = await studentModel.findById(studentId);
        if (!fetchStudent) {
            return {
                status: 404,
                message: 'Student not found with the provided ID'
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
                updatedAt: currentUnixTimeStamp()
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        if (studentId) {
            fetchStudent.profileCompletion.studentPreferencesData = 1;
            await fetchStudent.save();
        }

        return {
            status: 200,
            message: 'Student career preferences saved successfully',
            jsonData: updateStdPrferenceData
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during student career preferences update',
            error: error.message
        };
    }
};

// UPDATE STUDENT CERTIFICATES SERVICE
exports.updateStudentCertificates = async (studentId, studentCertificateData) => {
    try {

        const fetchStudent = await studentModel.findById(studentId);
        if (!fetchStudent) {
            return {
                status: 404,
                message: 'Student not found with the provided ID'
            };
        }

        let studentCert = await StudentCertifications.findOne({ studentId });

        // CASE 1: First time student uploads certificates → create document
        if (!studentCert) {
            studentCert = new StudentCertifications({
                studentId,
                certificates: Array.isArray(studentCertificateData)
                    ? studentCertificateData
                    : [studentCertificateData]
            });

            await studentCert.save();
        } else {
            // CASE 2: Update existing certificate
            if (studentCertificateData.certificateId) {
                const index = studentCert.certificates.findIndex(
                    cert => cert._id.toString() === studentCertificateData.certificateId
                );

                if (index === -1) {
                    return { status: 404, message: "Certificate not found" };
                }

                studentCert.certificates[index] = {
                    ...studentCert.certificates[index]._doc,
                    ...studentCertificateData
                };
            } else {
                // CASE 3: Add new certificate (push)
                studentCert.certificates.push(studentCertificateData);
            }

            await studentCert.save();
        }

        fetchStudent.profileCompletion.studentCertificationsData = 1;
        await fetchStudent.save();

        return {
            status: 200,
            message: 'Student certificates saved successfully',
            jsonData: studentCert
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during student certificates update',
            error: error.message
        };
    }
};

// UPDATE STUDENT DOCUMENT UPLOAD SERVICE
exports.updateStudentDocumentUpload = async (studentId, data) => {
    try {
        const student = await studentModel.findById(studentId);
        if (!student) {
            return { status: 404, message: "Student not found" };
        }

        let existing = await StudentDocumentUpload.findOne({ studentId });

        if (!existing) {
            existing = new StudentDocumentUpload({ studentId });
        }

        if (data.identityDocuments) {
            const identity = JSON.parse(data.identityDocuments);

            existing.identityDocuments = {
                ...existing.identityDocuments,
                ...identity
            };
        }

        if (data.otherDocuments) {
            const otherArray = JSON.parse(data.otherDocuments);

            otherArray.forEach(doc => {
                if (doc._id) {
                    const index = existing.otherDocuments.findIndex(e => e._id.toString() === doc._id);
                    if (index !== -1) {
                        existing.otherDocuments[index] = { ...existing.otherDocuments[index]._doc, ...doc };
                    }
                } else {
                    existing.otherDocuments.push(doc);
                }
            });
        }

        const identityFileFields = [
            "aadharFrontImg",
            "aadharBackImg",
            "panImg",
            "drivingLicenseFrontImg",
            "categoryCertificateImg",
            "domicileCertificateImg",
            "incomeCertificateImg",
            "birthCertificateImg"
        ];

        identityFileFields.forEach(field => {
            if (data[field]) {
                existing.identityDocuments[field] = data[field];
            }
        });

        existing.updatedAt = currentUnixTimeStamp();
        await existing.save();

        student.profileCompletion.studentDocumentsData = 1;
        await student.save();

        return {
            status: 200,
            message: "Student document updated successfully",
            jsonData: existing
        };

    } catch (error) {
        return {
            status: 500,
            message: "Error updating student document",
            error: error.message
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
                message: 'Student not found with the provided ID'
            };
        }

        let additionalEducation = [];

        if (studentEducationData.additionalEducation) {
            additionalEducation = Array.isArray(studentEducationData.additionalEducation)
                ? studentEducationData.additionalEducation
                : [studentEducationData.additionalEducation];
        }

        const updatestudentEducationData = {
            tenth: studentEducationData.tenth,
            twelfth: studentEducationData.twelfth,
            graduation: studentEducationData.graduation,
            postGraduation: studentEducationData.postGraduation,
            additionalEducation: additionalEducation,
            updatedAt: currentUnixTimeStamp()
        };

        const updateStdEducationData = await StudentEducation.findOneAndUpdate(
            { studentId },
            updatestudentEducationData,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        fetchStudent.profileCompletion.studentEducationData = 1;
        await fetchStudent.save();

        return {
            status: 200,
            message: 'Student education updated successfully',
            jsonData: updateStdEducationData
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during student education update',
            error: error.message
        };
    }
};

// UPDATE STUDENT EMERGENCY CONTACT SERVICE
exports.updateStudentEmergencyData = async (studentId, studentEmergencyData) => {
    try {

        const fetchStudent = await studentModel.findById(studentId);
        if (!fetchStudent) {
            return {
                status: 404,
                message: 'Student not found with the provided ID'
            };
        }

        const updatestudentEmergencyData = {
            emergencyContactName: studentEmergencyData.emergencyContactName,
            emergencyRelation: studentEmergencyData.emergencyRelation,
            emergencyPhoneNumber: studentEmergencyData.emergencyPhoneNumber,
            emergencyAddress: studentEmergencyData.emergencyAddress,
            updatedAt: currentUnixTimeStamp()
        };

        const updateStdEmergencyData = await StudentEmergencyContact.findOneAndUpdate(
            { studentId },
            updatestudentEmergencyData,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        fetchStudent.profileCompletion.studentEmergencyData = 1;
        await fetchStudent.save();

        return {
            status: 200,
            message: 'Student emergency contact updated successfully',
            jsonData: updateStdEmergencyData
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during student emergency contact update',
            error: error.message
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
                message: 'Student not found with the provided ID'
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
                updatedAt: currentUnixTimeStamp()
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        fetchStudent.profileCompletion.studentParentalData = 1;
        await fetchStudent.save();

        return {
            status: 200,
            message: 'Student parental info updated successfully',
            jsonData: updateStdParentsData
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during student parental info update',
            error: error.message
        };
    }
};

// UPDATE STUDENT SKILLS SERVICE
exports.updateStudentSkills = async (studentId, studentSkillsData) => {
    try {

        const fetchStudent = await studentModel.findById(studentId);
        if (!fetchStudent) {
            return {
                status: 404,
                message: 'Student not found with the provided ID'
            };
        }

        // Ensure arrays
        const technicalSkills = Array.isArray(studentSkillsData.technicalSkills)
            ? studentSkillsData.technicalSkills
            : (studentSkillsData.technicalSkills ? [studentSkillsData.technicalSkills] : []);

        const softSkills = Array.isArray(studentSkillsData.softSkills)
            ? studentSkillsData.softSkills
            : (studentSkillsData.softSkills ? [studentSkillsData.softSkills] : []);

        const computerKnowledge = Array.isArray(studentSkillsData.computerKnowledge)
            ? studentSkillsData.computerKnowledge
            : (studentSkillsData.computerKnowledge ? [studentSkillsData.computerKnowledge] : []);

        const hobbies = Array.isArray(studentSkillsData.hobbies)
            ? studentSkillsData.hobbies
            : (studentSkillsData.hobbies ? [studentSkillsData.hobbies] : []);

        const languageProficiency = Array.isArray(studentSkillsData.languageProficiency)
            ? studentSkillsData.languageProficiency
            : (studentSkillsData.languageProficiency ? [studentSkillsData.languageProficiency] : []);

        const updateStdSkillData = await StudentSkills.findOneAndUpdate(
            { studentId },
            {
                technicalSkills,
                softSkills,
                computerKnowledge,
                hobbies,
                languageProficiency,
                updatedAt: currentUnixTimeStamp()
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        fetchStudent.profileCompletion.studentSkillsData = 1;
        await fetchStudent.save();

        return {
            status: 200,
            message: 'Student skills updated successfully',
            jsonData: updateStdSkillData
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during student skills update',
            error: error.message
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
                message: 'Student not found with the provided ID'
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
                updatedAt: currentUnixTimeStamp()
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        fetchStudent.profileCompletion.studentSocialData = 1;
        await fetchStudent.save();

        return {
            status: 200,
            message: 'Student social link updated successfully',
            jsonData: updateStdSocialLink
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during student social link update',
            error: error.message
        };
    }
}

// UPDATE STUDENT WORK EXPERIENCE SERVICE
exports.updateStudentWorkExperience = async (studentId, studentWorkExperienceData) => {
    try {
        const fetchStudent = await studentModel.findById(studentId);

        if (!fetchStudent) {
            return {
                status: 404,
                message: 'Student not found with the provided ID'
            };
        }

        let experiences = studentWorkExperienceData.experiences || [];

        if (!Array.isArray(experiences)) {
            experiences = [experiences];
        }

        experiences = experiences
            .filter(exp => exp && Object.keys(exp).length > 0) // remove empty objects
            .map(exp => {
                // Handle startDate: if it's already a number (Unix timestamp), keep it; otherwise convert from string
                if (exp.startDate) {
                    if (typeof exp.startDate === 'number') {
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
                    if (typeof exp.endDate === 'number') {
                        // Already a Unix timestamp, keep as is
                        exp.endDate = exp.endDate;
                    } else {
                        // Convert from date string to Unix timestamp in seconds
                        const timestamp = convertIntoUnixTimeStamp(exp.endDate);
                        exp.endDate = timestamp ? Math.floor(timestamp / 1000) : null;
                    }
                }
                return exp;
            });

        // Calculate total experience months from all experiences
        const totalExperienceMonths = experiences.reduce((sum, exp) => {
            return sum + (exp.experienceDurationMonths || 0);
        }, 0);

        const updateStdWorkExperienceData = await StudentExperience.findOneAndUpdate(
            { studentId },
            {
                experiences,
                totalExperienceMonths,
                updatedAt: currentUnixTimeStamp()
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        fetchStudent.profileCompletion.studentWorkExperienceData = 1;
        await fetchStudent.save();

        return {
            status: 200,
            message: 'Student work experience updated successfully',
            jsonData: updateStdWorkExperienceData
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during student work experience update',
            error: error.message
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
                message: 'Student not found with the provided ID'
            };
        }

        const studentResumeFilePath = studentResumeData.studentResumeFile;

        fetchStudent.studentResumeFile = studentResumeFilePath;
        fetchStudent.profileCompletion.studentResume = 1;
        await fetchStudent.save();

        return {
            status: 200,
            message: 'Student resume uploaded successfully',
            jsonData: {
                studentId: fetchStudent._id,
                studentResumeFile: fetchStudent.studentResumeFile
            }
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during student resume upload',
            error: error.message
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
                message: 'Student not found with the provided ID',
                jsonData: null
            };
        }

        const notification = await NotificationModel.findById(notificationId);
        if (!notification) {
            return {
                status: 404,
                message: 'Notification not found with the provided ID'
            };
        }

        const removeNotification = await NotificationModel.findByIdAndUpdate(
            notificationId,
            { $pull: { notifyNotToStudents: studentId } },
            { new: true }
        );

        return {
            status: 200,
            message: 'Student notification removed successfully',
            jsonData: null
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred during removing student notification',
            error: error.message
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
                message: 'Student not found with the provided ID'
            };
        }

        const studentSector = student.studentJobSector;

        const getNotificationsList = await NotificationModel.find({
            notifyNotToStudents: { $nin: [studentId] },
            // notifyJobSector: studentSector
        }).sort({ notifyCreateAt: -1 });

        return {
            status: 200,
            message: 'Notification list for student fetched successfully',
            jsonData: {
                getNotificationsList: getNotificationsList,
                notificationsCount: getNotificationsList.length
            }
        };

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred while fetching notifications for student',
            error: error.message
        };
    }
};