const Job = require("../models/JobModel");
const NotificationModel = require("../models/NotificationModel");

class JobService {
  // Create a new job
  async createJob(jobData) {
    try {
      const job = await Job.create(jobData);

      const createNofitication = await NotificationModel.create({
        notifyJobId: job._id,
        notifyTitle: `New Job Posted: ${job.job_title}`,
        notifyDesc: `A new job titled "${job.job_title}" has been posted. Check it out!`,
      });

      console.log(createNofitication);
      

      return { success: true, job };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get all jobs with filters
  async getJobs(filters = {}) {
    try {
      const query = {};

      if (filters.status !== undefined) {
        query.job_status = filters.status;
      }

      if (filters.category) {
        query.job_category = filters.category;
      }

      if (filters.sector) {
        query.job_sector = filters.sector;
      }

      const jobs = await Job.find(query).sort({ job_posted_date: -1 });
      return { success: true, jobs };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get job by ID
  async getJobById(id) {
    try {
      const job = await Job.findById(id);
      if (!job) {
        return { success: false, error: "Job not found" };
      }
      return { success: true, job };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update job
  async updateJob(id, updateData) {
    try {
      updateData.job_last_updated_date = Math.floor(Date.now() / 1000);

      const job = await Job.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!job) {
        return { success: false, error: "Job not found" };
      }

      return { success: true, job };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete job
  async deleteJob(id) {
    try {
      const job = await Job.findByIdAndDelete(id);
      if (!job) {
        return { success: false, error: "Job not found" };
      }
      return { success: true, message: "Job deleted successfully" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update job section
  async updateJobSection(jobId, section, data) {
    try {
      const job = await Job.findById(jobId);
      if (!job) {
        return { success: false, error: "Job not found" };
      }

      // Update the specific section
      Object.assign(job, data);
      job.job_last_updated_date = Math.floor(Date.now() / 1000);

      await job.save();
      return { success: true, job };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new JobService();