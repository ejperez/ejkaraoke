import PlayerHome from "./PlayerHome";
import PlayerStatusBar from "./PlayerStatusBar";
import usePlayer from "../hooks/usePlayer";

export default function Player() {
  const { currentVideo, queue, playNextInQueue, videoPlayerRef } = usePlayer();
  const remoteLink = `${document.location.href}remote`;

  return (
    <div className="flex flex-col h-screen">
      <PlayerStatusBar
        currentVideo={currentVideo}
        queue={queue}
        remoteLink={remoteLink}
      />
      {currentVideo ? (
        <video
          src={currentVideo.filePath}
          autoPlay
          controls
          onEnded={playNextInQueue}
          ref={videoPlayerRef}
        />
      ) : (
        <PlayerHome remoteLink={remoteLink} />
      )}
    </div>
  );
}
