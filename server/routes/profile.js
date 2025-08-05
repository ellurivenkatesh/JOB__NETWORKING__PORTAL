const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getMyProfile,
  updateMyProfile,
  getUserProfileById
} = require("../controllers/profileController");

router.get("/me", auth, getMyProfile);

router.put("/me", auth, updateMyProfile);

router.get("/:id", auth, getUserProfileById);

module.exports = router;
