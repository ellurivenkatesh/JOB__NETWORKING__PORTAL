const Job = require("../models/Job");
const User = require("../models/User");

exports.createJob = async (req, res) => {
  try {
    const { title, description, skills, budget, location, endDate, company } = req.body;

    const job = new Job({
      title,
      description,
      skills,
      budget,
      location,
      endDate,
      company,
      creator: req.user.id
    });

    await job.save();
    res.status(201).json({ message: "Job created", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("creator", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("creator", "name email");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.creator.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    Object.assign(job, req.body);
    await job.save();

    res.json({ message: "Job updated", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.creator.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.applyToJob = async (req, res) => {
  try {
    const jobId = req.params.jobId || req.params.id;
    const userId = req.user.id.toString();
    const resumePath = req.file ? req.file.path : null;

    console.log("Applying to job:", { jobId, userId, resumePath });

    const job = await Job.findById(jobId);
    if (!job) {
      console.log("Job not found for ID:", jobId);
      return res.status(404).json({ message: "Job not found" });
    }

    console.log("Found job:", job.title);
    console.log("Applicants array:", job.applicants);

    const alreadyApplied = job.applicants.some(applicant => {
      if (!applicant) return false;
      if (typeof applicant === 'object' && applicant.user) {
        return applicant.user.toString() === userId;
      }
      if (typeof applicant === 'string' || typeof applicant === 'object') {
        return applicant.toString() === userId;
      }
      return false;
    });

    console.log("alreadyApplied result:", alreadyApplied);

    if (alreadyApplied) {
      console.log("User already applied");
      return res.status(400).json({ message: "Already applied" });
    }

    if (resumePath) {
      job.applicants.push({ user: userId, resume: resumePath });
    } else {
      job.applicants.push(userId);
    }

    await job.save();
    console.log("Successfully applied to job");
    res.status(200).json({ message: "Applied to job successfully" });
  } catch (err) {
    console.error("Error applying to job:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.withdrawApplication = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.applicants = job.applicants.filter(
      (applicantId) => applicantId.toString() !== req.user.id
    );

    await job.save();
    res.json({ message: "Application withdrawn" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobsByRecruiter = async (req, res) => {
  try {
    const jobs = await Job.find({ creator: req.user.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobsAppliedByUser = async (req, res) => {
  try {
    const userId = req.user.id.toString();
    console.log('Fetching jobs applied by user:', userId);
    const jobs = await Job.find({
      $or: [
        { applicants: userId },                  
        { "applicants.user": userId }            
      ]
    }).populate("creator", "name email");
    console.log('Jobs found:', jobs.map(j => ({id: j._id, title: j.title, applicants: j.applicants})));
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.creator.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const processedApplicants = [];
    
    for (const applicant of job.applicants) {
      let userId, resumePath;
      
      if (applicant && typeof applicant === 'object' && applicant.user) {
        userId = applicant.user;
        resumePath = applicant.resume;
      } else if (applicant) {
        userId = applicant;
        resumePath = null;
      } else {
        continue;
      }

      const user = await User.findById(userId).select('name email role');
      if (user) {
        processedApplicants.push({
          user: user,
          resume: resumePath,
          appliedAt: applicant._id ? new Date(applicant._id.getTimestamp()) : new Date()
        });
      }
    }

    res.json({ applicants: processedApplicants });
  } catch (err) {
    console.error("Error getting job applicants:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.downloadResume = async (req, res) => {
  try {
    const { jobId, applicantId } = req.params;
    
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.creator.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const applicant = job.applicants.find(app => {
      if (app && typeof app === 'object' && app.user) {
        return app.user.toString() === applicantId;
      }
      return false;
    });

    if (!applicant || !applicant.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const resumePath = applicant.resume;
    res.download(resumePath, `resume-${applicantId}.pdf`);
  } catch (err) {
    console.error("Error downloading resume:", err);
    res.status(500).json({ error: err.message });
  }
};
