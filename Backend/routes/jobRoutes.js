const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  saveJobSection,
  uploadJobFiles,
  deleteJobArrayItem
} = require("../controllers/jobController");
const JobsController = require("../controllers/JobsController");

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/jobs/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images and documents are allowed"));
    }
  },
});

// Routes
router.post("/", upload.fields([{ name: "logo", maxCount: 1 }, { name: "files", maxCount: 10 }]), createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.put("/:id", upload.fields([{ name: "logo", maxCount: 1 }, { name: "files", maxCount: 10 }]), updateJob);
router.delete("/:id", deleteJob);

// Section-specific routes
router.post("/save-section", saveJobSection);
router.post("/files", upload.array("files", 10), uploadJobFiles);
router.delete("/:id/section/:section/:index", deleteJobArrayItem);


// new Job routes
router.post("/add", JobsController.addJobsController);
router.get("/get_job/:jobId", JobsController.getJobByIdController);
router.put("/update_job/:id", JobsController.updateJobByIdController);

module.exports = router;
