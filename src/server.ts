import VideoDownloader from "./VideoDownloader.js";
import VideoDownloadQueue from "./VideoDownloadQueue.js";
import VideoFileManager from "./VideoFileManager.js";
import { createApplication } from "./app.js";
import { DOWNLOAD_DIR, FFMPEG_DIR, YTDLP_BINARY, PORT } from "./config.js";

const videoDownloader = new VideoDownloader(
  DOWNLOAD_DIR,
  FFMPEG_DIR,
  YTDLP_BINARY,
);
const videoDownloadQueue = new VideoDownloadQueue(videoDownloader);
const videoFileManager = new VideoFileManager(DOWNLOAD_DIR);
await videoFileManager.ready;
const { server } = createApplication(videoDownloadQueue, videoFileManager);

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
