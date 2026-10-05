import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import VideoDownloader from "./VideoDownloader.js";
import VideoDownloadQueue from "./VideoDownloadQueue.js";

dotenv.config();

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 0;
const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || "./downloads";
const FFMPEG_DIR = process.env.FFMPEG_DIR || "";

const app = express();
const videodownLoader = new VideoDownloader(DOWNLOAD_DIR, FFMPEG_DIR);
const videoDownloadQueue = new VideoDownloadQueue(videodownLoader);

app.use(express.json());

// Routes
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
    })
    .on("failed", function (err) {
      console.error("Failure", err);
    });

  // Respond immediately with the Ticket/Job ID
  return res.status(202).json({
    message: "Download enqueued",
  });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
