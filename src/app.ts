import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import type VideoDownloadQueue from "./VideoDownloadQueue.js";
import type VideoFileManager from "./VideoFileManager.js";
import { corsOptions } from "./config.js";
import createDownloadsRouter from "./routes/downloads.js";
import createSongsRouter from "./routes/songs.js";
import healthRouter from "./routes/health.js";
import searchRouter from "./routes/search.js";
import registerSocketHandlers from "./socket.js";
import { DOWNLOAD_DIR } from "./config.js";

export const createApplication = (
  videoDownloadQueue: VideoDownloadQueue,
  videoFileManager: VideoFileManager,
) => {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { cors: corsOptions });

  app.use(express.json());
  app.use(cors(corsOptions));

  app.use(healthRouter);
  app.use("/api/downloads", createDownloadsRouter(videoDownloadQueue, io));
  app.use("/api/search", searchRouter);
  app.use("/api/songs", createSongsRouter(videoFileManager));
  app.use("/static/downloads", express.static(DOWNLOAD_DIR));

  registerSocketHandlers(io, videoFileManager);

  return { app, server, io };
};
