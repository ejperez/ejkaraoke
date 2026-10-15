import dotenv from "dotenv";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { SERVER_URL } from "../dist/config.js";
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
  const videos = videoFileMananger.getVideos({
    perPage: Number.MAX_SAFE_INTEGER,
    currentPage: 1,
  });

  assert.deepEqual(
    videoFileMananger.getVideos({ perPage: 2, currentPage: 1 }),
    videos.slice(0, 2),
  );
  assert.deepEqual(
    videoFileMananger.getVideos({ perPage: 2, currentPage: 2 }),
    videos.slice(2, 4),
  );
  assert.deepEqual(
    videoFileMananger.getVideos({
      perPage: 2,
      currentPage: Math.ceil(videos.length / 2) + 1,
    }),
    [],
  );
});

test("Can sort downloaded videos by title and creation date", async () => {
  const videos = videoFileMananger.getVideos({
    perPage: Number.MAX_SAFE_INTEGER,
    currentPage: 1,
    sortBy: "title",
  });
  assert.deepEqual(
    videoFileMananger.getVideos({
      perPage: Number.MAX_SAFE_INTEGER,
      currentPage: 1,
      sortBy: "title",
    }),
    videos,
  );

  const videosWithCreatedAt = await Promise.all(
    videos.map(async (video) => ({
      video,
      createdAt: (
        await fs.stat(
          path.join(
            DOWNLOAD_DIR,
            `${video.id}${VIDEO_DIR_DELIMITER}${video.channelName}`,
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
    videoFileMananger.getVideos({
      perPage: Number.MAX_SAFE_INTEGER,
      currentPage: 1,
    }),
    expectedCreatedAtOrder,
  );
  assert.deepEqual(
    videoFileMananger.getVideos({ perPage: 2, currentPage: 1 }),
    expectedCreatedAtOrder.slice(0, 2),
  );
});

test("Defaults omitted video query fields", () => {
  assert.deepEqual(
    videoFileMananger.getVideos(),
    videoFileMananger.getVideos({
      perPage: 10,
      currentPage: 1,
      sortBy: "createdAt",
    }),
  );
});

test("Can get video by ID", async () => {
  const testId = "dQw4w9WgXcQ";
  const video = videoFileMananger.getVideo(testId);

  assert.ok(video && video.id === testId);
  const scannedVideo = videoFileMananger
    .getVideos({ perPage: Number.MAX_SAFE_INTEGER })
    .find(({ id }) => id === testId);
  assert.ok(scannedVideo);
  const directoryName = `${testId}${VIDEO_DIR_DELIMITER}${scannedVideo.channelName}`;
  const fileName = `${scannedVideo.title}.mp4`;
  const filePath = new URL(
    `/static/downloads/${encodeURIComponent(directoryName)}/${encodeURIComponent(fileName)}`,
    SERVER_URL,
  ).toString();
  const { birthtimeMs: createdAt } = await fs.stat(
    path.join(DOWNLOAD_DIR, directoryName, fileName),
  );

  assert.deepEqual(video, {
    id: testId,
    channelName: scannedVideo.channelName,
    title: scannedVideo.title,
    filePath,
    createdAt,
  });
});
