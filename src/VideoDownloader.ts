import { YtDlp } from "ytdlp-nodejs";
import { VIDEO_DIR_DELIMITER } from "./video-constants.js";
import type { Downloader, VideoDownloaderInput } from "./types/Downloader.js";

const ytdlp = new YtDlp();

export { VIDEO_DIR_DELIMITER };

class VideoDownloader implements Downloader {
  downloadDirectory: string;

  constructor(
    downloadDirectory: string,
    ffmpegDirectory: string = "",
    binaryPath: string = "",
  ) {
    this.downloadDirectory = downloadDirectory;
    ytdlp.ffmpegPath = ffmpegDirectory;
    ytdlp.binaryPath = binaryPath;
  }

  async download(input: VideoDownloaderInput) {
    const { id, quality = "720p" } = input;

    try {
      const result = await ytdlp
        .download(`https://youtube.com/watch?v=${id}`)
        .format({ filter: "mergevideo", quality, type: "mp4" })
        .output(
          `${this.downloadDirectory}/%(id)s${VIDEO_DIR_DELIMITER}%(channel)s`,
        )
        .on("progress", (p) => console.log(`${p.percentage_str}`))
        .run();

      const filePath = result.filePaths[0];
      if (!filePath) return undefined;

      return {
        id,
        filePath,
      };
    } catch (e) {
      console.error(e);
    }
  }
}

export default VideoDownloader;
