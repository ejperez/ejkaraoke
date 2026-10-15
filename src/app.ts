import cors from "cors";
import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import type VideoDownloadQueue from "./VideoDownloadQueue.js";
import type VideoFileManager from "./VideoFileManager.js";
import { corsOptions, DOWNLOAD_DIR } from "./config.js";
import createDownloadsRouter from "./routes/downloads.js";
import searchRouter from "./routes/search.js";
import createSongsRouter from "./routes/songs.js";
import registerSocketHandlers from "./socket.js";

export const createApplication = (
  videoDownloadQueue: VideoDownloadQueue,
  videoFileManager: VideoFileManager,
) => {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { cors: corsOptions });
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.json());
  app.use(cors(corsOptions));

  app.get("/remote", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "remote.html"));
  });
  app.use(
    "/api/downloads",
    createDownloadsRouter(videoDownloadQueue, videoFileManager, io),
  );
  app.use("/api/search", searchRouter);
  app.use("/api/songs", createSongsRouter(videoFileManager));
  app.use("/static/downloads", express.static(DOWNLOAD_DIR));
  app.use("/", express.static("./frontend/dist"));

  registerSocketHandlers(io, videoFileManager);

  return { app, server, io };
};
