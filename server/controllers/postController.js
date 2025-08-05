const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const image = req.file ? req.file.path : null; 

    if (!content) return res.status(400).json({ msg: "Content is required" });

    const post = new Post({
      content,
      image,
      author: req.user.id,
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "name email")
      .populate("comments.user", "name email");

    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: "Already liked" });
    }

    post.likes.push(req.user.id);
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "name email")
      .populate("comments.user", "name email");

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.likes = post.likes.filter(
      (id) => id.toString() !== req.user.id.toString()
    );
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "name email")
      .populate("comments.user", "name email");

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.commentPost = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) return res.status(400).json({ msg: "Comment cannot be empty" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const newComment = {
      user: req.user.id,
      comment,
      createdAt: new Date(),
    };

    post.comments.unshift(newComment);
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "name email")
      .populate("comments.user", "name email");

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id: postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const comment = post.comments.find((c) => c._id.toString() === commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (
      comment.user.toString() !== req.user.id &&
      post.author.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: "Unauthorized to delete this comment" });
    }

    post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "name email")
      .populate("comments.user", "name email");

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, image } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    post.content = content || post.content;
    post.image = image || post.image;
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "name email")
      .populate("comments.user", "name email");

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    await Post.findByIdAndDelete(id);
    res.json({ msg: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email")
      .populate("comments.user", "name email");

    if (!post) return res.status(404).json({ msg: "Post not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
