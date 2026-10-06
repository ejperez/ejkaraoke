import { readdir, unlink } from "node:fs/promises";
import path from "node:path";
import { VIDEO_DIR_DELIMITER } from "./VideoDownloader.js";

export type VideoFile = {
  videoId: string;
  channelName: string;
  fileName: string;
};

type VideoFileIndex = {
  [key: string]: VideoFile;
};

class VideoFileManager {
  #videos: VideoFileIndex = {};

  getVideos(perPage?: number, currentPage?: number) {
    const videos = Object.values(this.#videos).sort((a, b) =>
      a.fileName.localeCompare(b.fileName, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );

    if (perPage === undefined && currentPage === undefined) return videos;
    if (perPage === undefined || currentPage === undefined) {
      throw new TypeError("perPage and currentPage must be provided together.");
    }
    if (
      !Number.isInteger(perPage) ||
      perPage < 1 ||
      !Number.isInteger(currentPage) ||
      currentPage < 1
    ) {
      throw new RangeError(
        "perPage and currentPage must be positive integers.",
      );
    }

    const startIndex = (currentPage - 1) * perPage;
    return videos.slice(startIndex, startIndex + perPage);
  }

  getVideo(id: string): VideoFile | undefined {
    return this.#videos[id];
  }

  async scan(videoDirectory: string): Promise<undefined> {
    this.#videos = {};

    const directories = await readdir(videoDirectory, {
      withFileTypes: true,
    });

    for (const directory of directories) {
      if (!directory.isDirectory()) continue;

      const directoryPath = path.join(videoDirectory, directory.name);

      const files = await readdir(directoryPath, { withFileTypes: true });

      for (const file of files) {
        if (
          !file.isFile() ||
          path.extname(file.name).toLowerCase() !== ".mp4"
        ) {
          continue;
        }

        const filePath = path.join(directoryPath, file.name);

        if (!directory.name.includes(VIDEO_DIR_DELIMITER)) {
          throw new Error(`Invalid directory name: ${filePath}`);
        }

        const [videoId = "", channelName = ""] =
          directory.name.split(VIDEO_DIR_DELIMITER);

        this.#videos[videoId] = { videoId, channelName, fileName: file.name };
      }
    }

    this.#videos = Object.fromEntries(
      Object.values(this.#videos)
        .sort((a, b) =>
          a.fileName.localeCompare(b.fileName, undefined, {
            numeric: true,
            sensitivity: "base",
          }),
        )
        .map((video) => [video.videoId, video]),
    );
  }
}

export default VideoFileManager;
