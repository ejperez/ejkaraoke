import dotenv from "dotenv";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { VIDEO_DIR_DELIMITER } from "../dist/VideoDownloader.js";
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

const videoFileMananger = new VideoFileManager(DOWNLOAD_DIR);
await videoFileMananger.ready;

test("Can scan downloaded videos", async () => {
  const videos = videoFileMananger.getVideos();

  console.log(videos);

  assert.ok(videos && videos.length > 0);
  assert.ok(
    videos.every((video) => !video.title.toLowerCase().endsWith(".mp4")),
  );
});

test("Can paginate downloaded videos", () => {
  const videos = videoFileMananger.getVideos();

  assert.deepEqual(videoFileMananger.getVideos(2, 1), videos.slice(0, 2));
  assert.deepEqual(videoFileMananger.getVideos(2, 2), videos.slice(2, 4));
  assert.deepEqual(
    videoFileMananger.getVideos(2, Math.ceil(videos.length / 2) + 1),
    [],
  );
});

test("Can sort downloaded videos by title and creation date", async () => {
  const videos = videoFileMananger.getVideos(undefined, undefined, "title");
  assert.deepEqual(
    videoFileMananger.getVideos(undefined, undefined, "title"),
    videos,
  );

  const videosWithCreatedAt = await Promise.all(
    videos.map(async (video) => ({
      video,
      createdAt: (
        await fs.stat(
          path.join(
            DOWNLOAD_DIR,
            `${video.videoId}${VIDEO_DIR_DELIMITER}${video.channelName}`,
            `${video.title}.mp4`,
          ),
        )
      ).birthtimeMs,
    })),
  );
  const expectedCreatedAtOrder = videosWithCreatedAt
    .sort(
      (a, b) =>
        b.createdAt - a.createdAt ||
        a.video.title.localeCompare(b.video.title, undefined, {
          numeric: true,
          sensitivity: "base",
        }),
    )
    .map(({ video }) => video);

  assert.deepEqual(
    videoFileMananger.getVideos(undefined, undefined),
    expectedCreatedAtOrder,
  );
  assert.deepEqual(
    videoFileMananger.getVideos(2, 1),
    expectedCreatedAtOrder.slice(0, 2),
  );
});

test("Can get video by ID", async () => {
  const testId = "dQw4w9WgXcQ";
  const video = videoFileMananger.getVideo(testId);

  console.log(video);

  assert.ok(video && video.videoId === testId);
  assert.deepEqual(Object.keys(video).sort(), ["filePath", "videoId"]);
  const scannedVideo = videoFileMananger
    .getVideos()
    .find(({ videoId }) => videoId === testId);
  assert.ok(scannedVideo);
  const directoryName = `${testId}${VIDEO_DIR_DELIMITER}${scannedVideo.channelName}`;
  const fileName = `${scannedVideo.title}.mp4`;
  assert.equal(
    video.filePath,
    new URL(
      `/static/downloads/${encodeURIComponent(directoryName)}/${encodeURIComponent(fileName)}`,
      `http://localhost:${process.env.PORT || 3000}`,
    ).toString(),
  );
});
