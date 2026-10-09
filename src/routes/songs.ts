import { Router } from "express";
import VideoFileManager from "../VideoFileManager.js";

function createSongsRouter(videoFileMananger: VideoFileManager) {
  const router = Router();

  router.get("/", async (_, res) => {
    const PER_PAGE = 10;

    await videoFileMananger.ready;
    const results = videoFileMananger.getVideos(PER_PAGE, 1);
    return res.send({
      data: results,
      max_pages: Math.ceil(videoFileMananger.getVideos().length / PER_PAGE),
    });
  });

  return router;
}

export default createSongsRouter;
