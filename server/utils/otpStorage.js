const otpStorage = new Map();

const storeOTP = (email, otp) => {
  const expiration = Date.now() + 10 * 60 * 1000; 
  otpStorage.set(email, {
    otp,
    expiration
  });
};

const getOTP = (email) => {
  const data = otpStorage.get(email);
  if (!data) return null;
  
  if (Date.now() > data.expiration) {
    otpStorage.delete(email);
    return null;
  }
  
  return data.otp;
};

const removeOTP = (email) => {
  otpStorage.delete(email);
};

const cleanupExpiredOTPs = () => {
  const now = Date.now();
  for (const [email, data] of otpStorage.entries()) {
    if (now > data.expiration) {
      otpStorage.delete(email);
    }
  }
};

setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);

module.exports = {
  storeOTP,
  getOTP,
  removeOTP
}; 