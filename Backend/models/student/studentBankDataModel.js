const mongoose = require("mongoose");
const {currentUnixTimeStamp} = require("../../utils/currentUnixTimeStamp");

const StudentBankInfoSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },

  bankHolderName: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  branchName: { type: String, required: true },
  passbookUrl: { type: String, default: null },

  createdAt: { type: Number, default: () => currentUnixTimeStamp() },
  updatedAt: { type: Number, default: () => currentUnixTimeStamp() }
});

StudentBankInfoSchema.pre("save", function (next) {
  this.updatedAt = currentUnixTimeStamp();
  next();
});

module.exports = mongoose.model("StudentBankInfo", StudentBankInfoSchema);
