import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";
import { Property } from "../models/model";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient.connect(); // Must be awaited during app startup in production

export const cacheMiddleware = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next();

    const key = req.originalUrl;

    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        res.setHeader("X-Cache", "HIT");
        return res.json(JSON.parse(cachedData));
      }

      res.setHeader("X-Cache", "MISS");

      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        redisClient
          .setEx(key, duration, JSON.stringify(body))
          .catch(console.error);
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error("Cache middleware error:", err);
      next();
    }
  };
};

export const prewarmCache = async () => {
  try {
    const featured = await Property.find().limit(4).lean();
    await redisClient.setEx(
      "/api/properties/featured",
      300,
      JSON.stringify(featured)
    );
    console.log("Cache pre-warmed successfully");
  } catch (err) {
    console.error("Cache pre-warm failed:", err);
  }
};
