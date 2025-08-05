const express = require("express");
const router = express.Router();
const { register, login, sendOTP, verifyOTPAndRegister } = require("../controllers/authController");

router.post("/send-otp", sendOTP);
router.post("/verify-otp-register", verifyOTPAndRegister);

router.post("/register", register);
router.post("/login", login);

module.exports = router;
