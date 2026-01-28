const mongoose = require("mongoose");
const { currentUnixTimeStamp } = require("../../utils/currentUnixTimeStamp");

const StudentSkillsSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    unique: true,      // one skills doc per student
    index: true
  },

  hobbies: { type: [String], default: [] },
  technicalSkills: { type: [String], default: [] },
  softSkills: { type: [String], default: [] },
  computerKnowledge: { type: [String], default: [] },

  languageProficiency: {
    type: [
      {
        language: { type: String, trim: true },
        read: { type: Boolean, default: false },
        write: { type: Boolean, default: false },
        speak: { type: Boolean, default: false }
      }
    ],
    default: []
  },

  createdAt: { type: Number, default: () => currentUnixTimeStamp() },
  updatedAt: { type: Number, default: () => currentUnixTimeStamp() }
});

/* Runs on save */
StudentSkillsSchema.pre("save", function (next) {
  this.updatedAt = currentUnixTimeStamp();
  next();
});

/* Runs on findOneAndUpdate */
StudentSkillsSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: currentUnixTimeStamp() });
  next();
});

module.exports = mongoose.model("StudentSkills", StudentSkillsSchema);
