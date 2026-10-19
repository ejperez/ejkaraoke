import YouTube from "react-youtube";
import { NO_DOWNLOADS } from "../util/config";

function YTPlayer({
  videoPlayerRef,
  currentVideo,
  setHasError,
  broadcastPlayerStatus,
}) {
  const opts = {
    height: "1280",
    width: "720",
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
      enablejsapi: 1,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      playsinline: 1,
      cc_load_policy: 3,
    },
  };

  return (
    <YouTube
      className="w-screen h-screen"
      videoId={currentVideo.id}
      opts={opts}
      iframeClassName="h-full w-full"
      onStateChange={(event) => {
        switch (event.data) {
          case 0:
            setIsShowingScore(true);
            break;
        }

        broadcastPlayerStatus();

        // Turn off subtitles by force
        if (typeof event.target.unloadModule === "function") {
          event.target.unloadModule("captions");
          event.target.unloadModule("cc");
        }
      }}
      onError={() => {
        setHasError(true);
      }}
      onReady={(e) => {
        videoPlayerRef.current = e.target;
      }}
    />
  );
}

export default function PlayerFrame({
  currentVideo,
  videoPlayerRef,
  setIsShowingScore,
  setHasError,
  broadcastPlayerStatus,
}) {
  if (NO_DOWNLOADS) {
    return (
      <YTPlayer
        {...{
          currentVideo,
          setHasError,
          broadcastPlayerStatus,
          videoPlayerRef,
        }}
      />
    );
  } else
    return (
      <video
        src={currentVideo.filePath}
        autoPlay
        className="h-full w-full"
        controls
        onPlay={() => {
          broadcastPlayerStatus();
        }}
        onPause={() => {
          broadcastPlayerStatus();
        }}
        onEnded={() => {
          broadcastPlayerStatus();
          setIsShowingScore(true);
        }}
        ref={videoPlayerRef}
      />
    );
}
