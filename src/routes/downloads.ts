import { Router } from "express";
import type { Server } from "socket.io";
import type VideoDownloadQueue from "../VideoDownloadQueue.js";
import type VideoFileManager from "../VideoFileManager.js";

const createDownloadsRouter = (
  videoDownloadQueue: VideoDownloadQueue,
  videoFileManager: VideoFileManager,
  io: Server,
) => {
  const router = Router();

  router.post("/", (req, res) => {
    const {
      id,
      add_to_queue: addToQueue,
    }: { id: string; add_to_queue?: boolean } = req.body;
    if (!id) return res.status(400).json({ error: "id is required" });

    videoDownloadQueue
      .getQueue()
      .push({ id })
      .on("finish", async function (result) {
        io.emit("sync-event", {
          action: "download-finished",
          payload: { id },
        });

        await videoFileManager.scan();

        if (addToQueue) {
          const video = videoFileManager.getVideo(id);

          io.emit("sync-event", {
            action: "add-to-queue",
            payload: { video },
          });
        }
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
