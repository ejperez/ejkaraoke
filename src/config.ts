import dotenv from "dotenv";
import type { CorsOptions } from "cors";

dotenv.config();

export const PORT = process.env.PORT || 0;
export const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || "./downloads";
export const FFMPEG_DIR = process.env.FFMPEG_DIR || "";

export const corsOptions: CorsOptions = {
  origin: process.env.ALLOWED_ORIGINS || "*",
  methods: ["GET", "POST"],
};
