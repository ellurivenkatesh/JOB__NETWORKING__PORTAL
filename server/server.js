const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
// Serve uploaded images statically from /uploads URL path
app.use("/uploads", express.static("uploads"));


// ===== ROUTES =====
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const jobRoutes = require("./routes/jobRoutes");
const postRoutes = require("./routes/postRoutes");

// ===== USE ROUTES =====
app.use("/api/auth", authRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/posts", postRoutes); // simplified require()
app.use("/resumes", express.static(path.join(__dirname, "uploads/resumes")));


// ===== DB CONNECTION =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error", err));

// ===== SERVER START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
