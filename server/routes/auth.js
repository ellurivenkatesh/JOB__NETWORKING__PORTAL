const express = require("express");
const router = express.Router();
const { register, login, sendOTP, verifyOTPAndRegister } = require("../controllers/authController");

// OTP-based registration routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp-register", verifyOTPAndRegister);

// Original routes (kept for backward compatibility)
router.post("/register", register);
router.post("/login", login);

module.exports = router;
