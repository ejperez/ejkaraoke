import PlayerHome from "./PlayerHome";
import PlayerStatusBar from "./PlayerStatusBar";
import usePlayer from "../hooks/usePlayer";
import PlayerScore from "./PlayerScore";

export default function Player() {
  const {
    currentVideo,
    queue,
    videoPlayerRef,
    isShowingScore,
    playNextInQueue,
    setIsShowingScore,
  } = usePlayer();
  const remoteLink = `${document.location.href}remote`;

  return (
    <div className="flex flex-col min-h-screen justify-center">
      {isShowingScore ? (
        <PlayerScore callback={playNextInQueue} />
      ) : currentVideo ? (
        <>
          <PlayerStatusBar
            currentVideo={currentVideo}
            queue={queue}
            remoteLink={remoteLink}
          />
          <div className="h-[calc(100vh-28px)]">
            <video
              src={currentVideo.filePath}
              autoPlay
              className="h-full w-full"
              controls
              onEnded={() => {
                setIsShowingScore(true);
              }}
              ref={videoPlayerRef}
            />
          </div>
        </>
      ) : (
        <PlayerHome remoteLink={remoteLink} />
      )}
    </div>
  );
}
