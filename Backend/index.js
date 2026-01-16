const dotenv = require('dotenv');
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./connection");

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const jobRoutes = require("./routes/jobRoutes");
const jobCategoryRoutes = require("./routes/jobCategoryRouters");
const studentRoutes = require("./routes/studentRoutes");

dotenv.config();
const app = express();

// Middleware 
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174','https://jobportal-cloud.vercel.app'], 
  credentials: true,
}));

app.use(express.json({ limit: "50mb" })); // parse JSON
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // parse form data

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/job-categories", jobCategoryRoutes);
app.use("/api/student", studentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on port ${PORT}`);
});
