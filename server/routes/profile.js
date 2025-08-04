const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getMyProfile,
  updateMyProfile,
  getUserProfileById
} = require("../controllers/profileController");

// Get own profile
router.get("/me", auth, getMyProfile);

// Update own profile
router.put("/me", auth, updateMyProfile);

// Get another user's public profile by ID
router.get("/:id", auth, getUserProfileById);

module.exports = router;
