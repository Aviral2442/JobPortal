const mongoose = require("mongoose");

const ImportantDateSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
});

const FeeSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  fee: { type: String, default: "" },
});

const VacancySchema = new mongoose.Schema({
  postName: { type: String, required: true, trim: true },
  total: { type: Number, default: 0 },
  UR: { type: Number, default: 0 },
  EWS: { type: Number, default: 0 },
  OBC: { type: Number, default: 0 },
  SC: { type: Number, default: 0 },
  ST: { type: Number, default: 0 },
  PwBD: { type: Number, default: 0 },
  extraRequirements: { type: String, default: "" },
});

const LinkSchema = new mongoose.Schema({
  type: { type: String, default: "Other", trim: true },
  label: { type: String, default: "", trim: true },
  url: { type: String, default: "", trim: true },
});

const MetaDetailsSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  keywords: { type: String, default: "" },
  schemas: { type: String, default: "" },
});

const JobSchema = new mongoose.Schema(
  {
    // Relaxed required constraints to allow auto-create with minimal data
    postName: { type: String, default: "", trim: true },
    organization: { type: String, default: "", trim: true },
    advtNumber: { type: String, default: "", trim: true },
    jobRecommendation: { type: Boolean, default: false },
    jobFeatured: { type: Boolean, default: false },
    jobUpcoming: { type: Boolean, default: false },
    jobType: { type: String, default: "", trim: true },
    sector: { type: String, default: "", trim: true },
    jobCategory: { type: String, default: "", trim: true },
    jobLocation: { type: String, default: "", trim: true },
    experience: { type: String, default: "" },
    modeOfExam: { type: String, default: "" },
    shortDescription: { type: String, default: "" },

    // New field to match UI
    expiryDate: { type: Date },

    dates: { type: [ImportantDateSchema], default: [] },
    fees: { type: [FeeSchema], default: [] },
    vacancies: { type: [VacancySchema], default: [] },

    eligibility: {
      qualification: { type: String, default: "Graduate" },
      finalYearEligible: { type: String, default: "", trim: true },
      ageMin: { type: Number, default: 0 },
      ageMax: { type: Number, default: 0 },
      ageRelaxation: { type: String, default: "" },
      gateRequired: { type: String, default: "", trim: true },
      gateCodes: { type: String, default: "" },
      extraRequirements: { type: String, default: "" },
    },

    salary: {
      payScale: { type: String, default: "" },
      inHand: { type: String, default: "" },
      allowances: { type: String, default: "" },
    },

    selection: { type: [String], default: [] },
    links: { type: [LinkSchema], default: [] },
    howToApply: { type: String, default: "" },

    files: { type: [String], default: [] },
    logo: { type: String, default: "" },

    metaDetails: { type: MetaDetailsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
