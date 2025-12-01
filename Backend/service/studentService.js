const studentModel = require('../models/studentModel');
const sendEmailOtp = require('../utils/emailOtp');

exports.studentListService = async () => {
    try {

        

    } catch (error) {
        return {
            status: 500,
            message: 'An error occurred while fetching student list',
            error: error.message
        }
    }
}

// Student Registration Service
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
            studentProfilePic: studentData.studentProfilePic,
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

// Student Login Service
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

// Student Forget Password Service
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

// Verify Student OTP Service
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

// Reset Student Password Service
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