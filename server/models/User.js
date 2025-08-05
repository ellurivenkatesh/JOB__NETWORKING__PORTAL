const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['seeker', 'recruiter'], 
    default: 'seeker',
  },
  walletAddress: { type: String },
  bio: { type: String },
  linkedin: { type: String },
  skills: { type: [String] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
