const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  // BASIC DETAILS
  job_title: { type: String, required: true },
  job_short_desc: { type: String, required: true },
  job_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobCategory",
    required: true,
  },
  job_sub_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobSubCategory",
    required: true,
  },
  job_advertisement_no: { type: String, required: true },
  job_organization: { type: String, required: true },
  job_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobType",
    required: true,
  },
  job_sector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobSector",
    required: true,
  },
  job_logo: { type: String, required: false },
  job_status: { type: Number, default: 0 }, // 0 = Active, 1 = Inactive
  job_posted_date: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000),
  },
  job_last_updated_date: { type: Number },

  // IMPORTANT DATES (all in Unix timestamp seconds)
  job_start_date: { type: Number, required: false },
  job_end_date: { type: Number, required: false },
  job_notification_release_date: { type: Number, required: false },
  job_fees_pmt_last_date: { type: Number, required: false },
  job_correction_start_date: { type: Number, required: false },
  job_correction_end_date: { type: Number, required: false },
  job_reopen_start_date: { type: Number, required: false },
  job_reopen_end_date: { type: Number, required: false },
  job_last_date_extended: { type: Number, required: false },
  job_fees_pmt_last_date_extended: { type: Number, required: false },
  job_exam_date: { type: Number, required: false },
  job_exam_date_extended: { type: Number, required: false },
  job_admit_card_release_date: { type: Number, required: false },
  job_result_declaration_date: { type: Number, required: false },
  job_joining_date: { type: Number, required: false },
  job_re_exam_date: { type: Number, required: false },
  job_answer_key_release_date: { type: Number, required: false },

  // APPLICATION FEES
  job_fees_general: { type: Number, default: 0 },
  job_fees_obc: { type: Number, default: 0 },
  job_fees_sc: { type: Number, default: 0 },
  job_fees_st: { type: Number, default: 0 },
  job_fees_ex_serviceman: { type: Number, default: 0 },
  job_fees_pwd: { type: Number, default: 0 },
  job_fees_ews: { type: Number, default: 0 },

  // ELIGIBILITY CRITERIA
  job_eligibility_age_min: { type: Number, default: 0 },
  job_eligibility_age_max: { type: Number, default: 0 },
  job_eligibility_qualifications: { type: String, required: false },
  job_eligibility_experience: { type: String, required: false },
  job_extra_criteria: { type: String, required: false },

  // JOB VACANCY DETAILS
  job_vacancy_total: { type: Number, default: 0 },
  job_vacancy_for_general: { type: Number, default: 0 },
  job_vacancy_for_obc: { type: Number, default: 0 },
  job_vacancy_for_sc: { type: Number, default: 0 },
  job_vacancy_for_st: { type: Number, default: 0 },
  job_vacancy_for_ex_serviceman: { type: Number, default: 0 },
  job_vacancy_for_pwd: { type: Number, default: 0 },
  job_vacancy_for_ews: { type: Number, default: 0 },

  // JOB PAYMENT OPTIONS
  job_pmt_debit_card: { type: Boolean, default: false },
  job_pmt_credit_card: { type: Boolean, default: false },
  job_pmt_net_banking: { type: Boolean, default: false },
  job_pmt_upi: { type: Boolean, default: false },
  job_pmt_wallets: { type: Boolean, default: false },
  job_pmt_e_challan: { type: Boolean, default: false },

  // JOB SALARY DETAILS
  job_salary_min: { type: Number, default: 0 },
  job_salary_max: { type: Number, default: 0 },
  job_salary_allowance: { type: Number, default: 0 },
  job_salary_inhand: { type: Number, default: 0 },
  job_salary_bond_condition: { type: String, required: false },

  // SELECTION PROCESS
  selection: [{ type: String }], 

  // IMPORTANT LINKS
  job_important_links: [{
      type: { type: String, default: "Other", trim: true },
      label: { type: String, default: "", trim: true },
      url: { type: String, default: "", trim: true },
    }],

  // HOW TO APPLY
  howToApply: { type: String, required: false },

  // FILES
  files: [{ type: String }],

  jobRecommendation: { type: Boolean, default: false },
  jobFeatured: { type: Boolean, default: false },

  // SEO DETAILS
  job_meta_title: { type: String, default: "" },
  job_meta_description: { type: String, default: "" },
  job_meta_keywords: { type: String, default: "" },
  job_meta_schemas: { type: String, default: "" },
});

// Update job_last_updated_date before save
JobSchema.pre("save", function (next) {
  this.job_last_updated_date = Math.floor(Date.now() / 1000);
  next();
});

module.exports = mongoose.model("Jobs", JobSchema);
