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
  id: string;
  quality?: VideoQuality;
};

export type VideoDownloaderOutput = {
  id: string;
  filePath: string;
};
