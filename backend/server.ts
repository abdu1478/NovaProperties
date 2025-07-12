import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/api";
import path from "path";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cluster from "cluster";
import os from "os";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongodbURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/realestate";
const isProduction = process.env.NODE_ENV === "production";

// Cluster mode for production
if (isProduction && cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(
    `Primary ${process.pid} is running. Forking ${numCPUs} workers...`
  );

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 300, // limit each IP to 300 requests per windowMs
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
      res.set("Cache-Control", "public, max-age=2592000"); // 30 days
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
      // res.setHeader("X-Response-Time", `${ms}ms`);
    });
    next();
  });

  // API Routes
  app.use("/api", router);

  // ETag support for caching
  app.set("etag", "strong");

  // MongoDB connection
  mongoose.connect(mongodbURI1, {
    maxPoolSize: 10,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    waitQueueTimeoutMS: 30000,
  });

  const db = mongoose.connection;

  db.on("connected", () => {
    console.log("MongoDB connected successfully");
  });

  db.on("error", (err) => {
    console.error("MongoDB connection error:", err);
    if (!isProduction) process.exit(1);
  });

  db.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`Server ${process.pid} running on http://localhost:${PORT}`);
    });
  });
}
