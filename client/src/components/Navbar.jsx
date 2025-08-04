import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  // Safely parse user from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    // Invalid JSON, ignore and keep user null
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center max-w-7xl mx-auto">
      <div className="text-xl font-semibold">
        <Link to="/" className="hover:underline">
          Job & Networking Portal
        </Link>
      </div>

      <div className="space-x-4 flex items-center">
        {isAuthenticated && user ? (
          <>
            {/* Common Links */}
            <Link to="/posts" className="hover:underline">
              Posts
            </Link>
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>

            {/* Role-based Links */}
            {user.role === "recruiter" && (
              <>
                <Link to="/jobs/manage" className="hover:underline">
                  Manage Jobs
                </Link>
                <Link to="/jobs/post" className="hover:underline">
                  Post Job
                </Link>
              </>
            )}

            {user.role === "seeker" && (
              <>
                <Link to="/jobs" className="hover:underline">
                  Find Jobs
                </Link>
                <Link to="/applications" className="hover:underline">
                  My Applications
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className="hover:underline text-red-400 ml-4"
              aria-label="Logout"
              type="button"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
