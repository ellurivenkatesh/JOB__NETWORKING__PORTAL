import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sorted);
      } catch (err) {
        setError("Failed to fetch posts");
        console.error(err);
      }
    };

    fetchPosts();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setError("");
    if (!content.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const res = await axios.post("/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setPosts([res.data, ...posts]);
      setContent("");
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      setError("Failed to create post");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (post) => {
    try {
      const isLiked = post.likes.some((id) => id.toString() === user._id);
      const url = isLiked
        ? `/posts/${post._id}/unlike`
        : `/posts/${post._id}/like`;

      const res = await axios.put(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prev) =>
        prev.map((p) => (p._id === post._id ? res.data : p))
      );
    } catch (err) {
      setError("Failed to toggle like");
      console.error(err);
    }
  };

  const addComment = async (postId, comment) => {
    if (!comment.trim()) return;
    try {
      const res = await axios.post(
        `/posts/${postId}/comment`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? res.data : p))
      );
    } catch (err) {
      setError("Failed to add comment");
      console.error(err);
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      const res = await axios.delete(
        `/posts/${postId}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? res.data : p))
      );
    } catch (err) {
      setError("Failed to delete comment");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handlePost} className="mb-6">
        <textarea
          className="w-full p-3 border rounded mb-2"
          rows={3}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-2"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mb-2 max-h-40 object-contain rounded"
          />
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>

      {posts.map((post) => (
        <div key={post._id} className="border p-4 rounded mb-6 shadow">
          <p className="mb-2">{post.content}</p>
          {post.image && (
            <img
              src={
                post.image.startsWith("http")
                  ? post.image
                  : `http://localhost:5000/${post.image}`
              }
              alt="Post"
              className="w-full max-h-64 object-contain mb-2"
            />
          )}

          <p className="text-sm text-gray-500 mb-2">
            Posted by{" "}
            <Link
              to={`/profile/${post.author?._id}`}
              className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors duration-200"
            >
              {post.author?.name || "Unknown"}
            </Link>{" "}
            on{" "}
            {post.createdAt
              ? new Date(post.createdAt).toLocaleString()
              : "Unknown date"}
          </p>

          <button
            onClick={() => toggleLike(post)}
            className={`text-sm px-3 py-1 rounded ${
              post.likes.some((id) => id.toString() === user._id)
                ? "bg-red-500 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            ❤️ {post.likes.length}
          </button>

          <div className="mt-4 space-y-1">
            <strong>Comments:</strong>
            {post.comments.map((c) => (
              <div
                key={c._id}
                className="text-sm flex justify-between items-center"
              >
                <span>
                  <Link
                    to={`/profile/${c.user?._id}`}
                    className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors duration-200"
                  >
                    {c.user?.name || "User"}
                  </Link>
                  : {c.comment}
                </span>
                {c.user?._id === user._id && (
                  <button
                    onClick={() => deleteComment(post._id, c._id)}
                    className="text-red-500 text-xs ml-2 hover:text-red-700 transition-colors duration-200"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const comment = e.target.comment.value;
                addComment(post._id, comment);
                e.target.reset();
              }}
            >
              <input
                name="comment"
                placeholder="Write a comment..."
                className="w-full p-2 mt-2 border rounded text-sm"
              />
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Posts;
