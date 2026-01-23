const mongoose = require("mongoose");
const { currentUnixTimeStamp } = require("../../utils/currentUnixTimeStamp");

const ExperienceItemSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  jobType: { type: String }, // String values: Full-time, Part-time, Contract, Internship, Freelance

  experienceDurationMonths: { type: Number, default: 0 },

  startDate: { type: Number }, // timestamp
  endDate: { type: Number },   // timestamp

  responsibilities: String,
  experienceCertificateFile: String
}, { _id: false });


const StudentExperienceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },

  experiences: {
    type: [ExperienceItemSchema],
    default: []
  },

  totalExperienceMonths: { type: Number, default: 0 },

  createdAt: { type: Number, default: () => currentUnixTimeStamp() },
  updatedAt: { type: Number, default: () => currentUnixTimeStamp() }
});


// Auto-update timestamps + auto-calc total experience
StudentExperienceSchema.pre("save", function (next) {
  this.updatedAt = currentUnixTimeStamp();

  // Auto-calc total experience from all items
  this.totalExperienceMonths = this.experiences?.reduce((sum, item) => {
    return sum + (item.experienceDurationMonths || 0);
  }, 0);

  next();
});

module.exports = mongoose.model("StudentExperience", StudentExperienceSchema);
