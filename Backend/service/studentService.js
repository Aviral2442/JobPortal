const { buildDateFilter } = require('../utils/dateFilters');
const { buildPagination } = require('../utils/paginationFilters');
const { currentUnixTimeStamp } = require('../utils/currentUnixTimeStamp');
const studentModel = require('../models/studentModel');
const studentAddressModel = require('../models/student/studentAddressModel');
const studentBasicDetailModel = require('../models/student/studentBasicDetailModel');
const StudentBankInfo = require('../models/student/studentBankDataModel');
const StudentBodyDetails = require('../models/student/studentBodyDetailModel');
const StudentPreferences = require('../models/student/studentCareerPreferenceModel');
const StudentCertifications = require('../models/student/studentCertificatesModel');
const StudentDocumentUpload = require('../models/student/studentDocumentUploadModel');
const StudentEducation = require('../models/student/studentEducationModel');
const sendEmailOtp = require('../utils/emailOtp');

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
}

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

        if (studentData.studentReferralByCode) {
            const studentReferralCodeExists = await studentModel.findOne({
                studentReferralCode: studentData.studentReferralByCode
            });

            if (!studentReferralCodeExists) {
                return { status: 400, message: 'Invalid referral code provided' };
            }

            studentData.studentReferralById = studentReferralCodeExists._id;
            studentData.studentReferralByCode = studentReferralCodeExists.studentReferralCode;
        }

        const generateRandomReferralCode = async () => {
            const prefix = "CW"; // CW = CareerWave
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let code = prefix;

            for (let i = 0; i < 6; i++) {
                code += characters[Math.floor(Math.random() * characters.length)];
            }

            const exists = await studentModel.findOne({ studentReferralCode: code });
            if (exists) {
                return await generateRandomReferralCode();
            }

            return code;
        };

        const newStudent = new studentModel({
            studentProfilePic: studentData.studentProfilePic || null,
            studentFirstName: studentData.studentFirstName,
            studentLastName: studentData.studentLastName,
            studentEmail: studentData.studentEmail,
            studentMobileNo: studentData.studentMobileNo,
            studentPassword: studentData.studentPassword,
            studentJobType: studentData.studentJobType,
            studentReferralCode: await generateRandomReferralCode(),
            studentReferralById: studentData.studentReferralById || null,
            studentReferralByCode: studentData.studentReferralByCode || null
        });

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
                studentJobType: newStudent.studentJobType,
                studentReferralCode: newStudent.studentReferralCode
            }
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
                message: 'Student not found with the provided email or mobile number'
            };
        }


        if (student.studentPassword !== studentLoginData.studentPassword) {
            return {
                status: 401,
                message: 'Incorrect password'
            };
        }

        return {
            status: 200,
            message: 'Student logged in successfully',
            jsonData: {
                studentId: student._id,
                studentFirstName: student.studentFirstName,
                studentLastName: student.studentLastName,
                studentEmail: student.studentEmail,
                studentMobileNo: student.studentMobileNo,
                studentJobType: student.studentJobType,
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

// STUDENT FORGET PASSWORD SERVICE
exports.studentForgetPassword = async (studentForgetData) => {
    try {

        const forgetEmailOrMobileNo = studentForgetData.studentEmailOrMobileNo;
        const student = await studentModel.findOne({
            $or: [
                { studentEmail: forgetEmailOrMobileNo },
                { studentMobileNo: forgetEmailOrMobileNo }
            ]
        });

        if (!student) {
            return {
                status: 404,
                message: 'Student not found with the provided email or mobile number'
            };
        }

        const generateRandomOTP = () => {
            return Math.floor(100000 + Math.random() * 900000).toString();
        };

        const otp = generateRandomOTP();
        const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

        student.studentOtp = otp;
        student.studentOtpExpiry = expiry;
        await student.save();

        if (student.studentEmail === forgetEmailOrMobileNo) {
            console.log('email');

            await sendEmailOtp(student.studentEmail, otp);

            return {
                status: 200,
                message: 'OTP sent to registered email successfully',
                jsonData: {
                    studentId: student._id,
                    studentEmail: student.studentEmail
                }
            };
        } else {
            console.log('mobile');

            return {
                status: 200,
                message: 'OTP sent to registered mobile number successfully',
                jsonData: {
                    studentId: student._id,
                    studentMobileNo: student.studentMobileNo
                }
            };
        };

    } catch (error) {
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

        const updateStdBankData = await StudentBankInfo.findOneAndUpdate(
            { studentId },
            {
                bankHolderName: studentBankData.bankHolderName,
                bankName: studentBankData.bankName,
                accountNumber: studentBankData.accountNumber,
                ifscCode: studentBankData.ifscCode,
                branchName: studentBankData.branchName,
                passbookUrl: studentBankData.passbookUrl,
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