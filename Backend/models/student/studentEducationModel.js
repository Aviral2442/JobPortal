const mongoose = require("mongoose");
const { currentUnixTimeStamp } = require("../../utils/currentUnixTimeStamp");

const StudentEducationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },

  highestQualification: {
    type: String,
    enum: [
      "No formal education",
      "Primary",
      "Secondary",
      "Higher Secondary",
      "Diploma",
      "ITI",
      "Polytechnic",
      "Certificate",
      "Vocational",
      "Bachelors",
      "Masters",
      "MPhil",
      "PhD",
      "Other"
    ],
    default: "Higher Secondary"
  },

  tenth: {
    schoolName: String,
    board: String,
    passingYear: Number,
    percentage: Number,
    marksheetFile: String
  },

  twelfth: {
    schoolCollegeName: String,
    board: String,
    stream: String,
    passingYear: Number,
    percentage: Number,
    marksheetFile: String
  },

  graduation: {
    collegeName: String,
    courseName: String,
    specialization: String,
    passingYear: Number,
    percentage: Number,
    marksheetFile: String
  },

  postGraduation: {
    collegeName: String,
    courseName: String,
    specialization: String,
    passingYear: Number,
    percentage: Number,
    marksheetFile: String
  },

  additionalEducation: {
    type: [
      {
        additionalEduName: String,
        institutionName: String,
        passingYear: Number,
        percentage: Number,
        marksheetFile: String
      }
    ],
    default: []
  },

  createdAt: { type: Number, default: () => currentUnixTimeStamp() },
  updatedAt: { type: Number, default: () => currentUnixTimeStamp() }
});

StudentEducationSchema.pre("save", function (next) {
  this.updatedAt = currentUnixTimeStamp();
  next();
});

module.exports = mongoose.model("StudentEducation", StudentEducationSchema);
