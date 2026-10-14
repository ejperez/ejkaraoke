import PlayerHome from "./PlayerHome";
import PlayerStatusBar from "./PlayerStatusBar";
import PlayerError from "./PlayerError";
import usePlayer from "../hooks/usePlayer";

export default function Player() {
  const {
    currentVideo,
    queue,
    hasError,
    playNextInQueue,
    handleOnError,
    handleSkip,
  } = usePlayer();
  const remoteLink = `${document.location.href}remote`;

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
        <video
          src={currentVideo.filePath}
          autoPlay
          onEnded={playNextInQueue}
          onError={handleOnError}
        />
      ) : (
        <PlayerHome remoteLink={remoteLink} />
      )}
    </div>
  );
}
