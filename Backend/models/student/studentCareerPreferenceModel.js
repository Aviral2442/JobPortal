const mongoose = require("mongoose");
const {currentUnixTimeStamp} = require("../../utils/currentUnixTimeStamp");

const StudentPreferencesSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },

  preferredJobCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "CareerPreferences" }],
  preferredJobLocation: { type: [String], default: [] },
  expectedSalaryMin: { type: Number, default: 0 },
  expectedSalaryMax: { type: Number, default: 0 },

  employmentType: { type: [String], default: [] },
  willingToRelocate: { type: Boolean, default: false },

  createdAt: { type: Number, default: () => currentUnixTimeStamp() },
  updatedAt: { type: Number, default: () => currentUnixTimeStamp() }
});

StudentPreferencesSchema.pre("save", function (next) {
  this.updatedAt = currentUnixTimeStamp();
  next();
});

module.exports = mongoose.model("StudentPreferences", StudentPreferencesSchema);
