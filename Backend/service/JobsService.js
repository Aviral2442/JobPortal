const { saveBase64File } = require("../middleware/base64FileUpload");
const JobModel = require("../models/JobModel");
const NotificationModel = require("../models/NotificationModel");

// add a new job
exports.addJobsService = async (jobData) => {
  try {
    if (jobData.job_logo && Array.isArray(jobData.files)) {
      // Save logo
      const logoPath = await saveBase64File(
        jobData.job_logo,
        "jobs",
        "logo",
        jobData.extension,
      );
      jobData.job_logo = logoPath;

      // Save files
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
    const job = await JobModel.findByIdAndUpdate(jobId, updateData, {
      new: true,
    });
    if (!job) {
      return {
        status: 404,
        message: "Job not found",
      };
    }

    if (updateData.job_logo && Array.isArray(updateData.files)) {
      // Save logo
      const logoPath = await saveBase64File(
        updateData.job_logo,
        "jobs",
        "logo",
        updateData.extension,
      );
      updateData.job_logo = logoPath;

      // Save files
      const filePaths = [];
      for (let i = 0; i < updateData.files.length; i++) {
        const filePath = await saveBase64File(
          updateData.files[i],
          "jobs",
          `file_${i + 1}`,
          updateData.extensions[i],
        );
        filePaths.push(filePath);
      }
      updateData.files = filePaths;
    }

    await job.save();

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
