import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/api";
import path from "path";
import compression from "compression";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongodbURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/realestate";

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 300,
});

// Middleware
app.use(limiter);
app.use(compression({ level: 6, threshold: "5kb" }));
app.use(cors());
app.use(express.json());

// Static file caching
const staticOptions = {
  maxAge: "30d",
  setHeaders: (res: express.Response) => {
    res.set("Cache-Control", "public, max-age=2592000");
  },
};

app.use(
  "/images",
  express.static(path.join(__dirname, "public/images"), staticOptions)
);
app.use(
  "/images/agents",
  express.static(path.join(__dirname, "public/images/agents"), staticOptions)
);

// Response time header
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on("finish", () => {
    const duration = process.hrtime(start);
    const ms = (duration[0] * 1e3 + duration[1] * 1e-6).toFixed(2);
    // Optionally: res.setHeader("X-Response-Time", `${ms}ms`);
  });
  next();
});

// Routes
app.use("/api", router);
app.set("etag", "strong");

// MongoDB and server start
const startServer = async () => {
  try {
    await mongoose.connect(mongodbURI, {
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      waitQueueTimeoutMS: 30000,
    });

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

startServer();
