import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, token]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!profile?._id) return;
      try {
        const res = await axios.get(`/posts/user/${profile._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching user posts:", err);
      }
    };

    if (profile) {
      fetchUserPosts();
    }
  }, [profile, token]);

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="loading-spinner"></div>
          <span className="ml-2">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="alert-error">
          <p>{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="btn-secondary mt-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="alert-error">
          <p>User not found</p>
          <button 
            onClick={() => navigate(-1)} 
            className="btn-secondary mt-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="btn-outline mb-4"
        >
          ← Back
        </button>
        
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      </div>

      <div className="card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-800 font-medium">{profile.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-800">{profile.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Role</label>
                <span className={`badge ${profile.role === 'recruiter' ? 'badge-primary' : 'badge-success'}`}>
                  {profile.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
                </span>
              </div>
              
              {profile.bio && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Bio</label>
                  <p className="text-gray-800">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Professional Details</h3>
            <div className="space-y-3">
              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Skills</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="job-skills">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {profile.linkedin && (
                <div>
                  <label className="text-sm font-medium text-gray-600">LinkedIn</label>
                  <a 
                    href={profile.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    View Profile
                  </a>
                </div>
              )}
              
              {profile.walletAddress && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Wallet Address</label>
                  <p className="text-gray-800 font-mono text-sm break-all">
                    {profile.walletAddress}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Posts ({posts.length})</h3>
        
        {posts.length === 0 ? (
          <p className="text-gray-600">No posts yet</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-lg mb-2 text-gray-800">{post.title}</h4>
                <p className="text-gray-700">{post.content}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Posted on {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile; 