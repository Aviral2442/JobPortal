// models/StudentDocuments.js
const mongoose = require("mongoose");
const { currentUnixTimeStamp } = require("../../utils/currentUnixTimeStamp");

// Each single education record 
const EducationSchema = new mongoose.Schema({
  level: { type: String, required: true },
  // Examples: "10th", "12th", "UG", "PG", "Diploma", "Certificate", "PhD"

  file: { type: String, required: true },
  boardName: { type: String, required: true },
  passingYear: { type: String, required: true },
  maxMarks: { type: String, required: true },
  obtainedMarks: { type: String, required: true },
  percentage: { type: String, required: true }
}, { _id: true });


// Identity documents
const IdentityDocumentSchema = new mongoose.Schema({
  aadharNumber: { type: String, unique: true, sparse: true },
  aadharFrontImg: { type: String },
  aadharBackImg: { type: String },

  panNumber: { type: String },
  panImg: { type: String },

  voterId: { type: String },

  passportNumber: { type: String },

  drivingLicenseNo: { type: String },
  drivingLicenseFrontImg: { type: String },

  categoryCertificateUrl: { type: String },
  domicileCertificateUrl: { type: String },
  incomeCertificateUrl: { type: String },
  birthCertificateUrl: { type: String }
}, { _id: false });


// Additional documents
const OtherDocumentSchema = new mongoose.Schema({
  documentName: { type: String, required: true },
  documentFile: { type: String, required: true }
}, { _id: true });


// FINAL MAIN MODEL
const StudentDocumentsSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, unique: true },

  education: { type: [EducationSchema], default: [] },       // All academic docs
  identityDocuments: { type: IdentityDocumentSchema, default: {} },
  otherDocuments: { type: [OtherDocumentSchema], default: [] }, // Extra docs

  createdAt: { type: Number, default: () => currentUnixTimeStamp() },
  updatedAt: { type: Number, default: () => currentUnixTimeStamp() }
});

StudentDocumentsSchema.pre("save", function (next) {
  this.updatedAt = currentUnixTimeStamp();
  next();
});

module.exports = mongoose.model("StudentDocuments", StudentDocumentsSchema);
