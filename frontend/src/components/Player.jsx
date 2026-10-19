import PlayerHome from "./PlayerHome";
import PlayerStatusBar from "./PlayerStatusBar";
import usePlayer from "../hooks/usePlayer";
import PlayerScore from "./PlayerScore";
import PlayerFrame from "./PlayerFrame";
import PlayerError from "./PlayerError";

export default function Player() {
  const {
    currentVideo,
    queue,
    videoPlayerRef,
    isShowingScore,
    hasError,
    playNextInQueue,
    setIsShowingScore,
    setHasError,
    handleSkip,
    broadcastPlayerStatus,
  } = usePlayer();
  const remoteLink = `${document.location.href}remote`;

  return (
    <div className="flex flex-col h-screen">
      {isShowingScore ? (
        <PlayerScore callback={playNextInQueue} />
      ) : currentVideo ? (
        <>
          <PlayerStatusBar
            currentVideo={currentVideo}
            queue={queue}
            remoteLink={remoteLink}
          />

          {hasError ? (
            <PlayerError video={currentVideo} onSkip={handleSkip} />
          ) : (
            <div className="flex-1 overflow-hidden">
              <PlayerFrame
                {...{
                  currentVideo,
                  videoPlayerRef,
                  setIsShowingScore,
                  setHasError,
                  broadcastPlayerStatus,
                }}
              />
            </div>
          )}
        </>
      ) : (
        <PlayerHome remoteLink={remoteLink} />
      )}
    </div>
  );
}
