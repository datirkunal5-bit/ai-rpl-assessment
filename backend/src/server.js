import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { db } from "./services/storage/database.js";
import apiRoutes from "./routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend dev server
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve uploaded files statically
const uploadsDir = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsDir));

// Mount main API
app.use("/api", apiRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "RPL Assist API Service - AI-Assisted Recognition of Prior Learning Platform",
    documentation: "/api/health",
    targetTrade: "ELECTRICIAN (NSQF Level 4)",
    rolesSupported: ["WORKER", "ASSESSOR", "ADMIN"]
  });
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "An unexpected internal server error occurred"
  });
});

async function startServer() {
  try {
    await db.init(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  RPL Assist Backend Service Running on Port ${PORT}`);
      console.log(`  Target Trade: ELECTRICIAN (QP: ELE/Q1401)`);
      console.log(`  API Base: http://localhost:${PORT}/api`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error("Failed to start RPL Assist server:", error);
    process.exit(1);
  }
}

startServer();
