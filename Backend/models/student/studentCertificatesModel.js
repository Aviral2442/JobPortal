const mongoose = require("mongoose");
const { currentUnixTimeStamp } = require("../../utils/currentUnixTimeStamp");

const CertificateItemSchema = new mongoose.Schema({
  certificationName: { type: String, required: true },
  issuingOrganization: { type: String, required: true },
  issueDate: { type: Number, required: true },
  expirationDate: { type: Number, default: null },
  credentialId: { type: String, default: null },
  certificateUrl: { type: String, default: null },
  certificateFile: { type: String }
}, { _id: true });

const StudentCertificationsSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, unique: true },

  certificates: { type: [CertificateItemSchema], default: [] },

  createdAt: { type: Number, default: () => currentUnixTimeStamp() },
  updatedAt: { type: Number, default: () => currentUnixTimeStamp() }
});

StudentCertificationsSchema.pre("save", function (next) {
  this.updatedAt = currentUnixTimeStamp();
  next();
});

module.exports = mongoose.model("StudentCertifications", StudentCertificationsSchema);
