const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true }, // Text post content
    image: { type: String }, // Optional: URL of image (if uploaded)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }, // OK to keep here for individual comments
      },
    ],
  },
  { timestamps: true } // adds createdAt and updatedAt automatically to the post
);

module.exports = mongoose.model("Post", postSchema);
