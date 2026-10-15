import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { VIDEO_DIR_DELIMITER } from "../dist/VideoDownloader.js";
import VideoFileManager from "../dist/VideoFileManager.js";
import {
  generateImportedVideoId,
  importVideos,
} from "../scripts/import-videos.js";

async function withTempDirectory(callback) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "ejkaraoke-import-"));
  try {
    await callback(root);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
}

test("generates IDs with IMP prefix and YouTube-compatible characters", () => {
  const id = generateImportedVideoId();

  assert.match(id, /^IMP[A-Za-z0-9_-]{11}$/);
});

test("moves MP4 files into downloads with an empty channel name", async () => {
  await withTempDirectory(async (root) => {
    const source = path.join(root, "source");
    const downloads = path.join(root, "downloads");
    await fs.mkdir(source);
    await fs.writeFile(path.join(source, "Song.mp4"), "video content");
    await fs.writeFile(path.join(source, "notes.txt"), "not a video");

    const [imported] = await importVideos(
      source,
      downloads,
      () => "IMPabcdefghijk",
    );

    assert.deepEqual(imported, { id: "IMPabcdefghijk", fileName: "Song.mp4" });
    await assert.rejects(fs.stat(path.join(source, "Song.mp4")), {
      code: "ENOENT",
    });
    assert.equal(
      await fs.readFile(
        path.join(
          downloads,
          `IMPabcdefghijk${VIDEO_DIR_DELIMITER}`,
          "Song.mp4",
        ),
        "utf8",
      ),
      "video content",
    );

    const manager = new VideoFileManager(downloads);
    await manager.ready;
    assert.deepEqual(manager.getVideos(), [
      {
        id: "IMPabcdefghijk",
        channelName: "",
        title: "Song",
      },
    ]);
  });
});

test("retries IDs that collide with existing download entries", async () => {
  await withTempDirectory(async (root) => {
    const source = path.join(root, "source");
    const downloads = path.join(root, "downloads");
    await fs.mkdir(source);
    await fs.mkdir(downloads);
    await fs.mkdir(
      path.join(downloads, `IMPabcdefghijk${VIDEO_DIR_DELIMITER}ExistingChannel`),
    );
    await fs.writeFile(
      path.join(downloads, `IMPmnopqrstuvw${VIDEO_DIR_DELIMITER}`),
      "existing entry",
    );
    await fs.writeFile(path.join(source, "Song.mp4"), "video content");

    const ids = ["IMPabcdefghijk", "IMPmnopqrstuvw", "IMPABCDEFGHIJK"];
    const [imported] = await importVideos(source, downloads, () => ids.shift());

    assert.equal(imported.id, "IMPABCDEFGHIJK");
    assert.equal(
      await fs.readFile(
        path.join(
          downloads,
          `IMPABCDEFGHIJK${VIDEO_DIR_DELIMITER}`,
          "Song.mp4",
        ),
        "utf8",
      ),
      "video content",
    );
  });
});
