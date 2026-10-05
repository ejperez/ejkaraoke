import assert from "node:assert/strict";
import test from "node:test";
import VideoDownloader from "../dist/VideoDownloader.js";
import dotenv from "dotenv";

dotenv.config();

const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || "./downloads";
const FFMPEG_DIR = process.env.FFMPEG_DIR || null;

test("Can download a video", async () => {
  const videoDownloader = new VideoDownloader(DOWNLOAD_DIR, FFMPEG_DIR);
  const downloadedFile = await videoDownloader.download({
    videoId: "dQw4w9WgXcQ",
  });

  assert.ok(
    downloadedFile &&
      downloadedFile.includes(
        "Rick Astley - Never Gonna Give You Up (Official Video)",
      ),
  );
});
