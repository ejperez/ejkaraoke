import { Router } from "express";
import {
  getNextSearchPage,
  searchVideos,
} from "../services/youtubeSearch.js";

const router = Router();

router.get("/:q", async (req, res) => {
  const results = await searchVideos(req.params.q);
  return res.send(results);
});

router.post("/nextPage", async (req, res) => {
  const results = await getNextSearchPage(req.body.nextPage);
  return res.send(results);
});

export default router;
