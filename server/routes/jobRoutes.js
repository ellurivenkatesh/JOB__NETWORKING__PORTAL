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

const logParams = (req, res, next) => {
  console.log("Route params:", req.params);
  console.log("Request URL:", req.url);
  console.log("Request method:", req.method);
  next();
};

router.post("/", auth, createJob);                      // Create a job
router.put("/:id", auth, updateJob);                    // Edit a job
router.delete("/:id", auth, deleteJob);                 // Delete a job

router.get("/", getAllJobs);                            // Get all jobs
router.get("/recruiter/mine", auth, getJobsByRecruiter); // Jobs posted 
router.get("/user/applied", auth, getJobsAppliedByUser); // Jobs applied 
router.get("/:id", getJobById);                         // Get job by ID

router.post("/:jobId/apply", logParams, auth, upload.single("resume"), applyToJob); // Apply to job with resume
router.put("/:id/withdraw", auth, withdrawApplication); // Withdraw application

router.get("/:id/applicants", auth, getJobApplicants);  // Get all applicants
router.get("/:jobId/applicants/:applicantId/resume", auth, downloadResume); // Download applicant resume

module.exports = router;
