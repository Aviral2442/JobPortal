const { saveBase64File } = require("../middleware/base64FileUpload");
const JobModel = require("../models/JobModel");
const NotificationModel = require("../models/NotificationModel");

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
    if (jobData.files && Array.isArray(jobData.files) && jobData.files.length > 0) {
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
      }
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
    if (updateData.files && Array.isArray(updateData.files) && updateData.files.length > 0 && updateData.extensions) {
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
