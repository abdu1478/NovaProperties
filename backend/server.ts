import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/api";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongodbURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/realestate";

app.use(cors());
app.use(express.json());

app.use("/images", express.static("images"));
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(
  "/images/agents",
  express.static(path.join(__dirname, "public/images/agents"))
);

app.use("/api", router);

mongoose.connect(mongodbURI);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("MongoDB connected successfully", db.collection);
});

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

db.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
