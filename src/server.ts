import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import VideoDownloader from "./VideoDownloader.js";
import VideoDownloadQueue from "./VideoDownloadQueue.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 0;
const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || "./downloads";
const FFMPEG_DIR = process.env.FFMPEG_DIR || "";

const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.use(express.json());

const videodownLoader = new VideoDownloader(DOWNLOAD_DIR, FFMPEG_DIR);
const videoDownloadQueue = new VideoDownloadQueue(videodownLoader);

// Web server
app.get("/", (req: Request, res: Response) => {
  res.send({
    status: "up",
    datetime: new Date(),
  });
});

app.post("/api/downloads", (req: Request, res: Response) => {
  const { videoId }: { videoId: string } = req.body;
  if (!videoId) return res.status(400).json({ error: "videoId is required" });

  videoDownloadQueue
    .getQueue()
    .push({ videoId })
    .on("finish", function (result) {
      console.log("Success", result);
      io.emit("download-finished", { videoId });
    })
    .on("failed", function (err) {
      console.error("Failure", err);
    });

  // Respond immediately with the Ticket/Job ID
  return res.status(202).json({
    message: "Download enqueued",
  });
});

// Web Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sync-event", (data) => {
    socket.broadcast.emit("sync-event", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("download-finished", ({ videoId }) => {
    console.log("Download finished:", videoId);
  });
});

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
