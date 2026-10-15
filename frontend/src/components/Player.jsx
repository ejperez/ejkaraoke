import PlayerHome from "./PlayerHome";
import PlayerStatusBar from "./PlayerStatusBar";
import usePlayer from "../hooks/usePlayer";

export default function Player() {
  const { currentVideo, queue, playNextInQueue, videoPlayerRef } = usePlayer();
  const remoteLink = `${document.location.href}remote`;

  return (
    <div className="flex flex-col h-screen">
      {currentVideo && (
        <PlayerStatusBar
          currentVideo={currentVideo}
          queue={queue}
          remoteLink={remoteLink}
        />
      )}
      {currentVideo ? (
        <div className="flex justify-center items-center h-full">
          <video
            src={currentVideo.filePath}
            autoPlay
            controls
            onEnded={playNextInQueue}
            ref={videoPlayerRef}
          />
        </div>
      ) : (
        <PlayerHome remoteLink={remoteLink} />
      )}
    </div>
  );
}
