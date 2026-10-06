import { YtDlp } from "ytdlp-nodejs";
import type { Downloader, VideoDownloaderInput } from "./types/Downloader.js";

const ytdlp = new YtDlp();

export const VIDEO_DIR_DELIMITER = "[^_-]";

class VideoDownloader implements Downloader {
  downloadDirectory: string;

  constructor(downloadDirectory: string, ffmpegDirectory: string = "") {
    this.downloadDirectory = downloadDirectory;
    ytdlp.ffmpegPath = ffmpegDirectory;
  }

  async download(input: VideoDownloaderInput) {
    const { videoId, quality = "720p" } = input;

    const result = await ytdlp
      .download(`https://youtube.com/watch?v=${videoId}`)
      .format({ filter: "mergevideo", quality, type: "mp4" })
      .output(
        `${this.downloadDirectory}/%(id)s${VIDEO_DIR_DELIMITER}%(channel)s`,
      )
      .on("progress", (p) => console.log(`${p.percentage_str}`))
      .run();

    const filePath = result.filePaths[0];
    if (!filePath) return undefined;

    return {
      videoId,
      filePath,
    };
  }
}

export default VideoDownloader;
