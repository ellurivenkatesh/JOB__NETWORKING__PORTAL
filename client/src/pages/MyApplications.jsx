import React, { useState, useEffect, useCallback } from "react";
import axios from "../api/axios";

const MyApplications = () => {
  const token = localStorage.getItem("token");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAppliedJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/jobs/user/applied", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppliedJobs(res.data);
    } catch (err) {
      console.error("MyApplications: Error fetching applied jobs:", err);
      setError("Failed to fetch your applied jobs");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAppliedJobs();
  }, [fetchAppliedJobs]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>

      {loading && <p>Loading your applications...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && appliedJobs.length === 0 && <p>You have not applied to any jobs yet.</p>}

      <ul className="space-y-6">
        {appliedJobs.map((job) => (
          <li key={job._id} className="border p-4 rounded shadow bg-white">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Budget:</strong> ${job.budget}</p>
            <p><strong>Deadline:</strong> {job.endDate ? new Date(job.endDate).toLocaleDateString() : "No deadline"}</p>
            <p><strong>Skills:</strong> {(job.skills || []).join(", ")}</p>
            <p className="mt-2">{job.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyApplications;
