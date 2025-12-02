// models/StudentAddress.js
const mongoose = require("mongoose");
const { currentUnixTimeStamp } = require("../../utils/currentUnixTimeStamp.js");

const StudentAddressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },

  current: {
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    district: String,
    country: String,
    pincode: String
  },

  permanent: {
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    district: String,
    country: String,
    pincode: String
  },

  isPermanentSameAsCurrent: { type: Boolean, default: false },

  createdAt: { type: Number, default: () => currentUnixTimeStamp() },
  updatedAt: { type: Number, default: () => currentUnixTimeStamp() }
});

StudentAddressSchema.pre("save", function(next){
  this.updatedAt = currentUnixTimeStamp();
  next();
});

module.exports = mongoose.model("StudentAddress", StudentAddressSchema);
