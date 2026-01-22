// models/StudentBasicInfo.js
const mongoose = require("mongoose");
const currentUnixTime = require("../.././utils/currentUnixTimeStamp");

const StudentBasicInfoSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },

  studentDOB: { type: String, required: true },
  studentGender: { type: String, required: true, enum: ["male", "female", "other", "prefer_not_to_say"], default: "prefer_not_to_say" },

  studentAlternateMobileNo: { type: String, default: null },

  studentMaritalStatus: { type: String, required: true, enum: ["single", "married", "other", "prefer_not_to_say"], default: "single" },
  studentMotherTongue: { type: String, default: null },
  studentNationality: { type: String, default: null },
  studentCitizenship: { type: String, default: null },

  studentCreatedAt: { type: Number, default: () => currentUnixTime.currentUnixTimeStamp() },
  studentUpdatedAt: { type: Number, default: () => currentUnixTime.currentUnixTimeStamp() }
});

StudentBasicInfoSchema.pre("save", function (next) {
  this.studentUpdatedAt = currentUnixTime.currentUnixTimeStamp();
  next();
});

module.exports = mongoose.model("StudentBasicInfo", StudentBasicInfoSchema);
