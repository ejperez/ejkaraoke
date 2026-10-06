import { readdir, unlink } from "node:fs/promises";
import path from "node:path";
import { VIDEO_DIR_DELIMITER } from "./VideoDownloader.js";

export type VideoFile = {
  videoId: string;
  channelName: string;
  filePath: string;
};

class VideoFileManager {
  #videos: VideoFile[] = [];

  getVideos() {
    return this.#videos;
  }

  getVideo(id: string): VideoFile | undefined {
    return this.#videos.filter((video) => video.videoId === id)[0];
  }

  async scan(videoDirectory: string): Promise<undefined> {
    const directories = await readdir(videoDirectory, {
      withFileTypes: true,
    });
    const videos: VideoFile[] = [];

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

        videos.push({ videoId, channelName, filePath });
      }
    }

    this.#videos = videos;
  }
}

export default VideoFileManager;
