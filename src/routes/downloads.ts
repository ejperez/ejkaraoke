import { Router } from "express";
import type { Server } from "socket.io";
import type VideoDownloadQueue from "../VideoDownloadQueue.js";

const createDownloadsRouter = (
  videoDownloadQueue: VideoDownloadQueue,
  io: Server,
) => {
  const router = Router();

  router.post("/", (req, res) => {
    const { videoId }: { videoId: string } = req.body;
    if (!videoId) return res.status(400).json({ error: "videoId is required" });

    videoDownloadQueue
      .getQueue()
      .push({ videoId })
      .on("finish", function (result) {
        console.log("Success", result);
        io.emit("sync-event", {
          action: "download-finished",
          payload: { videoId },
        });
      })
      .on("failed", function (err) {
        console.error("Failure", err);
      });

    return res.status(202).json({
      message: "Download enqueued",
    });
  });

  return router;
};

export default createDownloadsRouter;
