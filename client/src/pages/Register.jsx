import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: form, 2: OTP verification
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "seeker", // default role
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setOtpLoading(true);

    // Basic validation
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill in all fields");
      setOtpLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setOtpLoading(false);
      return;
    }

    try {
      await axios.post("/auth/send-otp", { email: form.email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otp.trim()) {
      setError("Please enter the OTP");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/auth/verify-otp-register", {
        ...form,
        otp: otp.trim()
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setOtpLoading(true);
    try {
      await axios.post("/auth/send-otp", { email: form.email });
      setError("OTP resent successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="login-page flex items-center justify-center min-h-screen">
      <div className="form-container fade-in">
        <h2 className="form-title text-gradient">Create Account</h2>
        <p className="form-subtitle">
          {step === 1 ? "Join our job networking platform" : "Verify your email"}
        </p>

        {error && (
          <div className="alert-error mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {step === 1 ? (
          // Step 1: Registration Form
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password (min 6 characters)"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="input-field"
              >
                <option value="seeker">Job Seeker</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={otpLoading}
              className={`w-full btn-primary ${otpLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {otpLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Sending OTP...
                </div>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </form>
        ) : (
          // Step 2: OTP Verification
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-gray-600 mb-2">
                We've sent a verification code to:
              </p>
              <p className="font-semibold text-gray-800">{form.email}</p>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input-field text-center text-lg tracking-widest"
                maxLength="6"
                required
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify & Create Account"
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={otpLoading}
                className="text-blue-600 hover:text-blue-700 text-sm underline"
              >
                {otpLoading ? "Sending..." : "Resend Code"}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-600 hover:text-gray-700 text-sm"
              >
                ← Back to form
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
