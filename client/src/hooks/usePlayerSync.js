import { useEffect, useRef } from "react";
import { socket } from "../util/socket";

export default function usePlayerSync({
  playerID,
  queue,
  currentVideo,
  setCurrentVideo,
  setQueue,
  queueRef,
  currentVideoRef,
  setHasError,
}) {
  const playerInstance = useRef(null);

  const broadcastQueue = () => {
    socket.emit("sync-event", {
      action: "current-queue",
      payload: {
        playerID: playerID,
        queue: queueRef.current,
        currentVideo: currentVideoRef.current,
      },
    });
  };

  const handleOnReady = (e) => {
    playerInstance.current = e.target;
  };

  const handleStateChange = () => {
    socket.emit("sync-event", {
      action: "player-status-changed",
      payload: {
        playerID: playerID,
        isPlaying:
          playerInstance.current.getPlayerState() ===
          window.YT.PlayerState.PLAYING,
      },
    });
  };

  // Broadcast queue and current video to server
  useEffect(() => {
    broadcastQueue();
  }, [queue, currentVideo, playerID]);

  // Handle sync events from server
  useEffect(() => {
    socket.on("sync-event", (data) => {
      console.log(data);

      switch (data.action) {
        case "play-video":
          setCurrentVideo(data.payload.video);
          setHasError(false);
          break;
        case "add-to-queue": {
          const queueIds = queueRef.current.map((item) => item.id);

          if (queueIds.includes(data.payload.video.id)) {
            return;
          }

          setQueue((queue) => [...queue, data.payload.video]);
          break;
        }
        case "get-queue":
          broadcastQueue();
          break;
        case "remove-from-queue":
          setQueue((queue) =>
            queue.filter((item) => item.id !== data.payload.video.id),
          );
          break;
        case "restart-current-video":
          playerInstance.current?.seekTo(0);
          playerInstance.current?.playVideo();
          break;
        case "pause-current-video":
          playerInstance.current?.pauseVideo();
          break;
        case "play-current-video":
          playerInstance.current?.playVideo();
          broadcastQueue();
          break;
        // case "get-player-state":
        //   handleStateChange();
        //   break;
      }
    });

    return () => {
      socket.off("sync-event");
    };
  }, []);

  return {
    handleOnReady,
    handleStateChange,
  };
}
