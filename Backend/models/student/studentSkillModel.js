const mongoose = require("mongoose");
const { currentUnixTimeStamp } = require("../../utils/currentUnixTimeStamp");

const StudentSkillsSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },

  hobbies: [String],

  technicalSkills: [
    {
      techSkillsName: { type: String, unique: true },
    }
  ],

  softSkills: {
    type: [
      {
        softSkillsName: { type: String, unique: true },
      }
    ],
    default: []
  },

  computerKnowledge: {
    type: [{
      computerSkillName: { type: String, unique: true },
    }],
    default: []
  },

  languageProficiency: {
    type: [
      {
        language: String,
        read: { type: Boolean, default: false },
        write: { type: Boolean, default: false },
        speak: { type: Boolean, default: false }
      }
    ]
  },

  createdAt: { type: Number, default: () => currentUnixTimeStamp() },
  updatedAt: { type: Number, default: () => currentUnixTimeStamp() }
});

StudentSkillsSchema.pre("save", function (next) {
  this.updatedAt = currentUnixTimeStamp();
  next();
});

module.exports = mongoose.model("StudentSkills", StudentSkillsSchema);
