import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Navbar from "./components/Navbar";
import Posts from "./pages/Posts";
import ManageJobs from "./pages/ManageJobs";
import JobPost from "./pages/JobPost";
import JobSearch from "./pages/JobSearch"; 
import MyApplications from "./pages/MyApplications"; 

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const RecruiterRoute = ({ isAuthenticated, user, children }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "recruiter") return <Navigate to="/posts" replace />;
  return children;
};

const SeekerRoute = ({ isAuthenticated, user, children }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "seeker") return <Navigate to="/posts" replace />;
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
      try {
        setUser(JSON.parse(localStorage.getItem("user")));
      } catch {
        setUser(null);
      }
    };
    syncAuth(); 
    window.addEventListener("storage", syncAuth); 
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/posts" replace /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/login"
          element={
            <Login
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
            />
          }
        />
        <Route path="/register" element={<Register />} />

        <Route
          path="/posts"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Posts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/manage"
          element={
            <RecruiterRoute isAuthenticated={isAuthenticated} user={user}>
              <ManageJobs />
            </RecruiterRoute>
          }
        />
        <Route
          path="/jobs/post"
          element={
            <RecruiterRoute isAuthenticated={isAuthenticated} user={user}>
              <JobPost />
            </RecruiterRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <SeekerRoute isAuthenticated={isAuthenticated} user={user}>
              <JobSearch />
            </SeekerRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <SeekerRoute isAuthenticated={isAuthenticated} user={user}>
              <MyApplications />
            </SeekerRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
