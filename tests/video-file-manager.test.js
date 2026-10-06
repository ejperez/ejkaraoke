import dotenv from "dotenv";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import VideoFileManager from "../dist/VideoFileManager.js";

dotenv.config();

const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || "./downloads";

async function isDirectoryEmpty(dirPath) {
  try {
    const dir = await fs.opendir(dirPath);
    const entry = await dir.read();
    await dir.close();

    return entry === null;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("Directory does not exist.");
    } else {
      console.error("An error occurred:", error.message);
    }

    return false;
  }
}

const isEmpty = await isDirectoryEmpty(DOWNLOAD_DIR);

if (isEmpty) {
  assert.fail("Downloads directory is empty.");
}

const videoFileMananger = new VideoFileManager();
await videoFileMananger.scan(DOWNLOAD_DIR);

test("Can scan downloaded videos", async () => {
  const videos = videoFileMananger.getVideos();

  console.log(videos);

  assert.ok(videos && videos.length > 0);
});

test("Can get video by ID", async () => {
  const testId = "dQw4w9WgXcQ";
  const video = videoFileMananger.getVideo(testId);

  console.log(video);

  assert.ok(video && video.videoId === testId);
});
