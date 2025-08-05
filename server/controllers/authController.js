const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOTP, sendOTPEmail } = require("../utils/emailService");
const { storeOTP, getOTP, removeOTP } = require("../utils/otpStorage");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const otp = generateOTP();
    
    storeOTP(email, otp);
    
    const emailSent = await sendOTPEmail(email, otp);
    
    if (emailSent) {
      res.json({ message: "OTP sent successfully" });
    } else {
      res.status(500).json({ message: "Failed to send OTP email. Please check email configuration." });
    }
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.verifyOTPAndRegister = async (req, res) => {
  const { name, email, password, role, otp } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const storedOTP = getOTP(email);
    if (!storedOTP) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (storedOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();
    
    removeOTP(email);
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, walletAddress, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      walletAddress,
      role,
    });

    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    const { password: _, ...userData } = user.toObject();

    res.json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
