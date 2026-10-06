import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.send({
    status: "up",
    datetime: new Date(),
  });
});

export default router;
