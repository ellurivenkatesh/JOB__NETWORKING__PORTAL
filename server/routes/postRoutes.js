const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

const {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  getPostById,
  getPostsByUser,
  deleteComment,
} = require("../controllers/postController");

router.post("/", auth, upload.single("image"), createPost);
router.get("/", getAllPosts);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.put("/:id/like", auth, likePost);
router.put("/:id/unlike", auth, unlikePost);
router.post("/:id/comment", auth, commentPost);

router.get("/user/:userId", auth, getPostsByUser);
router.get("/:id", auth, getPostById);

router.delete("/:id/comment/:commentId", auth, deleteComment);

module.exports = router;
