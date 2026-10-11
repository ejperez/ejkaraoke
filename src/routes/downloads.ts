import { Router } from "express";
import type { Server } from "socket.io";
import type VideoDownloadQueue from "../VideoDownloadQueue.js";

const createDownloadsRouter = (
  videoDownloadQueue: VideoDownloadQueue,
  io: Server,
) => {
  const router = Router();

  router.post("/", (req, res) => {
    const { id }: { id: string } = req.body;
    if (!id) return res.status(400).json({ error: "id is required" });

    videoDownloadQueue
      .getQueue()
      .push({ id })
      .on("finish", function (result) {
        console.log("Success", result);
        io.emit("sync-event", {
          action: "download-finished",
          payload: { id },
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
