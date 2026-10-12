import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { PORT } from "./config.js";
import { VIDEO_DIR_DELIMITER } from "./VideoDownloader.js";

export type VideoSortOrder = "title" | "createdAt";

export type VideoFile = {
  id: string;
  channelName: string;
  title: string;
};

export type VideoLocation = {
  id: string;
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

type GetVideosParam = {
  perPage?: number;
  currentPage?: number;
  sortBy?: VideoSortOrder;
  search?: string;
};

class VideoFileManager {
  #videos = new Map<string, StoredVideoFile>();
  readonly ready: Promise<void>;
  #getVideosMatchCount: number = 0;

  constructor(videoDirectory: string) {
    this.ready = this.#scan(videoDirectory);
  }

  getVideosMatchCount(): number {
    return this.#getVideosMatchCount;
  }

  getVideos({
    perPage = 10,
    currentPage = 1,
    sortBy = "createdAt",
    search = "",
  }: GetVideosParam = {}): VideoFile[] {
    let videos: VideoFile[] = Array.from(this.#videos.values())
      .sort((a, b) => {
        if (sortBy === "title") return compareVideoTitles(a, b);

        const createdAtDifference = b.createdAt - a.createdAt;
        return createdAtDifference || compareVideoTitles(a, b);
      })
      .map(({ id, channelName, title }) => ({
        id,
        channelName,
        title,
      }));

    const searchTerm = search.toLowerCase();
    if (search !== "") {
      videos = videos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchTerm) ||
          video.channelName.toLocaleLowerCase().includes(searchTerm),
      );
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
    this.#getVideosMatchCount = videos.length;
    return videos.slice(startIndex, startIndex + perPage);
  }

  getVideo(id: string): VideoLocation | undefined {
    const video = this.#videos.get(id);
    if (!video) return undefined;

    return { id: video.id, filePath: video.filePath };
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
        const [id = "", channelName = ""] =
          directory.name.split(VIDEO_DIR_DELIMITER);

        this.#videos.set(id, {
          id,
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
