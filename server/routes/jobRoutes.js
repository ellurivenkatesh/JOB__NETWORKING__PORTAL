const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyToJob,
  withdrawApplication,
  getJobsByRecruiter,
  getJobsAppliedByUser,
  getJobApplicants,
  downloadResume
} = require("../controllers/jobController");

// Debug middleware to log route parameters
const logParams = (req, res, next) => {
  console.log("Route params:", req.params);
  console.log("Request URL:", req.url);
  console.log("Request method:", req.method);
  next();
};

// Job creation and management by recruiters
router.post("/", auth, createJob);                      // Create a job
router.put("/:id", auth, updateJob);                    // Edit a job
router.delete("/:id", auth, deleteJob);                 // Delete a job

// Job retrieval (specific routes first)
router.get("/", getAllJobs);                            // Get all jobs (public)
router.get("/recruiter/mine", auth, getJobsByRecruiter); // Jobs posted by the logged-in recruiter
router.get("/user/applied", auth, getJobsAppliedByUser); // Jobs applied by the logged-in user
router.get("/:id", getJobById);                         // Get single job by ID

// Job application by seekers (with resume upload)
router.post("/:jobId/apply", logParams, auth, upload.single("resume"), applyToJob); // Apply to job with resume
router.put("/:id/withdraw", auth, withdrawApplication); // Withdraw application

// Recruiter view applicants and download resumes
router.get("/:id/applicants", auth, getJobApplicants);  // Get all applicants of a job
router.get("/:jobId/applicants/:applicantId/resume", auth, downloadResume); // Download applicant resume

module.exports = router;
