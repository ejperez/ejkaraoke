import VideoDownloader from "./VideoDownloader.js";
import VideoDownloadQueue from "./VideoDownloadQueue.js";
import { createApplication } from "./app.js";
import { DOWNLOAD_DIR, FFMPEG_DIR, PORT } from "./config.js";

const videoDownloader = new VideoDownloader(DOWNLOAD_DIR, FFMPEG_DIR);
const videoDownloadQueue = new VideoDownloadQueue(videoDownloader);
const { server } = createApplication(videoDownloadQueue);

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
