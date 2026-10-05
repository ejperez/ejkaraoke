import Queue from "better-queue";
import type { Downloader, VideoDownloaderInput } from "./types/Downloader.js";

class VideoDownloadQueue {
  downloader: Downloader;
  queue: Queue;

  constructor(downloader: Downloader) {
    this.downloader = downloader;
    this.queue = this.#createQueue();
  }

  getQueue() {
    return this.queue;
  }

  #createQueue() {
    return new Queue(
      async (input: VideoDownloaderInput, cb) => {
        const { videoId } = input;

        console.log(`[Worker] Starting download: ${videoId}`);
        const output = await this.downloader.download({ videoId });

        try {
          cb(null, output);
        } catch (error: any) {
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error("An unexpected error occurred:", String(error));
          }
          cb(error);
        }
      },
      {
        // Configuration options
        concurrent: 1,
        maxRetries: 3,
        retryDelay: 5000,
      },
    );
  }
}

export default VideoDownloadQueue;
