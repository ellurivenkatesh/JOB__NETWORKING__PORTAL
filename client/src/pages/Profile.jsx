import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [posts, setPosts] = useState([]);
  const [editedPosts, setEditedPosts] = useState({});
  const [postsLoading, setPostsLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [postSavingIds, setPostSavingIds] = useState(new Set());

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setForm(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("Failed to load profile.");
      }
    };
    fetchProfile();
  }, [token]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!profile?._id) return;
      setPostsLoading(true);
      try {
        const res = await axios.get(`/posts/user/${profile._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        alert("Failed to load posts.");
      } finally {
        setPostsLoading(false);
      }
    };
    fetchPosts();
  }, [profile, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "skills") {
      setForm((prev) => ({ ...prev, skills: value.split(",").map((s) => s.trim()) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileSave = async () => {
  setProfileSaving(true);
  try {
    const dataToSend = {
      ...form,
      skills: form.skills?.map((s) => s.trim()) || [],
      name: form.name?.trim(),
      email: form.email?.trim(),
      bio: form.bio?.trim(),
      linkedin: form.linkedin?.trim(),
      walletAddress: form.walletAddress?.trim(),
    };
    const res = await axios.put("/user/me", dataToSend, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProfile(res.data.user);  
    setEditMode(false);
    alert("Profile updated successfully.");
  } catch (err) {
    console.error("Failed to update profile", err);
    alert("Failed to update profile.");
  } finally {
    setProfileSaving(false);
  }
};

  const handlePostEdit = (postId) => {
    const post = posts.find((p) => p._id === postId);
    if (post) {
      setEditedPosts((prev) => ({
        ...prev,
        [postId]: { title: post.title, content: post.content },
      }));
    }
  };

  const handlePostChange = (postId, field, value) => {
    setEditedPosts((prev) => ({
      ...prev,
      [postId]: { ...prev[postId], [field]: value },
    }));
  };

  const handlePostSave = async (postId) => {
    setPostSavingIds((prev) => new Set(prev).add(postId));
    try {
      const updated = editedPosts[postId];
      const dataToSend = {
        title: updated.title.trim(),
        content: updated.content.trim(),
      };
      const res = await axios.put(`/posts/${postId}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? res.data : post))
      );
      const copy = { ...editedPosts };
      delete copy[postId];
      setEditedPosts(copy);
      alert("Post updated successfully.");
    } catch (err) {
      console.error("Error saving post", err);
      alert("Failed to save post.");
    } finally {
      setPostSavingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(postId);
        return copy;
      });
    }
  };

  const handlePostDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((post) => post._id !== postId));
      alert("Post deleted.");
    } catch (err) {
      console.error("Error deleting post", err);
      alert("Failed to delete post.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      {editMode ? (
        <div className="space-y-3">
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            placeholder="Name"
            className="border p-2 w-full"
            disabled={profileSaving}
          />
          <input
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 w-full"
            disabled={profileSaving}
          />
          <input
            name="bio"
            value={form.bio || ""}
            onChange={handleChange}
            placeholder="Bio"
            className="border p-2 w-full"
            disabled={profileSaving}
          />
          <input
            name="linkedin"
            value={form.linkedin || ""}
            onChange={handleChange}
            placeholder="LinkedIn"
            className="border p-2 w-full"
            disabled={profileSaving}
          />
          <input
            name="walletAddress"
            value={form.walletAddress || ""}
            onChange={handleChange}
            placeholder="Wallet Address"
            className="border p-2 w-full"
            disabled={profileSaving}
          />
          <input
            name="skills"
            value={form.skills?.join(", ") || ""}
            onChange={handleChange}
            placeholder="Skills (comma separated)"
            className="border p-2 w-full"
            disabled={profileSaving}
          />
          <p>
            <strong>Role:</strong> {form.role}
          </p>
          <button
            onClick={handleProfileSave}
            className="bg-green-600 text-white px-4 py-2 rounded"
            disabled={profileSaving}
          >
            {profileSaving ? "Saving..." : "Save Profile"}
          </button>
          <button
            onClick={() => {
              setEditMode(false);
              setForm(profile);
            }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
            disabled={profileSaving}
          >
            Cancel
          </button>
        </div>
      ) : profile ? (
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Bio:</strong> {profile.bio || "N/A"}
          </p>
          <p>
            <strong>LinkedIn:</strong> {profile.linkedin || "N/A"}
          </p>
          <p>
            <strong>Wallet:</strong> {profile.walletAddress || "N/A"}
          </p>
          <p>
            <strong>Skills:</strong> {profile.skills?.join(", ") || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      <hr className="my-6" />

      <h3 className="text-xl font-bold mb-2">My Posts</h3>
      {postsLoading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="border p-4 rounded mb-4">
            {editedPosts[post._id] ? (
              <>
                <input
                  value={editedPosts[post._id].title}
                  onChange={(e) =>
                    handlePostChange(post._id, "title", e.target.value)
                  }
                  className="border w-full p-2 mb-2"
                  disabled={postSavingIds.has(post._id)}
                />
                <textarea
                  value={editedPosts[post._id].content}
                  onChange={(e) =>
                    handlePostChange(post._id, "content", e.target.value)
                  }
                  className="border w-full p-2 mb-2"
                  disabled={postSavingIds.has(post._id)}
                />
                <button
                  onClick={() => handlePostSave(post._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                  disabled={postSavingIds.has(post._id)}
                >
                  {postSavingIds.has(post._id) ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    const copy = { ...editedPosts };
                    delete copy[post._id];
                    setEditedPosts(copy);
                  }}
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                  disabled={postSavingIds.has(post._id)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h4 className="font-semibold text-lg">{post.title}</h4>
                <p>{post.content}</p>
                <div className="mt-2 space-x-4">
                  <button
                    onClick={() => handlePostEdit(post._id)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handlePostDelete(post._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Profile;
