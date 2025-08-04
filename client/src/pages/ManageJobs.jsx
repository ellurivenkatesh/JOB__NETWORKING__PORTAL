import React, { useEffect, useState, useCallback } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const ManageJobs = () => {
  const token = localStorage.getItem("token");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editJobId, setEditJobId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [applicants, setApplicants] = useState([]);
  const [showApplicantsFor, setShowApplicantsFor] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/jobs/recruiter/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch {
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      if (showApplicantsFor === jobId) setShowApplicantsFor(null);
    } catch {
      alert("Failed to delete job");
    }
  };

  const handleEditClick = (job) => {
    setEditJobId(job._id);
    setEditFormData({
      title: job.title || "",
      description: job.description || "",
      skills: (job.skills || []).join(", "),
      budget: job.budget || "",
      location: job.location || "",
      endDate: job.endDate ? job.endDate.slice(0, 10) : "",
      company: job.company || "",
    });
  };

  const handleEditChange = (e) => {
    setEditFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const skillsArray = editFormData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    try {
      const res = await axios.put(
        `/jobs/${editJobId}`,
        {
          ...editFormData,
          skills: skillsArray,
          budget: Number(editFormData.budget),
          endDate: editFormData.endDate ? new Date(editFormData.endDate) : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs((prev) =>
        prev.map((job) => (job._id === editJobId ? res.data.job : job))
      );
      setEditJobId(null);
      alert("Job updated successfully");
    } catch {
      alert("Failed to update job");
    }
  };

  const handleViewApplicants = async (jobId) => {
    try {
      const res = await axios.get(`/jobs/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplicants(res.data.applicants);
      setShowApplicantsFor(jobId);
    } catch {
      alert("Failed to fetch applicants");
    }
  };

  const handleDownloadResume = async (jobId, applicantId) => {
    try {
      const response = await axios.get(`/jobs/${jobId}/applicants/${applicantId}/resume`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume-${applicantId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download resume");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Jobs</h1>

      {loading && <p>Loading jobs...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && jobs.length === 0 && <p>No jobs posted yet.</p>}

      <ul className="space-y-6">
        {jobs.map((job) => (
          <li key={job._id} className="border p-4 rounded shadow bg-white">
            {editJobId === job._id ? (
              <form onSubmit={handleEditSubmit} className="space-y-3">
                <input
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  required
                  className="w-full p-2 border rounded"
                  placeholder="Job Title"
                />
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows={4}
                  required
                  className="w-full p-2 border rounded"
                  placeholder="Description"
                />
                <input
                  name="skills"
                  value={editFormData.skills}
                  onChange={handleEditChange}
                  placeholder="Skills (comma separated)"
                  className="w-full p-2 border rounded"
                />
                <input
                  name="budget"
                  type="number"
                  min="0"
                  value={editFormData.budget}
                  onChange={handleEditChange}
                  required
                  className="w-full p-2 border rounded"
                  placeholder="Budget"
                />
                <input
                  name="location"
                  value={editFormData.location}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                  placeholder="Location"
                />
                <input
                  name="endDate"
                  type="date"
                  value={editFormData.endDate}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  name="company"
                  value={editFormData.company}
                  onChange={handleEditChange}
                  required
                  className="w-full p-2 border rounded"
                  placeholder="Company"
                />

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditJobId(null)}
                    className="bg-gray-400 text-black px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-gray-700">
                  <strong>Company:</strong> {job.company}
                </p>
                <p>
                  <strong>Budget:</strong> ${job.budget}
                </p>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {job.endDate ? new Date(job.endDate).toLocaleDateString() : "No deadline"}
                </p>
                <p className="mb-2">
                  <strong>Skills:</strong>{" "}
                  {(job.skills || []).join(", ")}
                </p>

                <div className="space-x-3">
                  <button
                    onClick={() => handleEditClick(job)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleViewApplicants(job._id)}
                    className="btn-view"
                  >
                    View Applicants ({job.applicants ? job.applicants.length : 0})
                  </button>
                </div>
              </>
            )}

            {/* Applicants List */}
            {showApplicantsFor === job._id && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-semibold mb-2">Applicants ({applicants.length})</h4>
                {applicants.length === 0 ? (
                  <p>No applicants yet.</p>
                ) : (
                  <div className="space-y-3">
                    {applicants.map((applicant, index) => (
                      <div key={index} className="border p-3 rounded bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-semibold">
                              {applicant.user?.name || "Unknown User"}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {applicant.user?.email || "No email"} - {applicant.user?.role || "Unknown role"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Applied: {applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString() : "Unknown date"}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Link
                              to={`/profile/${applicant.user._id}`}
                              className="text-blue-600 underline text-sm"
                            >
                              View Profile
                            </Link>
                            {applicant.resume && (
                              <button
                                onClick={() => handleDownloadResume(job._id, applicant.user._id)}
                                className="text-sm text-white bg-green-600 px-2 py-1 rounded hover:bg-green-700"
                              >
                                Download Resume
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageJobs;
