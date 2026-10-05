// ytdlp-nodejs doesn't export this type
export type VideoQuality =
  | "best"
  | "2160p"
  | "1440p"
  | "1080p"
  | "720p"
  | "480p"
  | "360p"
  | "240p"
  | "144p"
  | "highest"
  | "lowest";

export interface Downloader {
  download: (
    input: VideoDownloaderInput,
  ) => Promise<VideoDownloaderOutput | undefined>;
}

export type VideoDownloaderInput = {
  videoId: string;
  quality?: VideoQuality;
};

export type VideoDownloaderOutput = {
  videoId: string;
  filePath: string;
};
