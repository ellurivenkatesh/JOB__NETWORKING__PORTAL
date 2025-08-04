import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios"; // your axios instance with baseURL set
import BlockchainPayment from "../components/BlockchainPayment";

const JobPost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    budget: "",
    location: "",
    endDate: "",
    company: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePaymentSuccess = (hash) => {
    setPaymentCompleted(true);
    setTransactionHash(hash);
    setSuccess("Payment successful! You can now post your job.");
  };

  const handlePaymentError = (error) => {
    setError("Payment failed: " + error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentCompleted) {
      setError("Please complete the blockchain payment first.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    const skillsArray = formData.skills
      .split(",")
      .map(skill => skill.trim())
      .filter(Boolean);

    if (!formData.title.trim() || !formData.description.trim() || !formData.company.trim() || !formData.budget || isNaN(Number(formData.budget))) {
      setError("Please fill in all required fields correctly.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/jobs",
        {
          title: formData.title,
          description: formData.description,
          skills: skillsArray,
          budget: Number(formData.budget),
          location: formData.location,
          endDate: formData.endDate ? new Date(formData.endDate) : null,
          company: formData.company,
          transactionHash: transactionHash, // Include transaction hash in job data
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess("Job posted successfully!");
      setFormData({
        title: "",
        description: "",
        skills: "",
        budget: "",
        location: "",
        endDate: "",
        company: ""
      });
      setPaymentCompleted(false);
      setTransactionHash("");

      setTimeout(() => navigate("/jobs/manage"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Post a New Job</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}

      {/* Blockchain Payment Section */}
      {!paymentCompleted && (
        <div className="mb-6">
          <BlockchainPayment 
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
      )}

      {paymentCompleted && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded">
          <p className="text-green-700">
            ✅ Payment completed! Transaction: {transactionHash.slice(0, 10)}...
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Job Title *"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Job Description *"
          rows={5}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          name="skills"
          type="text"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Skills (comma separated)"
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          name="budget"
          type="number"
          value={formData.budget}
          onChange={handleChange}
          placeholder="Budget *"
          min="0"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company Name *"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <button
          type="submit"
          disabled={loading || !paymentCompleted}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Posting..." : paymentCompleted ? "Post Job" : "Complete Payment First"}
        </button>
      </form>
    </div>
  );
};

export default JobPost;
