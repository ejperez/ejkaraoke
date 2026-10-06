import PlayerFrame from "./PlayerFrame";
import PlayerHome from "./PlayerHome";
import PlayerStatusBar from "./PlayerStatusBar";
import PlayerError from "./PlayerError";
import usePlayerQueue from "../hooks/usePlayerQueue";
import usePlayerSync from "../hooks/usePlayerSync";

export default function Player() {
  const {
    currentVideo,
    setCurrentVideo,
    queue,
    setQueue,
    hasError,
    setHasError,
    queueRef,
    currentVideoRef,
    playNextInQueue,
    handleOnError,
    handleSkip,
  } = usePlayerQueue();
  const { handleOnReady, handleStateChange } = usePlayerSync({
    queue,
    currentVideo,
    setCurrentVideo,
    setQueue,
    queueRef,
    currentVideoRef,
    setHasError,
  });
  const remoteLink = `${document.location.href}/remote`;

  return (
    <div className="flex flex-col h-screen">
      <PlayerStatusBar
        currentVideo={currentVideo}
        queue={queue}
        remoteLink={remoteLink}
      />
      {hasError ? (
        <PlayerError video={currentVideo} onSkip={handleSkip} />
      ) : currentVideo ? (
        <>
          <PlayerFrame
            videoID={currentVideo.id}
            onEnd={playNextInQueue}
            onError={handleOnError}
            onReady={handleOnReady}
            onStateChange={handleStateChange}
          />
        </>
      ) : (
        <PlayerHome remoteLink={remoteLink} />
      )}
    </div>
  );
}
