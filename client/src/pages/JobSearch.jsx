import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "../api/axios";
import SkillBasedJobMatcher from "../components/SkillBasedJobMatcher";

const JobSearch = () => {
  const token = localStorage.getItem("token");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  // const [showSkillMatcher, setShowSkillMatcher] = useState(false);

  const [filters, setFilters] = useState({
    title: "",
    company: "",
    skills: "",
    minBudget: "",
    maxBudget: "",
  });

  // Fetch user profile to get skills
  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await axios.get("/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  }, [token]);

  // Memoized filter function
  const applyFilters = useCallback(() => {
    let filtered = [...jobs];

    // Exclude applied jobs
    filtered = filtered.filter((job) => !appliedJobs.includes(job._id));

    if (filters.title.trim()) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    if (filters.company.trim()) {
      filtered = filtered.filter((job) =>
        job.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    if (filters.skills.trim()) {
      const skillsArr = filters.skills
        .toLowerCase()
        .split(",")
        .map((s) => s.trim());
      filtered = filtered.filter((job) =>
        skillsArr.every((skill) =>
          job.skills.some((js) => js.toLowerCase().includes(skill))
        )
      );
    }

    if (filters.minBudget) {
      filtered = filtered.filter(
        (job) => job.budget >= Number(filters.minBudget)
      );
    }

    if (filters.maxBudget) {
      filtered = filtered.filter(
        (job) => job.budget <= Number(filters.maxBudget)
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, appliedJobs, filters]);

  // Fetch applied jobs
  const fetchAppliedJobs = useCallback(async () => {
    try {
      const res = await axios.get("/jobs/user/applied", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppliedJobs(res.data.map((job) => job._id)); // Assuming res.data is an array of job objects
    } catch (err) {
      console.error("Failed to fetch applied jobs", err);
    }
  }, [token]);

  // Fetch all jobs
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/jobs");
      const today = new Date();
      const validJobs = res.data.filter(
        (job) => !job.endDate || new Date(job.endDate) >= today
      );
      setJobs(validJobs);
    } catch (err) {
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
    fetchUserProfile();
  }, [fetchJobs, fetchAppliedJobs, fetchUserProfile]);

  useEffect(() => {
    applyFilters();
  }, [filters, jobs, appliedJobs, applyFilters]);

  const handleInputChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleJobApplied = (jobId) => {
    setAppliedJobs((prev) => [...prev, jobId]);
  };

  const handleMatchedJobs = (matchedJobs) => {
    // Update filtered jobs with skill-matched jobs at the top
    const matchedJobIds = matchedJobs.map(job => job._id);
    const otherJobs = filteredJobs.filter(job => !matchedJobIds.includes(job._id));
    const prioritizedJobs = [...matchedJobs, ...otherJobs];
    setFilteredJobs(prioritizedJobs);
  };

  // Convert user skills array to comma-separated string
  const getUserSkillsString = () => {
    if (!userProfile?.skills || userProfile.skills.length === 0) return "";
    return userProfile.skills.join(", ");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Find Jobs</h1>

      {/* Skill-Based Job Matcher */}
      {userProfile?.skills && userProfile.skills.length > 0 ? (
        <div className="mb-6">
          <SkillBasedJobMatcher
            userSkills={getUserSkillsString()}
            availableJobs={jobs.filter(job => !appliedJobs.includes(job._id))}
            onMatchedJobs={handleMatchedJobs}
          />
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            <strong>💡 Tip:</strong> Add your skills to your profile to get personalized job recommendations!
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            Go to your profile and add skills like "JavaScript, React, Node.js" to see relevant jobs first.
          </p>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={filters.title}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={filters.company}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          value={filters.skills}
          onChange={handleInputChange}
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="minBudget"
          placeholder="Min Budget"
          value={filters.minBudget}
          onChange={handleInputChange}
          className="p-2 border rounded"
          min="0"
        />
        <input
          type="number"
          name="maxBudget"
          placeholder="Max Budget"
          value={filters.maxBudget}
          onChange={handleInputChange}
          className="p-2 border rounded"
          min="0"
        />
      </div>

      {loading && <p>Loading jobs...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {filteredJobs.length === 0 && !loading && <p>No jobs found.</p>}

      <ul className="space-y-6">
        {filteredJobs.map((job) => (
          <li key={job._id} className="border p-4 rounded shadow bg-white">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              {job.matchScore && (
                <div className={`px-2 py-1 rounded text-xs font-semibold ${
                  job.matchScore >= 80 ? 'text-green-600 bg-green-100' :
                  job.matchScore >= 60 ? 'text-blue-600 bg-blue-100' :
                  job.matchScore >= 40 ? 'text-yellow-600 bg-yellow-100' :
                  'text-orange-600 bg-orange-100'
                }`}>
                  {job.matchScore}% Match
                </div>
              )}
            </div>
            <p>
              <strong>Company:</strong> {job.company}
            </p>
            <p>
              <strong>Budget:</strong> ${job.budget}
            </p>
            <p>
              <strong>Deadline:</strong>{" "}
              {job.endDate
                ? new Date(job.endDate).toLocaleDateString()
                : "No deadline"}
            </p>
            <p>
              <strong>Skills:</strong> {(job.skills || []).join(", ")}
            </p>
            {job.matchedSkills && job.matchedSkills.length > 0 && (
              <div className="mt-2">
                <strong className="text-green-600">Matched Skills:</strong>{" "}
                <span className="text-green-600">
                  {job.matchedSkills.join(", ")}
                </span>
              </div>
            )}
            <p className="mt-2">{job.description}</p>
            <ApplyButton jobId={job._id} onApply={() => handleJobApplied(job._id)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const ApplyButton = ({ jobId, onApply }) => {
  const token = localStorage.getItem("token");
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const resume = e.target.files[0];
    if (!resume) return;

    const formData = new FormData();
    formData.append("resume", resume);

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`/jobs/${jobId}/apply`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (response.status === 200) {
        setApplied(true);
        onApply(); // Notify parent to update UI
        setError(""); // Clear any previous errors
      }
    } catch (err) {
      console.error("Application error:", err);
      setError(err.response?.data?.message || "Failed to apply to job");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  if (applied) {
    return (
      <button
        disabled
        className="status-badge status-applied"
      >
        ✓ Applied
      </button>
    );
  }

  return (
    <>
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button
        onClick={triggerFileSelect}
        disabled={loading}
        className={`btn-apply ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? "Applying..." : "Apply with Resume"}
      </button>
      {error && <p className="text-red-600 mt-1 text-sm">{error}</p>}
    </>
  );
};

export default JobSearch;
