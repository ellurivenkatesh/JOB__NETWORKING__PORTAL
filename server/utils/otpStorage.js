// In-memory storage for OTPs with expiration
const otpStorage = new Map();

// Store OTP with expiration (10 minutes)
const storeOTP = (email, otp) => {
  const expiration = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStorage.set(email, {
    otp,
    expiration
  });
};

// Get and validate OTP
const getOTP = (email) => {
  const data = otpStorage.get(email);
  if (!data) return null;
  
  // Check if OTP has expired
  if (Date.now() > data.expiration) {
    otpStorage.delete(email);
    return null;
  }
  
  return data.otp;
};

// Remove OTP after successful verification
const removeOTP = (email) => {
  otpStorage.delete(email);
};

// Clean up expired OTPs (run periodically)
const cleanupExpiredOTPs = () => {
  const now = Date.now();
  for (const [email, data] of otpStorage.entries()) {
    if (now > data.expiration) {
      otpStorage.delete(email);
    }
  }
};

// Run cleanup every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);

module.exports = {
  storeOTP,
  getOTP,
  removeOTP
}; 