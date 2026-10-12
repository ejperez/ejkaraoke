import { Router, type Request, type Response } from "express";
import VideoFileManager, { type VideoSortOrder } from "../VideoFileManager.js";

function createSongsRouter(videoFileManager: VideoFileManager) {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    const search = req.query.search as string;
    const sortBy = req.query.sort as VideoSortOrder;
    const currentPage = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 10;

    await videoFileManager.ready;
    const results = videoFileManager.getVideos({
      perPage,
      currentPage,
      search,
      sortBy,
    });
    return res.send({
      data: results,
      max_pages: Math.ceil(videoFileManager.getVideosMatchCount() / perPage),
    });
  });

  return router;
}

export default createSongsRouter;
