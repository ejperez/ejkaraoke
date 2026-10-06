import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import type VideoDownloadQueue from "./VideoDownloadQueue.js";
import { corsOptions } from "./config.js";
import createDownloadsRouter from "./routes/downloads.js";
import healthRouter from "./routes/health.js";
import searchRouter from "./routes/search.js";
import registerSocketHandlers from "./socket.js";
import { DOWNLOAD_DIR } from "./config.js";

export const createApplication = (videoDownloadQueue: VideoDownloadQueue) => {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { cors: corsOptions });

  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(healthRouter);
  app.use("/api/downloads", createDownloadsRouter(videoDownloadQueue, io));
  app.use("/api/search", searchRouter);
  app.use("/static", express.static(DOWNLOAD_DIR));

  registerSocketHandlers(io);

  return { app, server, io };
};
