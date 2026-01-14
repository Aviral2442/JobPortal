const Job = require("../models/JobModel");
const Student = require("../models/StudentModel");
const JobAppliedMapper = require("../models/JobAppliedMapperModel");

class JobService {
  // Create a new job
  async createJob(jobData) {
    try {
      const job = await Job.create(jobData);
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

// APPLY ON JOB SERVICE
exports.applyOnJob = async (data) => {
  try {

    const job = await Job.findById(data.jobId);
    if (!job) {
      return { status: 404, message: 'Job not found' };
    }

    const studentId = await Student.findOne({ userId: data.userId }).select('_id');
    if (!studentId) {
      return { status: 404, message: 'Student not found' };
    }

    // Check if the student has already applied for the job
    const existingApplication = await JobAppliedMapper.findOne({
      studentId: studentId._id,
      jobId: job._id,
    });

    // Add the student to the applied_students array
    const applyApply = await JobAppliedMapper.create({
      studentId: studentId._id,
      jobId: job._id,
      applicationStatus: 'applied',
    });

    applyApply.save();

    return {
      status: 200,
      message: 'Job application successful',
      jsonData: applyApply,
    };

  } catch (error) {
    console.error('Error in applyOnJob Service:', error);
    throw error;
  }
}

module.exports = new JobService();