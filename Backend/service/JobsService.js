const { saveBase64File } = require("../middleware/base64FileUpload");
const JobModel = require("../models/JobModel");
const NotificationModel = require("../models/NotificationModel");
const JobCategoryModel = require("../models/JobCategoryModel");
const JobSubCategoryModel = require("../models/JobSubCategoryModel");
const JobTypeModel = require("../models/JobTypeModel");
const JobSectorModel = require("../models/JobSectorModel");
const fs = require("fs");
const mongoose = require("mongoose");
const { parse } = require("csv-parse/sync");

// add a new job
exports.addJobsService = async (jobData) => {
  try {
    // Save logo if provided
    if (jobData.job_logo) {
      const logoPath = await saveBase64File(
        jobData.job_logo,
        "jobs",
        "logo",
        jobData.extension,
      );
      jobData.job_logo = logoPath;
    }

    // Save files if provided
    if (
      jobData.files &&
      Array.isArray(jobData.files) &&
      jobData.files.length > 0
    ) {
      const filePaths = [];
      for (let i = 0; i < jobData.files.length; i++) {
        const filePath = await saveBase64File(
          jobData.files[i],
          "jobs",
          `file_${i + 1}`,
          jobData.extensions[i],
        );
        filePaths.push(filePath);
      }
      jobData.files = filePaths;
    }

    // Remove extension fields before saving to database
    delete jobData.extension;
    delete jobData.extensions;

    const job = new JobModel(jobData);
    await job.save();

    const createNotification = await NotificationModel.create({
      notifyJobId: job._id,
      notifyTitle: `New Job Posted: ${job.job_title}`,
      notifyDesc: `A new job titled "${job.job_title}" has been posted. Check it out!`,
    });

    console.log(createNotification);

    return {
      status: 200,
      message: "Job created successfully",
      data: job,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error creating job",
      error: error.message,
    };
  }
};

// GET JOB DATA USING ID
exports.getJobByIdService = async (jobId) => {
  try {
    const job = await JobModel.findById(jobId);
    if (!job) {
      return {
        status: 404,
        message: "Job not found",
      };
    }

    return {
      status: 200,
      message: "Job fetched successfully",
      jsonData: {
        data: job,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error fetching job",
      error: error.message,
    };
  }
};

// UPDATE JOB USING ID SERVICE
exports.updateJobByIdService = async (jobId, updateData) => {
  try {
    // Get existing job to preserve existing files
    const existingJob = await JobModel.findById(jobId);
    if (!existingJob) {
      return {
        status: 404,
        message: "Job not found",
      };
    }

    // Process logo if provided
    if (updateData.job_logo && updateData.extension) {
      const logoPath = await saveBase64File(
        updateData.job_logo,
        "jobs",
        "logo",
        updateData.extension,
      );
      updateData.job_logo = logoPath;
    }

    // Process files if provided - APPEND to existing files
    if (
      updateData.files &&
      Array.isArray(updateData.files) &&
      updateData.files.length > 0 &&
      updateData.extensions
    ) {
      const existingFiles = existingJob.files || [];
      const newFilePaths = [];

      for (let i = 0; i < updateData.files.length; i++) {
        const fileIndex = existingFiles.length + i + 1;
        const filePath = await saveBase64File(
          updateData.files[i],
          "jobs",
          `file_${fileIndex}`,
          updateData.extensions[i],
        );
        newFilePaths.push(filePath);
      }

      // Append new files to existing files
      updateData.files = [...existingFiles, ...newFilePaths];
    }

    // Remove extension fields before saving to database
    delete updateData.extension;
    delete updateData.extensions;

    // Update the job with processed data
    const job = await JobModel.findByIdAndUpdate(jobId, updateData, {
      new: true,
    });

    return {
      status: 200,
      message: "Job updated successfully",
      data: job,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error updating job",
      error: error.message,
    };
  }
};

const resolveRel = async (value, model, nameField) => {
  if (!value) return null;
  const v = value.toString().trim();
  if (!v) return null;

  // console.log("Model name:", model.modelName);
  // console.log("Collection:", model.collection.name);
  // console.log("DB name:", model.db.name); // <-- what DB is it actually querying?
  // console.log("Looking for ID:", v);
  // const all = await model.find({}).limit(3);
  // console.log("Sample docs:", all);
  // If it's already a valid ObjectId, verify it exists
  // console.log(mongoose.Types.ObjectId.isValid(v));
  if (mongoose.Types.ObjectId.isValid(v)) {
    const found = await model.findById(v);
    console.log("Found:", found);
    if (found) return found._id;
  }
  // Try matching by name (case-insensitive)
  const escaped = v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const byName = await model.findOne({
    [nameField]: new RegExp(`^${escaped}$`, "i"),
  });
  if (byName) return byName._id;
  return null;
};

// Helper: resolve a relational field by ObjectId or name
exports.bulkUploadJobs = async (csvFilePath) => {
  try {
    if (!csvFilePath) {
      return { status: 400, message: "csvFilePath is required" };
    }

    if (!fs.existsSync(csvFilePath)) {
      return { status: 400, message: `CSV file not found: ${csvFilePath}` };
    }

    const raw = await fs.promises.readFile(csvFilePath, "utf8");

    // Robust CSV parsing: handles quoted fields, embedded newlines, BOM, etc.
    let rows;
    try {
      rows = parse(raw, {
        columns: true, // first row becomes header keys
        skip_empty_lines: true,
        trim: true,
        bom: true, // strip UTF-8 BOM if present
        relax_quotes: true,
        relax_column_count: true,
      });
    } catch (parseErr) {
      return {
        status: 400,
        message: "Failed to parse CSV",
        error: parseErr.message,
      };
    }

    if (!rows || rows.length === 0) {
      return { status: 400, message: "CSV contains no data rows" };
    }

    const results = { created: [], failed: [] };

    for (let i = 0; i < rows.length; i++) {
      try {
        const rowObj = rows[i]; // already a key-value object
        const jobPayload = {};

        for (const [header, rawValue] of Object.entries(rowObj)) {
          const value = (rawValue || "").trim();
          if (!header) continue;

          // Boolean
          if (["true", "false"].includes(value.toLowerCase())) {
            jobPayload[header] = value.toLowerCase() === "true";
            continue;
          }

          // Dates (before number check to avoid treating timestamps as plain numbers)
          if (header.includes("date")) {
            if (value === "") {
              jobPayload[header] = 0;
            } else if (!isNaN(value)) {
              jobPayload[header] = Number(value);
            } else {
              const d = new Date(value);
              jobPayload[header] = isNaN(d.getTime())
                ? 0
                : Math.floor(d.getTime() / 1000);
            }
            continue;
          }

          // Number
          if (value !== "" && !isNaN(value)) {
            jobPayload[header] = Number(value);
            continue;
          }

          // Pipe-separated arrays
          if (header === "selection" || header === "files") {
            jobPayload[header] = value
              ? value
                  .split("|")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [];
            continue;
          }

          jobPayload[header] = value;
        }

        // -------- RELATION RESOLUTION --------
        jobPayload.job_category = await resolveRel(
          jobPayload.job_category,
          JobCategoryModel,
          "category_name",
        );
        if (!jobPayload.job_category && rowObj.job_category) {
          throw new Error(
            `Could not resolve job_category: no matching ID or category_name found for "${rowObj.job_category}"`,
          );
        }
        jobPayload.job_sub_category = await resolveRel(
          jobPayload.job_sub_category,
          JobSubCategoryModel,
          "subcategory_name",
        );
        if (!jobPayload.job_sub_category && rowObj.job_sub_category) {
          throw new Error(
            `Could not resolve job_sub_category: no matching ID or subcategory_name found for "${rowObj.job_sub_category}"`,
          );
        }
        jobPayload.job_type = await resolveRel(
          jobPayload.job_type,
          JobTypeModel,
          "job_type_name",
        );
        if (!jobPayload.job_type && rowObj.job_type) {
          throw new Error(
            `Could not resolve job_type: no matching ID or job_type_name found for "${rowObj.job_type}"`,
          );
        }
        jobPayload.job_sector = await resolveRel(
          jobPayload.job_sector,
          JobSectorModel,
          "job_sector_name",
        );
        if (!jobPayload.job_sector && rowObj.job_sector) {
          throw new Error(
            `Could not resolve job_sector: no matching ID or job_sector_name found for "${rowObj.job_sector}"`,
          );
        }

        // -------- REQUIRED FIELD VALIDATION --------
        const requiredFields = [
          "job_title",
          "job_short_desc",
          "job_advertisement_no",
          "job_organization",
          "job_category",
          "job_sub_category",
          "job_type",
          "job_sector",
        ];

        // Report ALL missing fields at once instead of throwing on the first one
        const missing = requiredFields.filter((f) => !jobPayload[f]);
        if (missing.length > 0) {
          throw new Error(`Missing required fields: ${missing.join(", ")}`);
        }

        jobPayload.job_status = jobPayload.job_status ?? 0;
        jobPayload.job_posted_date =
          jobPayload.job_posted_date || Math.floor(Date.now() / 1000);
        jobPayload.job_last_updated_date = Math.floor(Date.now() / 1000);

        const job = await JobModel.create(jobPayload);

        await NotificationModel.create({
          notifyJobId: job._id,
          notifyTitle: `New Job Posted: ${job.job_title}`,
          notifyDesc: `A new job titled "${job.job_title}" has been posted.`,
        });

        results.created.push({ row: i + 2, jobId: job._id });
      } catch (err) {
        results.failed.push({ row: i + 2, error: err.message });
      }
    }

    console.log("Bulk upload results:", results);

    return {
      status: 200,
      message: "Bulk upload completed",
      summary: {
        totalRows: rows.length,
        created: results.created.length,
        failed: results.failed.length,
        details: results,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error processing CSV file",
      error: error.message,
    };
  }
};
