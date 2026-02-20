const path = require("path");
const Job = require("../models/JobModel");
const NotificationModel = require("../models/NotificationModel");

const toPublicPath = (absPath) => {
  const rel = absPath.replace(/\\/g, "/");
  if (rel.includes("/uploads/")) {
    const idx = rel.indexOf("/uploads/");
    return rel.slice(idx + 1);
  }
  const base = path.basename(rel);
  return `uploads/jobs/${base}`;
};

// Create Job
const createJob = async (req, res) => {
  try {
    const jobData = JSON.parse(req.body.jobData || "{}");

    // Handle file uploads
    if (req.files) {
      if (req.files.files) {
        jobData.files = req.files.files.map((f) => toPublicPath(f.path));
      }
      if (req.files.logo && req.files.logo[0]) {
        jobData.job_logo = toPublicPath(req.files.logo[0].path);
      }
    }

    // Set defaults
    jobData.job_status = jobData.job_status ?? 0;
    jobData.job_posted_date = Math.floor(Date.now() / 1000);
    jobData.job_last_updated_date = Math.floor(Date.now() / 1000);

    const job = await Job.create(jobData);
    console.log("Created Job:", job);
    const createNofitication = await NotificationModel.create({
      notifyJobId: job._id,
      notifyTitle: `New Job Posted: ${job.job_title}`,
      notifyDesc: `A new job titled "${job.job_title}" has been posted. Check it out!`,
    });
    
    return res.status(201).json({
      message: "Job created successfully",
      _id: job._id,
      jobId: job._id,
      job
    });
  } catch (error) {
    console.error("Create Job Error:", error);
    return res.status(400).json({
      message: "Bad Request",
      error: error.message
    });
  }
};

// Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).populate('job_category').populate('job_sub_category').populate('job_type').populate('job_sector');
    return res.json(jobs);
  } catch (error) {
    console.error("Get Jobs Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get job by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    return res.json(job);
  } catch (error) {
    console.error("Get Job Error:", error);
    return res.status(400).json({ error: "Invalid Job ID" });
  }
};

// Update job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const jobData = JSON.parse(req.body.jobData || "{}");

    if (req.files) {
      if (req.files.files) jobData.files = req.files.files.map((f) => toPublicPath(f.path));
      if (req.files.logo && req.files.logo[0]) jobData.job_logo = toPublicPath(req.files.logo[0].path);
    }

    jobData.job_last_updated_date = Math.floor(Date.now() / 1000);

    const job = await Job.findByIdAndUpdate(id, jobData, {
      new: true,
      runValidators: true
    });

    if (!job) return res.status(404).json({ error: "Job not found" });

    return res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("Update Job Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Save job section with proper mapping
const saveJobSection = async (req, res) => {
  try {
    const { jobId, section, data } = req.body;

    if (!jobId || !section) {
      return res.status(400).json({ error: "jobId and section are required" });
    }

    console.log(`Saving section: ${section}`, data);

    let updateDoc = { $set: {} };

    switch (section) {
      case "basicDetails":
        updateDoc.$set = {
          job_title: data.job_title,
          job_apply_link: data.job_apply_link,
          job_short_desc: data.job_short_desc,
          job_advertisement_no: data.job_advertisement_no,
          job_organization: data.job_organization,
          job_type: data.job_type,
          job_sector: data.job_sector,
          job_category: data.job_category,
          job_sub_category: data.job_sub_category,
          job_last_updated_date: Math.floor(Date.now() / 1000),
        };
        break;

      case "dates":
        // Data already contains mapped date fields
        updateDoc.$set = {
          ...data,
          job_last_updated_date: Math.floor(Date.now() / 1000),
        };
        break;

      case "fees":
        updateDoc.$set = {
          job_fees_details: data.job_fees_details || [],
          job_last_updated_date: Math.floor(Date.now() / 1000),
        };
        break;

      case "vacancies":
        updateDoc.$set = {
          job_vacancy_details: data.job_vacancy_details || [],
          job_last_updated_date: Math.floor(Date.now() / 1000),
        };
        break;

      case "eligibility":
        updateDoc.$set = {
          job_eligibility_age_min: data.job_eligibility_age_min ?? 0,
          job_eligibility_age_max: data.job_eligibility_age_max ?? 0,
          job_eligibility_qualifications: data.job_eligibility_qualifications ?? "",
          job_eligibility_experience: data.job_eligibility_experience ?? "",
          job_extra_criteria: data.job_extra_criteria ?? "",
          job_last_updated_date: Math.floor(Date.now() / 1000),
        };
        break;

      case "salary":
        updateDoc.$set = {
          job_salary_min: data.job_salary_min ?? 0,
          job_salary_max: data.job_salary_max ?? 0,
          job_salary_inhand: data.job_salary_inhand ?? 0,
          job_salary_allowance: data.job_salary_allowance ?? "",
          job_salary_bond_condition: data.job_salary_bond_condition ?? "",
          job_last_updated_date: Math.floor(Date.now() / 1000),
        };
        break;

      case "paymentOptions":
        updateDoc.$set = {
          job_pmt_debit_card: data.job_pmt_debit_card ?? false,
          job_pmt_credit_card: data.job_pmt_credit_card ?? false,
          job_pmt_net_banking: data.job_pmt_net_banking ?? false,
          job_pmt_upi: data.job_pmt_upi ?? false,
          job_pmt_wallets: data.job_pmt_wallets ?? false,
          job_pmt_e_challan: data.job_pmt_e_challan ?? false,
          job_last_updated_date: Math.floor(Date.now() / 1000),
        };
        break;

      case "selection":
        updateDoc.$set = {
          selection: data.selection || [],
          job_last_updated_date: Math.floor(Date.now() / 1000),
        };
        break;

      case "links":
        // Store links as array of objects with type, label, and url
        let linksArray = [];

        if (Array.isArray(data.job_important_links)) {
          linksArray = data.job_important_links
            .filter(link => link && link.label && link.url)
            .map(link => ({
              type: link.type?.trim() || "Other",
              label: link.label.trim(),
              url: link.url.trim(),
            }));
        }

        updateDoc.$set = {
          job_important_links: linksArray,
          job_last_updated_date: Math.floor(Date.now() / 1000),
        };
        break;

      case "howToApply":
        updateDoc.$set = {
          howToApply: data.howToApply || "",
          job_last_updated_date: Math.floor(Date.now() / 1000),
        };
        break;

      case "metaDetails":
        updateDoc.$set = {
          job_meta_title: data.job_meta_title || "",
          job_meta_description: data.job_meta_description || "",
          job_meta_keywords: data.job_meta_keywords || "",
          job_meta_schemas: data.job_meta_schemas || "",
          job_last_updated_date: Math.floor(Date.now() / 1000),
        };
        break;

      default:
        return res.status(400).json({ error: `Unknown section: ${section}` });
    }

    const updated = await Job.findByIdAndUpdate(jobId, updateDoc, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Job not found" });
    }

    console.log(`Section ${section} saved successfully`);
    return res.status(200).json({
      message: `${section} saved successfully`,
      job: updated
    });
  } catch (error) {
    console.error("Save Section Error:", error);
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
};

// Upload job files
const uploadJobFiles = async (req, res) => {
  try {
    const { jobId } = req.body;
    console.log("Uploading files for Job ID:", jobId);
    console.log("Files received:", req.files);
    if (!jobId) return res.status(400).json({ error: "jobId is required" });

    const filePaths = (req.files || []).map((f) => toPublicPath(f.path));
    const job = await Job.findById(jobId);

    if (!job) return res.status(404).json({ error: "Job not found" });

    job.files = [...(job.files || []), ...filePaths];
    job.job_last_updated_date = Math.floor(Date.now() / 1000);
    await job.save();

    return res.status(200).json({
      message: "Files uploaded successfully",
      files: job.files,
      job
    });
  } catch (error) {
    console.error("Upload Files Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Delete job
const deleteJob = async (req, res) => {
  try {
    const removed = await Job.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Job not found" });
    return res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete Job Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Delete array item from job section
const deleteJobArrayItem = async (req, res) => {
  try {
    const { id, section, index } = req.params;
    console.log(`Request to delete item at index ${index} from section ${section} of job ${id}`);
    
    // Map frontend section names to actual model field names
    const sectionFieldMap = {
      fees: "job_fees_details",
      vacancies: "job_vacancy_details",
      links: "job_important_links",
      selection: "selection",
      files: "files",
    };

    const fieldName = sectionFieldMap[section] || section;
    
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (!Array.isArray(job[fieldName])) {
      console.log("not array h chahcha")
      return res.status(400).json({ error: `${section} (${fieldName}) is not an array` });
    }

    const idx = Number(index);
    console.log(job[fieldName].length)
    if (Number.isNaN(idx) || idx < 0 || idx > job[fieldName].length) {
      console.log("invalid index")
      return res.status(400).json({ error: "Invalid index" });
    }
    console.log(`Deleting item at index ${idx} from field ${fieldName} of job ${id}`);
    job[fieldName].splice(idx, 1);
    job.job_last_updated_date = Math.floor(Date.now() / 1000);
    await job.save();

    return res.status(200).json({
      message: `${section} item deleted successfully`,
      job
    });
  } catch (error) {
    console.error("Delete Array Item Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  saveJobSection,
  uploadJobFiles,
  deleteJobArrayItem,
};