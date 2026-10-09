import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { PORT } from "./config.js";
import { VIDEO_DIR_DELIMITER } from "./VideoDownloader.js";

type VideoSortOrder = "title" | "createdAt";

export type VideoFile = {
  videoId: string;
  channelName: string;
  title: string;
};

export type VideoLocation = {
  videoId: string;
  filePath: string;
};

const compareVideoTitles = (a: VideoFile, b: VideoFile) =>
  a.title.localeCompare(b.title, undefined, {
    numeric: true,
    sensitivity: "base",
  });

type StoredVideoFile = VideoFile & {
  filePath: string;
  createdAt: number;
};

class VideoFileManager {
  #videos = new Map<string, StoredVideoFile>();
  readonly ready: Promise<void>;

  constructor(videoDirectory: string) {
    this.ready = this.#scan(videoDirectory);
  }

  getVideos(
    perPage?: number,
    currentPage?: number,
    sortBy: VideoSortOrder = "createdAt",
  ) {
    if (sortBy !== "title" && sortBy !== "createdAt") {
      throw new TypeError('sortBy must be "title" or "createdAt".');
    }

    const videos = Array.from(this.#videos.values())
      .sort((a, b) => {
        if (sortBy === "title") return compareVideoTitles(a, b);

        const createdAtDifference = b.createdAt - a.createdAt;
        return createdAtDifference || compareVideoTitles(a, b);
      })
      .map(({ videoId, channelName, title }) => ({
        videoId,
        channelName,
        title,
      }));

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

  getVideo(id: string): VideoLocation | undefined {
    const video = this.#videos.get(id);
    if (!video) return undefined;

    return { videoId: video.videoId, filePath: video.filePath };
  }

  async #scan(videoDirectory: string): Promise<void> {
    this.#videos.clear();

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

        const filePath = path.resolve(directoryPath, file.name);
        const videoUrl = new URL(
          `/static/downloads/${encodeURIComponent(directory.name)}/${encodeURIComponent(file.name)}`,
          `http://localhost:${PORT}`,
        ).toString();

        if (!directory.name.includes(VIDEO_DIR_DELIMITER)) {
          throw new Error(`Invalid directory name: ${filePath}`);
        }

        const fileStats = await stat(filePath);
        const [videoId = "", channelName = ""] =
          directory.name.split(VIDEO_DIR_DELIMITER);

        this.#videos.set(videoId, {
          videoId,
          channelName,
          title: path.parse(file.name).name,
          filePath: videoUrl,
          createdAt: fileStats.birthtimeMs,
        });
      }
    }
  }
}

export default VideoFileManager;
