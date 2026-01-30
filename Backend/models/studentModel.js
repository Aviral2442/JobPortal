const mongoose = require("mongoose");
const currentUnixTime = require("../utils/currentUnixTimeStamp");

const StudentSchema = new mongoose.Schema({

    studentProfilePic: { type: String },
    studentFirstName: { type: String, required: true },
    studentLastName: { type: String },
    studentEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
    studentMobileNo: { type: String, default: " ", required: true, unique: true },
    studentPassword: { type: String, default: " ", required: true },
    studentJobSector: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSector', required: true },
    studentResumeFile: { type: String },
    studentReferralCode: { type: String },
    studentReferralById: { type: mongoose.Schema.Types.ObjectId, ref: 'student', default: null },
    studentReferralByCode: { type: String, default: null },
    studentOtp: { type: String, default: null },
    studentOtpExpiry: { type: Number, default: null },
    studentLastLoginType: { type: String, enum: ["password", "google", "otpLogin"], default: "password" },

    // 0 = not completed, 1 = completed
    profileCompletion: {
        studentBasicData: { type: Number, default: 0 },
        studentAddressData: { type: Number, default: 0 },
        studentBodyData: { type: Number, default: 0 },
        studentParentData: { type: Number, default: 0 },
        studentEducationData: { type: Number, default: 0 },
        studentDocumentsData: { type: Number, default: 0 },
        studentCertificationsData: { type: Number, default: 0 },
        studentSkillsData: { type: Number, default: 0 },
        studentWorkExperienceData: { type: Number, default: 0 },
        studentPreferencesData: { type: Number, default: 0 },
        studentBankData: { type: Number, default: 0 },
        studentEmergencyData: { type: Number, default: 0 },
        studentSocialData: { type: Number, default: 0 },
        studentResume: { type: Number, default: 0 }
    },

    lastLoginAt: { type: Number, default: null },
    lastLogoutAt: { type: Number, default: null },

    accountStatus: { type: String, enum: ["active", "inactive", "blocked"], default: "active" },

    studentCreatedAt: { type: Number, default: () => currentUnixTime.currentUnixTimeStamp() },
    studentUpdatedAt: { type: Number, default: () => currentUnixTime.currentUnixTimeStamp() }
});

StudentSchema.pre("save", function (next) {
    this.studentUpdatedAt = currentUnixTime.currentUnixTimeStamp();
    next();
});

module.exports = mongoose.model("student", StudentSchema);
