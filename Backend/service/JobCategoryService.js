const Job = require("../models/JobModel");
const JobSector = require("../models/JobSectorModel");
const Student = require("../models/studentModel");
const JobAppliedMapper = require("../models/JobAppliedMapperModel");
const JobCategoryModel = require("../models/JobCategoryModel");
const JobSubCategoryModel = require("../models/JobSubCategoryModel");
const AdmitCardModel = require("../models/AdmitCardModel");
const AnswerKeyModel = require("../models/AnswerKeyModel");
const ResultModel = require("../models/ResultModel");
const moment = require("moment");
const { saveBase64File } = require("../middleware/base64FileUpload");
const DocumentModel = require("../models/DocumentModel");
const stateModel = require("../models/stateModel");
const cityModel = require("../models/cityModel");
const JobStudyMaterialModel = require("../models/JobStudyMaterialModel");

// Job Category List Service with Filters and Pagination
exports.getJobCategoryList = async (query) => {
  const {
    dateFilter,
    fromDate,
    toDate,
    searchFilter,
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;
  const filter = {};

  // Search Filter
  if (searchFilter) {
    filter.category_name = { $regex: searchFilter, $options: "i" };
  }

  // Date Filter
  if (dateFilter) {
    const today = moment().startOf("day");
    const now = moment().endOf("day");
    let startDate, endDate;

    switch (dateFilter) {
      case "today":
        startDate = today.unix();
        endDate = now.unix();
        break;

      case "yesterday":
        startDate = today.subtract(1, "days").unix();
        endDate = now.subtract(1, "days").unix();
        break;

      case "this_week":
        startDate = moment().startOf("week").unix();
        endDate = moment().endOf("week").unix();
        break;

      case "this_month":
        startDate = moment().startOf("month").unix();
        endDate = moment().endOf("month").unix();
        break;

      case "custom":
        if (fromDate && toDate) {
          startDate = moment(fromDate, "YYYY-MM-DD").startOf("day").unix();
          endDate = moment(toDate, "YYYY-MM-DD").endOf("day").unix();
        }
        break;
    }

    if (startDate && endDate) {
      filter.category_created_at = { $gte: startDate, $lte: endDate };
    }
  }

  // Pagination and Data Retrieval
  const total = await JobCategoryModel.countDocuments(filter);
  const data = await JobCategoryModel.find(filter)
    .populate({
      path: "category_job_sector",
      model: "JobSector",
      select: "job_sector_name",
    })
    .skip(skip)
    .limit(limit)
    .sort({ category_created_at: -1 });

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    data,
  };
};

// Job Category Service
exports.createJobCategory = async (data) => {
  try {
    const existingCheckName = await JobCategoryModel.findOne({
      category_name: data.category_name,
    });

    if (existingCheckName) {
      return { status: false, message: "Category name already exists" };
    }

    const category_slug = data.category_name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const newCategory = new JobCategoryModel({
      category_name: data.category_name,
      category_job_sector: data.category_job_sector,
      category_image: data.category_image,
      category_slug,
      category_status: data.category_status || 0,
    });

    await newCategory.save();

    return {
      status: 200,
      message: "Job category created successfully",
      jsonData: newCategory,
    };
  } catch (error) {
    console.error("Error in createJobCategory Service:", error);
    throw error;
  }
};

// GET JOB CATEGORY DATA USING SECTOR ID SERVICE
exports.getJobCategoryListUsingSectorId = async (sectorId) => {
  try {
    const categories = await JobCategoryModel.find({
      category_job_sector: sectorId,
    }).select("category_name");

    return {
      status: 200,
      message: "Job categories fetched successfully",
      jsonData: {
        categories,
      },
    };
  } catch (error) {
    console.error("Error in getJobCategoryListUsingSectorId Service:", error);
    return {
      status: 500,
      message: "Internal server error",
    };
  }
};

// Update Job Category Service
exports.updateJobCategory = async (categoryId, data) => {
  try {
    const allowedFields = [
      "category_name",
      "category_image",
      "category_slug",
      "category_status",
      "category_job_sector",
      "category_updated_at",
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });

    if (data.category_name) {
      updateData.category_slug = data.category_name
        .toLowerCase()
        .replace(/\s+/g, "-");
    }

    const updatedCategory = await JobCategoryModel.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true },
    );

    if (!updatedCategory) {
      return { status: 404, message: "Job category not found" };
    }

    return {
      updatedCategory,
    };
  } catch (error) {
    console.error("Error in updateJobCategory Service:", error);
    throw error;
  }
};

// Job SubCategory List Service with Filters and Pagination
exports.getJobSubCategoryList = async (query) => {
  const {
    dateFilter,
    fromDate,
    toDate,
    searchFilter,
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;
  const filter = {};

  // Search Filter
  if (searchFilter) {
    filter.subcategory_name = { $regex: searchFilter, $options: "i" };
  }

  // Date Filter
  if (dateFilter) {
    const today = moment().startOf("day");
    const now = moment().endOf("day");
    let startDate, endDate;

    switch (dateFilter) {
      case "today":
        startDate = today.unix();
        endDate = now.unix();
        break;

      case "yesterday":
        startDate = today.subtract(1, "days").unix();
        endDate = now.subtract(1, "days").unix();
        break;

      case "this_week":
        startDate = moment().startOf("week").unix();
        endDate = moment().endOf("week").unix();
        break;

      case "this_month":
        startDate = moment().startOf("month").unix();
        endDate = moment().endOf("month").unix();
        break;

      case "custom":
        if (fromDate && toDate) {
          startDate = moment(fromDate, "YYYY-MM-DD").startOf("day").unix();
          endDate = moment(toDate, "YYYY-MM-DD").endOf("day").unix();
        }
        break;
    }

    if (startDate && endDate) {
      filter.subcategory_created_at = { $gte: startDate, $lte: endDate };
    }
  }

  // Pagination and Data Retrieval
  const total = await JobSubCategoryModel.countDocuments(filter);
  const data = await JobSubCategoryModel.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ subcategory_created_at: -1 })
    .populate({
      path: "subcategory_category_id",
      select: "category_name",
    });

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    data,
  };
};

// Create Job Sub Category Service
exports.createJobSubCategory = async (data) => {
  try {
    const existingCheckName = await JobSubCategoryModel.findOne({
      subcategory_name: data.subcategory_name,
    });

    if (existingCheckName) {
      return { status: false, message: "Subcategory name already exists" };
    }

    const subcategory_slug = data.subcategory_name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const newSubCategory = new JobSubCategoryModel({
      subcategory_category_id: data.subcategory_category_id,
      subcategory_name: data.subcategory_name,
      subcategory_slug,
      subcategory_image: data.subcategory_image,
    });

    await newSubCategory.save();

    return {
      newSubCategory,
    };
  } catch (error) {
    console.error("Error in createJobSubCategory Service:", error);
    throw error;
  }
};

// Update Job Sub Category Service
exports.updateJobSubCategory = async (subcategoryId, data) => {
  try {
    const allowedFields = [
      "subcategory_category_id",
      "subcategory_name",
      "subcategory_image",
      "subcategory_slug",
      "subcategory_status",
      "subcategory_updated_at",
    ];

    const updateData = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    if (data.subcategory_name) {
      updateData.subcategory_slug = data.subcategory_name
        .toLowerCase()
        .replace(/\s+/g, "-");
    }

    const result = await JobSubCategoryModel.findByIdAndUpdate(
      subcategoryId,
      updateData,
      { new: true },
    );
    if (!result) {
      return { status: 404, message: "Subcategory not found" };
    }

    return {
      result,
    };
  } catch (error) {
    console.error("Error in updateJobSubCategory Service:", error);
    throw error;
  }
};

// GET JOB SUBCATEGORY DATA USING CATEGORY ID SERVICE
exports.getSubCategoryListUsingCategoryId = async (categoryId) => {
  try {
    const subcategories = await JobSubCategoryModel.find({
      subcategory_category_id: categoryId,
    }).select("subcategory_name");

    return {
      status: 200,
      message: "Job subcategories fetched successfully",
      jsonData: {
        subcategories,
      },
    };
  } catch (error) {
    console.error("Error in getSubCategoryListUsingCategoryId Service:", error);
    return {
      status: 500,
      message: "Internal server error",
    };
  }
};

// APPLY ON JOB SERVICE
exports.applyOnJob = async (data) => {
  try {
    const { jobId, studentId } = data;

    // 1. Check Job
    const job = await Job.findById(jobId);
    if (!job) {
      return { status: 404, message: "Job not found" };
    }

    // 2. Check Student
    const student = await Student.findById(studentId);
    if (!student) {
      return { status: 404, message: "Student not found" };
    }

    // 3. Check if already applied
    const existingApplication = await JobAppliedMapper.findOne({
      studentId: student._id,
      jobId: job._id,
    });

    if (existingApplication) {
      return {
        status: 409,
        message: "You have already applied for this job",
      };
    }

    // 4. Create application
    const application = await JobAppliedMapper.create({
      studentId: student._id,
      jobId: job._id,
      applicationStatus: "applied",
    });

    return {
      status: 200,
      message: "Job application successful",
      jsonData: {
        applicationId: application._id,
      },
    };
  } catch (error) {
    console.error("Apply Job Service Error:", error);
    return {
      status: 500,
      message: "Server error",
    };
  }
};

// FETCH STUDENT APPLIED JOBS SERVICE
exports.studentAppliedJobsOn = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return { status: 404, message: "Student not found" };
    }

    const appliedJobs = await JobAppliedMapper.find({ studentId })
      .populate({
        path: "jobId",
        model: "Jobs",
        select:
          "job_title job_short_desc job_posted_date job_category job_sector job_type job_vacancy_total",
        populate: {
          path: ["job_category", "job_sector", "job_type"],
          model: ["JobCategory", "JobSector", "JobType"],
          select: ["category_name", "job_sector_name", "job_type_name"],
        },
      })
      .exec();

    const appliedJobsCount = appliedJobs.length;
    return {
      status: 200,
      message: "Applied jobs fetched successfully",
      jsonData: {
        appliedJobslist: appliedJobs,
        appliedJobsCount: appliedJobsCount,
      },
    };
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return {
      status: 500,
      message: "Server error",
    };
  }
};

// JOB APPLIED LIST OF STUDENTS SERVICE
exports.jobAppliedListOfStudents = async (query) => {
  const {
    dateFilter,
    fromDate,
    toDate,
    searchFilter,
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;
  const filter = {};

  // Search Filter
  if (searchFilter) {
    filter.$or = [
      { "studentId.first_name": { $regex: searchFilter, $options: "i" } },
      { "jobId.job_title": { $regex: searchFilter, $options: "i" } },
    ];
  }

  // Date Filter
  if (dateFilter) {
    const today = moment().startOf("day");
    const now = moment().endOf("day");
    let startDate, endDate;

    switch (dateFilter) {
      case "today":
        startDate = today.unix();
        endDate = now.unix();
        break;

      case "yesterday":
        startDate = today.subtract(1, "days").unix();
        endDate = now.subtract(1, "days").unix();
        break;

      case "this_week":
        startDate = moment().startOf("week").unix();
        endDate = moment().endOf("week").unix();
        break;

      case "this_month":
        startDate = moment().startOf("month").unix();
        endDate = moment().endOf("month").unix();
        break;

      case "custom":
        if (fromDate && toDate) {
          startDate = moment(fromDate, "YYYY-MM-DD").startOf("day").unix();
          endDate = moment(toDate, "YYYY-MM-DD").endOf("day").unix();
        }
        break;
    }

    if (startDate && endDate) {
      filter.appliedAt = { $gte: startDate, $lte: endDate };
    }
  }

  // Pagination and Data Retrieval
  const total = await JobAppliedMapper.countDocuments(filter);
  const data = await JobAppliedMapper.find(filter)
    .populate({
      path: "studentId",
      model: "student",
      select: "studentFirstName studentLastName studentEmail",
    })
    .populate({
      path: "jobId",
      model: "Jobs",
      select: "job_title job_category job_sector job_type",
    })
    .populate({
      path: "studentId",
      select: "studentFirstName studentLastName studentEmail",
    })
    .populate({
      path: "jobId",
      select: "job_title job_category job_sector job_type",
      populate: [
        { path: "job_category", model: "JobCategory", select: "category_name" },
        { path: "job_sector", model: "JobSector", select: "job_sector_name" },
      ],
    })
    .skip(skip)
    .limit(limit)
    .sort({ appliedAt: -1 });

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    data,
  };
};

// UPCOMMING JOBS FOR STUDENTS SERVICE
exports.upcommingJobForStudents = async (studentId) => {
  try {
    const student = await Student.findById(studentId)
      .select("studentJobSector")
      .lean();

    if (!student) {
      return { status: 404, message: "Student not found" };
    }

    const studentSector = student.studentJobSector;

    // ⚠️ Prefer ENV constant instead of DB call (explained below)
    const notSpecifiedSector = await JobSector.findOne({
      job_sector_name: "Not Specified",
    })
      .select("_id")
      .lean();

    const notSpecifiedId = notSpecifiedSector?._id?.toString();

    const sevenDaysFromNow = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

    let filter = {
      job_start_date: { $gte: sevenDaysFromNow },
    };

    // ✅ Check if sector is valid
    const hasValidSector =
      studentSector &&
      (
        Array.isArray(studentSector)
          ? studentSector.length > 0 &&
          !studentSector.map(id => id.toString()).includes(notSpecifiedId)
          : studentSector.toString() !== notSpecifiedId
      );

    // Apply sector filter ONLY when valid
    if (hasValidSector) {
      filter.job_sector = Array.isArray(studentSector)
        ? { $in: studentSector }
        : studentSector;
    }

    const upcommingJobSectorWise = await Job.find(filter)
      .select(
        "job_title job_logo job_short_desc job_category job_sector job_type job_vacancy_total job_start_date"
      )
      .populate("job_category", "category_name")
      .populate("job_sector", "job_sector_name")
      .populate("job_type", "job_type_name")
      .limit(5)
      .sort({ job_start_date: 1 })
      .lean();

    const formattedJobs = upcommingJobSectorWise.map(job => ({
      ...job,
      job_logo: job.job_logo || ""
    }));

    return {
      status: 200,
      message: "Upcomming jobs fetched successfully",
      jsonData: {
        upcommingJobSectorWiseCount: upcommingJobSectorWise.length,
        upcommingJobSectorWise: formattedJobs,
      },
    };
  } catch (error) {
    console.error("Error in upcommingJobForStudents:", error);

    return {
      status: 500,
      message: "Server error",
    };
  }
};

// UPDATE JOB STATUS SERVICE
exports.updateJobStatus = async (jobId, updateColumnName, updateValue) => {
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return { status: 404, message: "Job not found" };
    }

    const validColumns = ["job_status", "jobRecommendation", "jobFeatured"];
    if (!validColumns.includes(updateColumnName)) {
      return { status: 400, message: "Invalid column name for update" };
    }

    const updateJobStatus = await Job.findByIdAndUpdate(
      jobId,
      {
        [updateColumnName]: updateValue,
      },
      { new: true },
    );

    return {
      status: 200,
      message: "Job status updated successfully",
    };
  } catch (error) {
    console.error("Error in updateJobStatus Service:", error);
    return {
      status: 500,
      message: "Server error",
    };
  }
};

// RECOMMEND JOBS FOR STUDENT SERVICE
exports.recommendJobsForStudent = async (studentId) => {
  try {
    const student = await Student.findById(studentId)
      .select("studentJobSector")
      .lean(); // faster

    if (!student) {
      return { status: 404, message: "Student not found", jsonData: {} };
    }

    const studentSector = student.studentJobSector;

    const notSpecifiedSector = await JobSector.findOne({
      job_sector_name: "Not Specified",
    })
      .select("_id")
      .lean();

    let filter = {
      jobRecommendation: true,
    };

    const notSpecifiedId = notSpecifiedSector?._id?.toString();

    const hasValidSector =
      studentSector &&
      (
        Array.isArray(studentSector)
          ? studentSector.length > 0 &&
          !studentSector.map(id => id.toString()).includes(notSpecifiedId)
          : studentSector.toString() !== notSpecifiedId
      );

    // Apply sector filter ONLY when valid
    if (hasValidSector) {
      filter.job_sector = Array.isArray(studentSector)
        ? { $in: studentSector }
        : studentSector;
    }

    const recommendedJobs = await Job.find(filter)
      .select(
        "job_title job_logo job_short_desc job_start_date job_category job_sector job_type job_vacancy_total"
      )
      .populate("job_category", "category_name")
      .populate("job_sector", "job_sector_name")
      .populate("job_type", "job_type_name")
      .limit(5)
      .sort({ job_posted_date: -1 })
      .lean(); // faster

    const formattedJobs = recommendedJobs.map(job => ({
      ...job,
      job_logo: job.job_logo || ""
    }));

    return {
      status: 200,
      message: "Recommended jobs fetched successfully",
      jsonData: {
        recommendedJobsCount: recommendedJobs.length,
        recommendedJobs: formattedJobs,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: "Server error" + error.message,
      jsonData: {},
    };
  }
};

// FEATURED JOBS FOR STUDENT SERVICE
exports.featuredJobsForStudent = async (studentId) => {
  try {
    const student = await Student.findById(studentId)
      .select("studentJobSector");

    if (!student) {
      return { status: 404, message: "Student not found", jsonData: {} };
    }

    const studentSector = student.studentJobSector;

    // Find "Not Specified" sector id
    const notSpecifiedSector = await JobSector.findOne({
      job_sector_name: "Not Specified",
    }).select("_id");

    let filter = { jobFeatured: true };

    // Apply sector filter ONLY if sector is valid
    if (
      studentSector &&
      (!Array.isArray(studentSector) ||
        studentSector.length > 0) &&
      (!notSpecifiedSector ||
        (Array.isArray(studentSector)
          ? !studentSector.includes(notSpecifiedSector._id)
          : !studentSector.equals(notSpecifiedSector._id)))
    ) {
      filter.job_sector = Array.isArray(studentSector)
        ? { $in: studentSector }
        : studentSector;
    }

    const featuredJobs = await Job.find(filter)
      .select(
        "job_title job_logo job_short_desc job_start_date job_category job_sector job_type job_vacancy_total"
      )
      .populate("job_category", "category_name")
      .populate("job_sector", "job_sector_name")
      .populate("job_type", "job_type_name")
      .limit(5)
      .sort({ job_posted_date: -1 })
      .lean();

    const formattedJobs = featuredJobs.map(job => ({
      ...job,
      job_logo: job.job_logo || ""
    }));


    return {
      status: 200,
      message: "Featured jobs fetched successfully",
      jsonData: {
        featuredJobsCount: featuredJobs.length,
        featuredJobs: formattedJobs,
      },
    };
  } catch (error) {
    console.error("Error in featuredJobsForStudent Service:", error);
    return {
      status: 500,
      message: "Server error",
    };
  }
};

// JOB LIST SECTOR WISE SERVICE
exports.jobListSectorWise = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return { status: 404, message: "Student not found" };
    }

    const studentSector = student.studentJobSector;

    const fetchJobSectorWise = await Job.find({ job_sector: studentSector })
      .select(
        "job_title job_logo job_short_desc job_category job_sector job_type job_vacancy_total job_start_date",
      )
      .populate({
        path: "job_category",
        model: "JobCategory",
        select: "category_name",
      })
      .populate({
        path: "job_sector",
        model: "JobSector",
        select: "job_sector_name",
      })
      .populate({
        path: "job_type",
        model: "JobType",
        select: "job_type_name",
      }).lean();

    const formattedJobs = fetchJobSectorWise.map(job => ({
      ...job,
      job_logo: job.job_logo || ""
    }));

    return {
      status: 200,
      message: "Jobs fetched successfully",
      jsonData: formattedJobs
    };
  } catch (error) {
    console.error("Error in jobListSectorWise Service:", error);
    return {
      status: 500,
      message: "Server error",
    };
  }
};

// PRIVATE SECTOR JOB LIST SERVICE WITH FILTERS AND PAGINATION
exports.privateSectorJobList = async (query) => {
  const {
    dateFilter,
    fromDate,
    toDate,
    searchFilter,
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;

  const privateSector = await JobSector.findOne({
    job_sector_name: { $regex: /^private/i }, // matches "Private Sector"
  }).select("_id");

  if (!privateSector) {
    return {
      total: 0,
      page: Number(page),
      limit: Number(limit),
      totalPages: 0,
      data: [],
    };
  }

  const filter = {
    job_sector: privateSector._id,
  };

  // Search Filter
  if (searchFilter) {
    filter.job_title = { $regex: searchFilter, $options: "i" };
  }

  // Date Filter
  if (dateFilter) {
    const today = moment().startOf("day");
    const now = moment().endOf("day");
    let startDate, endDate;

    switch (dateFilter) {
      case "today":
        startDate = today.unix();
        endDate = now.unix();
        break;

      case "yesterday":
        startDate = today.subtract(1, "days").unix();
        endDate = now.subtract(1, "days").unix();
        break;

      case "this_week":
        startDate = moment().startOf("week").unix();
        endDate = moment().endOf("week").unix();
        break;

      case "this_month":
        startDate = moment().startOf("month").unix();
        endDate = moment().endOf("month").unix();
        break;

      case "custom":
        if (fromDate && toDate) {
          startDate = moment(fromDate, "YYYY-MM-DD").startOf("day").unix();
          endDate = moment(toDate, "YYYY-MM-DD").endOf("day").unix();
        }
        break;
    }

    if (startDate && endDate) {
      filter.job_posted_date = { $gte: startDate, $lte: endDate };
    }
  }

  // Pagination and Data Retrieval
  const total = await Job.countDocuments(filter);
  const data = await Job.find(filter)
    .populate({
      path: ["job_sector", "job_category"],
      model: ["JobSector", "JobCategory"],
      select: ["job_sector_name", "category_name"],
    })
    .skip(skip)
    .limit(limit)
    .sort({ job_posted_date: -1 });

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    primateJobs: data,
  };
};

// GOVERNMENT SECTOR JOB LIST SERVICE WITH FILTERS AND PAGINATION
exports.governmentSectorJobList = async (query) => {
  const {
    dateFilter,
    fromDate,
    toDate,
    searchFilter,
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;

  const governmentSector = await JobSector.findOne({
    job_sector_name: { $regex: /^government/i }, // matches "Government Sector"
  }).select("_id");

  if (!governmentSector) {
    return {
      total: 0,
      page: Number(page),
      limit: Number(limit),
      totalPages: 0,
      data: [],
    };
  }

  const filter = {
    job_sector: governmentSector._id,
  };

  // Search Filter
  if (searchFilter) {
    filter.job_title = { $regex: searchFilter, $options: "i" };
  }

  // Date Filter
  if (dateFilter) {
    const today = moment().startOf("day");
    const now = moment().endOf("day");
    let startDate, endDate;

    switch (dateFilter) {
      case "today":
        startDate = today.unix();
        endDate = now.unix();
        break;

      case "yesterday":
        startDate = today.subtract(1, "days").unix();
        endDate = now.subtract(1, "days").unix();
        break;

      case "this_week":
        startDate = moment().startOf("week").unix();
        endDate = moment().endOf("week").unix();
        break;

      case "this_month":
        startDate = moment().startOf("month").unix();
        endDate = moment().endOf("month").unix();
        break;

      case "custom":
        if (fromDate && toDate) {
          startDate = moment(fromDate, "YYYY-MM-DD").startOf("day").unix();
          endDate = moment(toDate, "YYYY-MM-DD").endOf("day").unix();
        }
        break;
    }

    if (startDate && endDate) {
      filter.job_posted_date = { $gte: startDate, $lte: endDate };
    }
  }

  // Pagination and Data Retrieval
  const total = await Job.countDocuments(filter);
  const data = await Job.find(filter)
    .populate({
      path: ["job_sector", "job_category"],
      model: ["JobSector", "JobCategory"],
      select: ["job_sector_name", "category_name"],
    })
    .skip(skip)
    .limit(limit)
    .sort({ job_posted_date: -1 });

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    governmentJobs: data,
  };
};

// PSU SECTOR JOB LIST SERVICE WITH FILTERS AND PAGINATION
exports.psuSectorJobList = async (query) => {
  const {
    dateFilter,
    fromDate,
    toDate,
    searchFilter,
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;

  const psuSector = await JobSector.findOne({
    job_sector_name: { $regex: /^psu/i }, // matches "PSU Sector"
  }).select("_id");

  if (!psuSector) {
    return {
      total: 0,
      page: Number(page),
      limit: Number(limit),
      totalPages: 0,
      data: [],
    };
  }

  const filter = {
    job_sector: psuSector._id,
  };

  // Search Filter
  if (searchFilter) {
    filter.job_title = { $regex: searchFilter, $options: "i" };
  }

  // Date Filter
  if (dateFilter) {
    const today = moment().startOf("day");
    const now = moment().endOf("day");
    let startDate, endDate;

    switch (dateFilter) {
      case "today":
        startDate = today.unix();
        endDate = now.unix();
        break;

      case "yesterday":
        startDate = today.subtract(1, "days").unix();
        endDate = now.subtract(1, "days").unix();
        break;

      case "this_week":
        startDate = moment().startOf("week").unix();
        endDate = moment().endOf("week").unix();
        break;

      case "this_month":
        startDate = moment().startOf("month").unix();
        endDate = moment().endOf("month").unix();
        break;

      case "custom":
        if (fromDate && toDate) {
          startDate = moment(fromDate, "YYYY-MM-DD").startOf("day").unix();
          endDate = moment(toDate, "YYYY-MM-DD").endOf("day").unix();
        }
        break;
    }

    if (startDate && endDate) {
      filter.job_posted_date = { $gte: startDate, $lte: endDate };
    }
  }

  // Pagination and Data Retrieval
  const total = await Job.countDocuments(filter);
  const data = await Job.find(filter)
    .populate({
      path: ["job_sector", "job_category"],
      model: ["JobSector", "JobCategory"],
      select: ["job_sector_name", "category_name"],
    })
    .skip(skip)
    .limit(limit)
    .sort({ job_posted_date: -1 });

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    psuJobs: data,
  };
};

// GOVERNMENT AND PSU SECTOR JOB LIST
exports.governmentAndPsuSectorJobList = async (query) => {
  try {
    const governmentSector = await JobSector.findOne({
      job_sector_name: { $regex: /^government/i },
    }).select("_id");

    const psuSector = await JobSector.findOne({
      job_sector_name: { $regex: /^psu/i },
    }).select("_id");

    if (!governmentSector || !psuSector) {
      return {
        total: 0,
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        totalPages: 0,
        data: [],
      };
    }

    const allowedSectors = [governmentSector._id, psuSector._id];

    const data = await Job.find({
      job_sector: { $in: allowedSectors },
    }).select("job_title job_short_desc job_posted_date");

    return {
      status: 200,
      message: "Jobs fetched successfully",
      jsonData: {
        govAndPsuJobList: data,
      },
    };
  } catch (error) {
    console.error("Error in governmentAndPsuSectorJobList Service:", error);
    return {
      status: 500,
      message: "Server error",
      jsonData: [],
    };
  }
};

// JOB FULL DETAILS BY ID SERVICE
exports.jobFullDetailsById = async (jobId) => {
  try {
    const job = await Job.findById(jobId)
      .populate("job_type", "job_type_name")
      .populate("job_sector", "job_sector_name")
      .populate("job_category", "category_name");

    if (!job) {
      return { status: 404, message: "Job not found", jsonData: {} };
    }

    const admitCardData = await AdmitCardModel.findOne({
      admitCard_JobId: jobId,
    });

    const answerKeyData = await AnswerKeyModel.findOne({
      answerKey_JobId: jobId,
    });

    const resultData = await ResultModel.findOne({ result_JobId: jobId });

    const jobStudyMaterialData = await JobStudyMaterialModel.findOne({
      studyMaterial_jobId: jobId,
    });

    return {
      status: 200,
      message: "Job details fetched successfully",
      jsonData: {
        job_main_details: job,
        admit_card_details: admitCardData || null,
        answer_key_details: answerKeyData || null,
        result_details: resultData || null,
        job_study_material_details: jobStudyMaterialData || null,
      },
    };
  } catch (error) {
    console.error("Error in jobFullDetailsById Service:", error);
    return {
      status: 500,
      message: "Server error",
      jsonData: {},
    };
  }
};

// GET ADMIT CARD LIST BY STUDENT ID SERVICE
exports.getAdmitCardListByStudentId = async (studentId) => {
  try {
    const student =
      await Student.findById(studentId).select("studentJobSector");

    if (!student) {
      return { status: 404, message: "Student not found", jsonData: {} };
    }

    const studentSector = student.studentJobSector;

    if (!studentSector) {
      return {
        status: 200,
        message: "No job sector assigned to student",
        jsonData: {
          admitCardCount: 0,
          admitCards: [],
        },
      };
    }

    // Fetch admit cards related to the student's job sector
    const admitCards = await AdmitCardModel.find()
      .select(
        "admitCard_JobId admitCard_Title admitCard_Desc admitCard_URL admitCard_FilePath admitCard_ReleaseDate admitCard_CreatedAt",
      )
      .populate({
        path: "admitCard_JobId",
        model: "Jobs",
        match: { job_sector: studentSector },
        select: "job_title job_category job_type job_sector",
        populate: [
          { path: "job_category", select: "category_name" },
          { path: "job_type", select: "job_type_name" },
          { path: "job_sector", select: "job_sector_name" },
        ],
      })
      .sort({ admitCard_CreatedAt: -1 });

    // Filter out admit cards where job sector doesn't match
    const filteredAdmitCards = admitCards.filter(
      (card) => card.admitCard_JobId !== null,
    );

    return {
      status: 200,
      message: "Admit card list fetched successfully",
      jsonData: {
        admitCardCount: filteredAdmitCards.length,
        admitCards: filteredAdmitCards,
      },
    };
  } catch (error) {
    console.error("Error in getAdmitCardListByStudentId Service:", error);
    return {
      status: 500,
      message: "Server error",
      jsonData: {},
    };
  }
};

// GET ANSWER KEY LIST BY STUDENT ID SERVICE
exports.getAnswerKeyListByStudentId = async (studentId) => {
  try {
    const student =
      await Student.findById(studentId).select("studentJobSector");

    if (!student) {
      return { status: 404, message: "Student not found", jsonData: {} };
    }

    const studentSector = student.studentJobSector;

    if (!studentSector) {
      return {
        status: 200,
        message: "No job sector assigned to student",
        jsonData: {
          admitCardCount: 0,
          admitCards: [],
        },
      };
    }

    // Fetch admit cards related to the student's job sector
    const admitCards = await AnswerKeyModel.find()
      .select(
        "admitCard_JobId admitCard_Title admitCard_Desc admitCard_URL admitCard_FilePath admitCard_ReleaseDate admitCard_CreatedAt",
      )
      .populate({
        path: "admitCard_JobId",
        model: "Jobs",
        match: { job_sector: studentSector },
        select: "job_title job_category job_type job_sector",
        populate: [
          { path: "job_category", select: "category_name" },
          { path: "job_type", select: "job_type_name" },
          { path: "job_sector", select: "job_sector_name" },
        ],
      })
      .sort({ admitCard_CreatedAt: -1 });

    // Filter out admit cards where job sector doesn't match
    const filteredAdmitCards = admitCards.filter(
      (card) => card.admitCard_JobId !== null,
    );

    return {
      status: 200,
      message: "Admit card list fetched successfully",
      jsonData: {
        admitCardCount: filteredAdmitCards.length,
        admitCards: filteredAdmitCards,
      },
    };
  } catch (error) {
    console.error("Error in getAdmitCardListByStudentId Service:", error);
    return {
      status: 500,
      message: "Server error",
      jsonData: {},
    };
  }
};

// GOV ADMIN JOB CATEGORY CARD LIST SERVICE WITH FILTERS AND PAGINATION
exports.govAdminCardList = async (query) => {
  const {
    dateFilter,
    fromDate,
    toDate,
    searchFilter,
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;
  const filter = {};

  // 🔍 Search
  if (searchFilter) {
    filter.admitCard_Title = { $regex: searchFilter, $options: "i" };
  }

  // 📅 Date filter
  if (dateFilter) {
    const today = moment().startOf("day");
    const now = moment().endOf("day");
    let startDate, endDate;

    switch (dateFilter) {
      case "today":
        startDate = today.unix();
        endDate = now.unix();
        break;

      case "yesterday":
        startDate = today.clone().subtract(1, "days").unix();
        endDate = now.clone().subtract(1, "days").unix();
        break;

      case "this_week":
        startDate = moment().startOf("week").unix();
        endDate = moment().endOf("week").unix();
        break;

      case "this_month":
        startDate = moment().startOf("month").unix();
        endDate = moment().endOf("month").unix();
        break;

      case "custom":
        if (fromDate && toDate) {
          startDate = moment(fromDate).startOf("day").unix();
          endDate = moment(toDate).endOf("day").unix();
        }
        break;
    }

    if (startDate && endDate) {
      filter.admitCard_CreatedAt = { $gte: startDate, $lte: endDate };
    }
  }

  // ✅ Get Government sector ID
  const governmentSector = await JobSector.findOne({
    job_sector_name: { $regex: /^government/i },
  }).select("_id");

  if (!governmentSector) {
    return {
      total: 0,
      page,
      limit,
      totalPages: 0,
      admitCardData: [],
    };
  }

  // ✅ Main query
  const admitCardData = await AdmitCardModel.find(filter)
    .select(
      "admitCard_JobId admitCard_Title admitCard_Desc admitCard_URL admitCard_FilePath admitCard_ReleaseDate admitCard_CreatedAt",
    )
    .populate({
      path: "admitCard_JobId",
      model: "Jobs",
      match: { job_sector: governmentSector._id }, // ⭐ IMPORTANT
      select: "job_title job_category job_type job_sector",
      populate: [
        { path: "job_category", select: "category_name" },
        { path: "job_type", select: "job_type_name" },
        { path: "job_sector", select: "job_sector_name" },
      ],
    })
    .sort({ admitCard_CreatedAt: -1 })
    .skip(skip)
    .limit(limit);

  // 🚿 Remove non-government jobs
  const filteredData = admitCardData.filter(
    (item) => item.admitCard_JobId !== null,
  );

  const total = filteredData.length;

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    admitCardData: filteredData,
  };
};

// ADD ADMIT CARD SERVICE
exports.addAdmitCard = async (data) => {
  try {
    const newAdmitCard = new AdmitCardModel({
      admitCard_JobId: data.admitCard_JobId,
      admitCard_Title: data.admitCard_Title,
      admitCard_Desc: data.admitCard_Desc,
      admitCard_URL: data.admitCard_URL,
      admitCard_FilePath: "",
      admitCard_ReleaseDate: data.admitCard_ReleaseDate,
    });

    let admitCard_FilePath = null;
    if (data.admitCard_FilePath) {
      admitCard_FilePath = saveBase64File(
        data.admitCard_FilePath,
        "admitCard",
        "job",
        data.extension,
      );
    }

    newAdmitCard.admitCard_FilePath = admitCard_FilePath;

    await newAdmitCard.save();

    return {
      status: 200,
      message: "Admit card added successfully",
      jsonData: newAdmitCard,
    };
  } catch (error) {
    console.error("Error in addAdmitCard Service:", error);
    throw error;
  }
};

// GET ADMIT CARD DETAILS BY ID SERVICE
exports.getAdmitCardListById = async (admitCardId) => {
  try {
    const admitCardDetails = await AdmitCardModel.findById(admitCardId);

    if (!admitCardDetails) {
      return {
        status: 404,
        message: "Admit card not found",
        jsonData: {},
      };
    }

    return {
      status: 200,
      message: "Admit card details fetched successfully",
      jsonData: admitCardDetails,
    };
  } catch (error) {
    console.error("Error in getAdmitCardListById Service:", error);
    return {
      status: 500,
      message: "Server error",
      jsonData: {},
    };
  }
};

// UPDATE ADMIT CARD SERVICE
exports.updateAdmitCard = async (admitCardId, data) => {
  try {
    const fetchAdmitCard = await AdmitCardModel.findById(admitCardId);
    if (!fetchAdmitCard) {
      return {
        status: 404,
        message: "Admit card not found",
        jsonData: {},
      };
    }

    console.log(data);
    let admitCard_FilePath = fetchAdmitCard.admitCard_FilePath;
    if (
      data.admitCard_FilePath &&
      data.admitCard_FilePath !== admitCard_FilePath
    ) {
      admitCard_FilePath = saveBase64File(
        data.admitCard_FilePath,
        "admitCard",
        "job",
        data.extension,
      );
    }

    const updateData = {
      admitCard_JobId: data.admitCard_JobId || fetchAdmitCard.admitCard_JobId,
      admitCard_Title: data.admitCard_Title || fetchAdmitCard.admitCard_Title,
      admitCard_Desc: data.admitCard_Desc || fetchAdmitCard.admitCard_Desc,
      admitCard_URL: data.admitCard_URL || fetchAdmitCard.admitCard_URL,
      admitCard_FilePath: admitCard_FilePath,
      admitCard_ReleaseDate:
        data.admitCard_ReleaseDate || fetchAdmitCard.admitCard_ReleaseDate,
    };

    const updatedAdmitCard = await AdmitCardModel.findByIdAndUpdate(
      admitCardId,
      updateData,
      { new: true },
    );

    return {
      status: 200,
      message: "Admit card updated successfully",
      jsonData: updatedAdmitCard,
    };
  } catch (error) {
    console.error("Error in updateAdmitCard Service:", error);
    throw error;
  }
};

// PSU ADMIN JOB CATEGORY CARD LIST SERVICE WITH FILTERS AND PAGINATION
exports.psuAdminCardList = async (query) => {
  const {
    dateFilter,
    fromDate,
    toDate,
    searchFilter,
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;
  const filter = {};

  // 🔍 Search filter
  if (searchFilter) {
    filter.$or = [{ admitCard_Title: { $regex: searchFilter, $options: "i" } }];
  }

  // 📅 Date filter
  if (dateFilter) {
    const today = moment().startOf("day");
    const now = moment().endOf("day");
    let startDate, endDate;

    switch (dateFilter) {
      case "today":
        startDate = today.unix();
        endDate = now.unix();
        break;

      case "yesterday":
        startDate = today.clone().subtract(1, "days").unix();
        endDate = now.clone().subtract(1, "days").unix();
        break;

      case "this_week":
        startDate = moment().startOf("week").unix();
        endDate = moment().endOf("week").unix();
        break;

      case "this_month":
        startDate = moment().startOf("month").unix();
        endDate = moment().endOf("month").unix();
        break;

      case "custom":
        if (fromDate && toDate) {
          startDate = moment(fromDate).startOf("day").unix();
          endDate = moment(toDate).endOf("day").unix();
        }
        break;
    }

    if (startDate && endDate) {
      filter.admitCard_CreatedAt = { $gte: startDate, $lte: endDate };
    }
  }

  // ✅ Get PSU sector ID
  const psuSector = await JobSector.findOne({
    job_sector_name: { $regex: /^psu/i },
  }).select("_id");

  if (!psuSector) {
    return {
      total: 0,
      page,
      limit,
      totalPages: 0,
      psuAdmitCardData: [],
    };
  }

  // ✅ Main Query
  const admitCardData = await AdmitCardModel.find(filter)
    .select(
      "admitCard_JobId admitCard_Title admitCard_Desc admitCard_URL admitCard_FilePath admitCard_ReleaseDate admitCard_CreatedAt",
    )
    .populate({
      path: "admitCard_JobId",
      model: "Jobs",
      match: { job_sector: psuSector._id }, // ⭐ KEY FIX
      select: "job_title job_category job_type job_sector",
      populate: [
        { path: "job_category", select: "category_name" },
        { path: "job_type", select: "job_type_name" },
        { path: "job_sector", select: "job_sector_name" },
      ],
    })
    .skip(skip)
    .limit(limit)
    .sort({ admitCard_CreatedAt: -1 });

  // ⚠️ Remove null populated jobs
  const filteredData = admitCardData.filter(
    (item) => item.admitCard_JobId !== null,
  );

  const total = filteredData.length;

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    psuAdmitCardData: filteredData,
  };
};

// GET GOV ANSWER KEY LIST SERVICE WITH FILTERS AND PAGINATION
exports.govAnswerKeyList = async (query) => {
  const {
    dateFilter,
    fromDate,
    toDate,
    searchFilter,
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;
  const filter = {};

  // 🔍 Search
  if (searchFilter) {
    filter.answerKey_Title = { $regex: searchFilter, $options: "i" };
  }

  // 📅 Date filter
  if (dateFilter) {
    const today = moment().startOf("day");
    const now = moment().endOf("day");
    let startDate, endDate;

    switch (dateFilter) {
      case "today":
        startDate = today.unix();
        endDate = now.unix();
        break;

      case "yesterday":
        startDate = today.clone().subtract(1, "days").unix();
        endDate = now.clone().subtract(1, "days").unix();
        break;

      case "this_week":
        startDate = moment().startOf("week").unix();
        endDate = moment().endOf("week").unix();
        break;

      case "this_month":
        startDate = moment().startOf("month").unix();
        endDate = moment().endOf("month").unix();
        break;

      case "custom":
        if (fromDate && toDate) {
          startDate = moment(fromDate).startOf("day").unix();
          endDate = moment(toDate).endOf("day").unix();
        }
        break;
    }

    if (startDate && endDate) {
      filter.answerKey_CreatedAt = { $gte: startDate, $lte: endDate };
    }
  }

  // ✅ Get Government sector ID
  const governmentSector = await JobSector.findOne({
    job_sector_name: { $regex: /^government/i },
  }).select("_id");

  if (!governmentSector) {
    return {
      total: 0,
      page,
      limit,
      totalPages: 0,
      answerKeyData: [],
    };
  }

  // ✅ Main query
  const answerKeyData = await AnswerKeyModel.find(filter)
    .select(
      "answerKey_JobId answerKey_Title answerKey_Desc answerKey_URL answerKey_FilePath answerKey_ReleaseDate answerKey_CreatedAt",
    )
    .populate({
      path: "answerKey_JobId",
      model: "Jobs",
      match: { job_sector: governmentSector._id }, // ⭐ IMPORTANT
      select: "job_title job_category job_type job_sector",
      populate: [
        { path: "job_category", select: "category_name" },
        { path: "job_type", select: "job_type_name" },
        { path: "job_sector", select: "job_sector_name" },
      ],
    })
    .sort({ answerKey_CreatedAt: -1 })
    .skip(skip)
    .limit(limit);

  // 🚿 Remove non-government jobs
  const filteredData = answerKeyData.filter(
    (item) => item.answerKey_JobId !== null,
  );

  const total = filteredData.length;

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    answerKeyData: filteredData,
  };
};

// GET PSU ANSWER KEY LIST SERVICE WITH FILTERS AND PAGINATION
exports.psuAnswerKeyList = async (query) => {
  const {
    dateFilter,
    fromDate,
    toDate,
    searchFilter,
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;
  const filter = {};

  // 🔍 Search
  if (searchFilter) {
    filter.answerKey_Title = { $regex: searchFilter, $options: "i" };
  }

  // 📅 Date filter
  if (dateFilter) {
    const today = moment().startOf("day");
    const now = moment().endOf("day");
    let startDate, endDate;

    switch (dateFilter) {
      case "today":
        startDate = today.unix();
        endDate = now.unix();
        break;

      case "yesterday":
        startDate = today.clone().subtract(1, "days").unix();
        endDate = now.clone().subtract(1, "days").unix();
        break;

      case "this_week":
        startDate = moment().startOf("week").unix();
        endDate = moment().endOf("week").unix();
        break;

      case "this_month":
        startDate = moment().startOf("month").unix();
        endDate = moment().endOf("month").unix();
        break;

      case "custom":
        if (fromDate && toDate) {
          startDate = moment(fromDate).startOf("day").unix();
          endDate = moment(toDate).endOf("day").unix();
        }
        break;
    }

    if (startDate && endDate) {
      filter.answerKey_CreatedAt = { $gte: startDate, $lte: endDate };
    }
  }

  // ✅ Get PSU sector ID
  const psuSector = await JobSector.findOne({
    job_sector_name: { $regex: /^psu/i },
  }).select("_id");

  if (!psuSector) {
    return {
      total: 0,
      page,
      limit,
      totalPages: 0,
      answerKeyData: [],
    };
  }

  // ✅ Main query
  const answerKeyData = await AnswerKeyModel.find(filter)
    .select(
      "answerKey_JobId answerKey_Title answerKey_Desc answerKey_URL answerKey_FilePath answerKey_ReleaseDate answerKey_CreatedAt",
    )
    .populate({
      path: "answerKey_JobId",
      model: "Jobs",
      match: { job_sector: psuSector._id }, // ⭐ IMPORTANT
      select: "job_title job_category job_type job_sector",
      populate: [
        { path: "job_category", select: "category_name" },
        { path: "job_type", select: "job_type_name" },
        { path: "job_sector", select: "job_sector_name" },
      ],
    })
    .sort({ answerKey_CreatedAt: -1 })
    .skip(skip)
    .limit(limit);

  // 🚿 Remove non-psu jobs
  const filteredData = answerKeyData.filter(
    (item) => item.answerKey_JobId !== null,
  );

  const total = filteredData.length;

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    answerKeyData: filteredData,
  };
};

// ADD ANSWER KEY SERVICE
exports.addAnswerKey = async (data) => {
  try {
    const newAnswerKey = new AnswerKeyModel({
      answerKey_JobId: data.answerKey_JobId,
      answerKey_Title: data.answerKey_Title,
      answerKey_Desc: data.answerKey_Desc,
      answerKey_URL: data.answerKey_URL,
      answerKey_FilePath: "",
      answerKey_ReleaseDate: data.answerKey_ReleaseDate,
    });

    let answerKey_FilePath = null;
    if (data.answerKey_FilePath) {
      answerKey_FilePath = saveBase64File(
        data.answerKey_FilePath,
        "answerKey",
        "job",
        data.extension,
      );
    }

    newAnswerKey.answerKey_FilePath = answerKey_FilePath;

    await newAnswerKey.save();

    return {
      status: 200,
      message: "Answer key added successfully",
      jsonData: newAnswerKey,
    };
  } catch (error) {
    console.error("Error in addAnswerKey Service:", error);
    return {
      status: 500,
      message: "Server error",
    };
  }
};

// GET ANSWER KEY DETAILS BY ID SERVICE
exports.getAnswerKeyListById = async (answerKeyId) => {
  try {
    const answerKeyDetails = await AnswerKeyModel.findById(answerKeyId);

    if (!answerKeyDetails) {
      return {
        status: 404,
        message: "Answer key not found",
        jsonData: {},
      };
    }

    return {
      status: 200,
      message: "Answer key details fetched successfully",
      jsonData: answerKeyDetails,
    };
  } catch (error) {
    console.error("Error in getAnswerKeyListById Service:", error);
    return {
      status: 500,
      message: "Server error",
      jsonData: {},
    };
  }
};

// UPDATE ANSWER KEY SERVICE
exports.updateAnswerKey = async (answerKeyId, data) => {
  try {
    const fetchAnswerKey = await AnswerKeyModel.findById(answerKeyId);
    if (!fetchAnswerKey) {
      return {
        status: 404,
        message: "Answer key not found",
        jsonData: {},
      };
    }

    console.log(data);
    let answerKey_FilePath = fetchAnswerKey.answerKey_FilePath;
    if (
      data.answerKey_FilePath &&
      data.answerKey_FilePath !== answerKey_FilePath
    ) {
      answerKey_FilePath = saveBase64File(
        data.answerKey_FilePath,
        "answerKey",
        "job",
        data.extension,
      );
    }

    const updateData = {
      answerKey_JobId: data.answerKey_JobId || fetchAnswerKey.answerKey_JobId,
      answerKey_Title: data.answerKey_Title || fetchAnswerKey.answerKey_Title,
      answerKey_Desc: data.answerKey_Desc || fetchAnswerKey.answerKey_Desc,
      answerKey_URL: data.answerKey_URL || fetchAnswerKey.answerKey_URL,
      answerKey_FilePath: answerKey_FilePath,
      answerKey_ReleaseDate:
        data.answerKey_ReleaseDate || fetchAnswerKey.answerKey_ReleaseDate,
    };

    const updatedAnswerKey = await AnswerKeyModel.findByIdAndUpdate(
      answerKeyId,
      updateData,
      { new: true },
    );

    return {
      status: 200,
      message: "Answer key updated successfully",
      jsonData: updatedAnswerKey,
    };
  } catch (error) {
    console.error("Error in updateAnswerKey Service:", error);
    return {
      status: 500,
      message: "Server error",
    };
  }
};

// ...................................  JOB RESULT SERVICES START  ....................................................
exports.govResultList = async (query) => {
  const {
    dateFilter,
    fromDate,
    toDate,
    searchFilter,
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;
  const filter = {};

  // 🔍 Search
  if (searchFilter) {
    filter.result_Title = { $regex: searchFilter, $options: "i" };
  }

  // 📅 Date filter
  if (dateFilter) {
    const today = moment().startOf("day");
    const now = moment().endOf("day");
    let startDate, endDate;

    switch (dateFilter) {
      case "today":
        startDate = today.unix();
        endDate = now.unix();
        break;

      case "yesterday":
        startDate = today.clone().subtract(1, "days").unix();
        endDate = now.clone().subtract(1, "days").unix();
        break;

      case "this_week":
        startDate = moment().startOf("week").unix();
        endDate = moment().endOf("week").unix();
        break;

      case "this_month":
        startDate = moment().startOf("month").unix();
        endDate = moment().endOf("month").unix();
        break;

      case "custom":
        if (fromDate && toDate) {
          startDate = moment(fromDate).startOf("day").unix();
          endDate = moment(toDate).endOf("day").unix();
        }
        break;
    }

    if (startDate && endDate) {
      filter.result_CreatedAt = { $gte: startDate, $lte: endDate };
    }
  }

  // ✅ Get Government sector ID
  const governmentSector = await JobSector.findOne({
    job_sector_name: { $regex: /^government/i },
  }).select("_id");

  if (!governmentSector) {
    return {
      total: 0,
      page,
      limit,
      totalPages: 0,
      resultData: [],
    };
  }

  // ✅ Main query
  const resultData = await ResultModel.find(filter)
    .select(
      "result_JobId result_Title result_Desc result_URL result_FilePath result_ReleaseDate result_CreatedAt",
    )
    .populate({
      path: "result_JobId",
      model: "Jobs",
      match: { job_sector: governmentSector._id }, // ⭐ IMPORTANT
      select: "job_title job_category job_type job_sector",
      populate: [
        { path: "job_category", select: "category_name" },
        { path: "job_type", select: "job_type_name" },
        { path: "job_sector", select: "job_sector_name" },
      ],
    })
    .sort({ result_CreatedAt: -1 })
    .skip(skip)
    .limit(limit);

  // 🚿 Remove non-government jobs
  const filteredData = resultData.filter((item) => item.result_JobId !== null);

  const total = filteredData.length;

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    resultData: filteredData,
  };
};

// GET PSU RESULT LIST SERVICE WITH FILTERS AND PAGINATION
exports.psuResultList = async (query) => {
  const {
    dateFilter,
    fromDate,
    toDate,
    searchFilter,
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;
  const filter = {};

  // 🔍 Search
  if (searchFilter) {
    filter.result_Title = { $regex: searchFilter, $options: "i" };
  }

  // 📅 Date filter
  if (dateFilter) {
    const today = moment().startOf("day");
    const now = moment().endOf("day");
    let startDate, endDate;

    switch (dateFilter) {
      case "today":
        startDate = today.unix();
        endDate = now.unix();
        break;

      case "yesterday":
        startDate = today.clone().subtract(1, "days").unix();
        endDate = now.clone().subtract(1, "days").unix();
        break;

      case "this_week":
        startDate = moment().startOf("week").unix();
        endDate = moment().endOf("week").unix();
        break;

      case "this_month":
        startDate = moment().startOf("month").unix();
        endDate = moment().endOf("month").unix();
        break;

      case "custom":
        if (fromDate && toDate) {
          startDate = moment(fromDate).startOf("day").unix();
          endDate = moment(toDate).endOf("day").unix();
        }
        break;
    }

    if (startDate && endDate) {
      filter.result_CreatedAt = { $gte: startDate, $lte: endDate };
    }
  }

  // ✅ Get PSU sector ID
  const psuSector = await JobSector.findOne({
    job_sector_name: { $regex: /^psu/i },
  }).select("_id");

  if (!psuSector) {
    return {
      total: 0,
      page,
      limit,
      totalPages: 0,
      answerKeyData: [],
    };
  }

  // ✅ Main query
  const resultData = await ResultModel.find(filter)
    .select(
      "result_JobId result_Title result_Desc result_URL result_FilePath result_ReleaseDate result_CreatedAt",
    )
    .populate({
      path: "result_JobId",
      model: "Jobs",
      match: { job_sector: psuSector._id }, // ⭐ IMPORTANT
      select: "job_title job_category job_type job_sector",
      populate: [
        { path: "job_category", select: "category_name" },
        { path: "job_type", select: "job_type_name" },
        { path: "job_sector", select: "job_sector_name" },
      ],
    })
    .sort({ result_CreatedAt: -1 })
    .skip(skip)
    .limit(limit);

  // 🚿 Remove non-psu jobs
  const filteredData = resultData.filter((item) => item.result_JobId !== null);

  const total = filteredData.length;

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    resultData: filteredData,
  };
};

// ADD RESULT SERVICE
exports.addResult = async (data) => {
  try {
    const newResult = new ResultModel({
      result_JobId: data.result_JobId,
      result_Title: data.result_Title,
      result_Desc: data.result_Desc,
      result_URL: data.result_URL,
      result_FilePath: "",
      result_ReleaseDate: data.result_ReleaseDate,
    });

    let result_FilePath = null;
    if (data.result_FilePath) {
      result_FilePath = saveBase64File(
        data.result_FilePath,
        "result",
        "job",
        data.extension,
      );
    }

    newResult.result_FilePath = result_FilePath;

    await newResult.save();

    return {
      status: 200,
      message: "Result added successfully",
      jsonData: newResult,
    };
  } catch (error) {
    console.error("Error in addResult Service:", error);
    return {
      status: 500,
      message: "Server error",
    };
  }
};

// GET RESULT DETAILS BY ID SERVICE
exports.getResultListById = async (resultId) => {
  try {
    const resultDetails = await ResultModel.findById(resultId);

    if (!resultDetails) {
      return {
        status: 404,
        message: "Result not found",
        jsonData: {},
      };
    }

    return {
      status: 200,
      message: "Result details fetched successfully",
      jsonData: resultDetails,
    };
  } catch (error) {
    console.error("Error in getResultListById Service:", error);
    return {
      status: 500,
      message: "Server error",
      jsonData: {},
    };
  }
};

// UPDATE RESULT SERVICE
exports.updateResult = async (resultId, data) => {
  try {
    const fetchResult = await ResultModel.findById(resultId);
    if (!fetchResult) {
      return {
        status: 404,
        message: "Result not found",
        jsonData: {},
      };
    }

    console.log(data);
    let result_FilePath = fetchResult.result_FilePath;
    if (data.result_FilePath && data.result_FilePath !== result_FilePath) {
      result_FilePath = saveBase64File(
        data.result_FilePath,
        "result",
        "job",
        data.extension,
      );
    }

    const updateData = {
      result_JobId: data.result_JobId || fetchResult.result_JobId,
      result_Title: data.result_Title || fetchResult.result_Title,
      result_Desc: data.result_Desc || fetchResult.result_Desc,
      result_URL: data.result_URL || fetchResult.result_URL,
      result_FilePath: result_FilePath,
      result_ReleaseDate:
        data.result_ReleaseDate || fetchResult.result_ReleaseDate,
    };

    const updatedResult = await ResultModel.findByIdAndUpdate(
      resultId,
      updateData,
      { new: true },
    );

    return {
      status: 200,
      message: "Result updated successfully",
      jsonData: updatedResult,
    };
  } catch (error) {
    console.error("Error in updateResult Service:", error);
    return {
      status: 500,
      message: "Server error",
    };
  }
};

// ...................................  DOCUMENT SECTION SERVICES ....................................................
exports.getDocumentList = async (query) => {
  const {
    dateFilter,
    fromDate,
    toDate,
    searchFilter,
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;
  const filter = {};

  // 🔍 Search
  if (searchFilter) {
    filter.document_title = { $regex: searchFilter, $options: "i" };
  }

  // 📅 Date filter
  if (dateFilter) {
    const today = moment().startOf("day");
    const now = moment().endOf("day");
    let startDate, endDate;

    switch (dateFilter) {
      case "today":
        startDate = today.unix();
        endDate = now.unix();
        break;

      case "yesterday":
        startDate = today.clone().subtract(1, "days").unix();
        endDate = now.clone().subtract(1, "days").unix();
        break;

      case "this_week":
        startDate = moment().startOf("week").unix();
        endDate = moment().endOf("week").unix();
        break;

      case "this_month":
        startDate = moment().startOf("month").unix();
        endDate = moment().endOf("month").unix();
        break;

      case "custom":
        if (fromDate && toDate) {
          startDate = moment(fromDate).startOf("day").unix();
          endDate = moment(toDate).endOf("day").unix();
        }
        break;
    }

    if (startDate && endDate) {
      filter.document_created_date = { $gte: startDate, $lte: endDate };
    }
  }

  // ✅ Main query
  const resultData = await DocumentModel.find(filter)
    .sort({ document_created_date: -1 })
    .skip(skip)
    .limit(limit);

  const total = resultData.length;

  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    documentData: resultData,
  };
};

// ADD DOCUMENT SERVICE
exports.addDocument = async (data) => {
  try {
    const logo = saveBase64File(
      data.document_logo,
      "document",
      "job",
      data.extension,
    );

    if (
      data.document_files &&
      Array.isArray(data.document_files) &&
      data.document_files.length > 0
    ) {
      const files = [];

      for (let i = 0; i < data.document_files.length; i++) {
        const fileUrl = await saveBase64File(
          data.document_files[i].file_path, // base64
          "document",
          `file_${i + 1}`,
          data.extensions[i],
        );

        files.push({
          file_label: data.document_files[i].file_label || `File ${i + 1}`,
          file_path: fileUrl,
        });
      }

      data.document_files = files;
    }

    // Remove extension fields before saving to database
    delete data.extension;
    delete data.extensions;

    const newDocument = new DocumentModel({
      document_title: data.document_title,
      document_short_desc: data.document_short_desc,
      document_long_desc: data.document_long_desc,
      document_formated_desc1: data.document_formated_desc1,
      document_formated_desc2: data.document_formated_desc2,
      document_formated_desc3: data.document_formated_desc3,
      document_formated_desc4: data.document_formated_desc4,
      document_posted_date: data.document_posted_date,
      document_important_dates: data.document_important_dates || [],
      document_important_links: data.document_important_links || [],
      document_application_fees: data.document_application_fees || [],
      document_files: data.document_files || [],
      document_logo: logo,
    });

    await newDocument.save();

    return {
      status: 200,
      message: "Document added successfully",
      jsonData: newDocument,
    };
  } catch (error) {
    console.error("Error in addDocument Service:", error);
    return {
      status: 500,
      message: "Server error",
    };
  }
};

// UPDATE DOCUMENT SERVICE
exports.updateDocument = async (documentId, data) => {
  try {
    const fetchDocument = await DocumentModel.findById(documentId);
    if (!fetchDocument) {
      return {
        status: 404,
        message: "Document not found",
        jsonData: {},
      };
    }

    let logo = fetchDocument.document_logo;
    if (data.document_logo && data.document_logo !== logo) {
      logo = saveBase64File(
        data.document_logo,
        "document",
        "job",
        data.extension,
      );
    }

    let files = fetchDocument.document_files || [];
    if (
      data.document_files &&
      Array.isArray(data.document_files) &&
      data.document_files.length > 0
    ) {
      files = [];
      for (let i = 0; i < data.document_files.length; i++) {
        const fileUrl = await saveBase64File(
          data.document_files[i].file_path, // base64
          "document",
          `file_${i + 1}`,
          data.extensions[i],
        );

        files.push({
          file_label: data.document_files[i].file_label || `File ${i + 1}`,
          file_path: fileUrl,
        });
      }

      data.document_files = files;
    }

    // Remove extension fields before saving to database
    delete data.extension;
    delete data.extensions;

    const updateData = {
      document_title: data.document_title || fetchDocument.document_title,
      document_short_desc: data.document_short_desc || fetchDocument.document_short_desc,
      document_long_desc: data.document_long_desc || fetchDocument.document_long_desc,
      document_formated_desc1: data.document_formated_desc1 || fetchDocument.document_formated_desc1,
      document_formated_desc2: data.document_formated_desc2 || fetchDocument.document_formated_desc2,
      document_formated_desc3: data.document_formated_desc3 || fetchDocument.document_formated_desc3,
      document_formated_desc4: data.document_formated_desc4 || fetchDocument.document_formated_desc4,
      document_posted_date: data.document_posted_date || fetchDocument.document_posted_date,
      document_important_dates: data.document_important_dates || fetchDocument.document_important_dates,
      document_important_links: data.document_important_links || fetchDocument.document_important_links,
      document_application_fees: data.document_application_fees || fetchDocument.document_application_fees,
      document_files: data.document_files || fetchDocument.document_files,
      document_logo: logo,
    };

    const updatedDocument = await DocumentModel.findByIdAndUpdate(
      documentId,
      updateData,
      { new: true },
    );

    return {
      status: 200,
      message: "Document updated successfully",
      jsonData: updatedDocument,
    };
  } catch (error) {
    console.error("Error in updateDocument Service:", error);
    return {
      status: 500,
      message: "Server error",
    };
  }
};

// GET DOCUMENT DETAILS BY ID SERVICE
exports.getDocumentListById = async (documentId) => {
  try {
    const documentDetails = await DocumentModel.findById(documentId);

    if (!documentDetails) {
      return {
        status: 404,
        message: "Document not found",
        jsonData: {},
      };
    }

    return {
      status: 200,
      message: "Document details fetched successfully",
      jsonData: documentDetails,
    };
  } catch (error) {
    console.error("Error in getDocumentById Service:", error);
    return {
      status: 500,
      message: "Server error",
      jsonData: {},
    };
  }
};

// GET STATE DATA
exports.getStateData = async () => {
  try {

    const fetchAllState = await stateModel.find()
    .select("state_name state_id")
    .lean();

    return {
      status: 200,
      message: "State data fetched successfully",
      jsonData: {
        states: fetchAllState,
      },
    };
  } catch (error) {
    console.error("Error in getStateData Service:", error);
    return {
      status: 500,
      message: "Server error",
      jsonData: [],
    };
  }
};

// GET CITY DATA BY STATE ID
exports.getCityDataByStateId = async (stateId) => {
    try {

        const query = {
            city_state: stateId
        };

        const cities = await cityModel.find(query)
            .select("city_name city_status")
            .lean();

        return {
            status: 200,
            message: "City search fetched successfully",
            jsonData: {
                cities: cities,
            },
        };

    } catch (error) {
        console.error("Error in searchCityByStateId Service:", error);
        return {
            status: 500,
            message: "Server error",
            jsonData: [],
        };
    }
};
