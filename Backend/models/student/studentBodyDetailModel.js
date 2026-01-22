// models/StudentBodyDetails.js
const mongoose = require("mongoose");
const { currentUnixTimeStamp } = require("../../utils/currentUnixTimeStamp");

const StudentBodyDetailsSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },

  heightCm: { type: Number, required: true },
  weightKg: { type: Number, required: true },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', "Don't Know"], default: null, required: true },
  eyeColor: { type: String, default: null },
  hairColor: { type: String, default: null },

  identificationMark1: { type: String, default: null },
  identificationMark2: { type: String, default: null },

  disability: { type: Boolean, default: false },
  disabilityType: { type: String, default: null },
  disabilityPercentage: { type: Number, default: null },

  createdAt: { type: Number, default: () => currentUnixTimeStamp() },
  updatedAt: { type: Number, default: () => currentUnixTimeStamp() }
});

StudentBodyDetailsSchema.pre("save", function (next) {
  this.updatedAt = currentUnixTimeStamp();
  next();
});

module.exports = mongoose.model("StudentBodyDetails", StudentBodyDetailsSchema);
