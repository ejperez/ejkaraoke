import { useEffect, useState } from "react";
import { emitEvent, socket } from "../util/socket";

export default function useRemoteQueue() {
  const [currentQueue, setCurrentQueue] = useState([]);
  const [isQueueLoading, setIsQueueLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playerIsPlaying, setPlayerIsPlaying] = useState(null);

  useEffect(() => {
    socket.on("sync-event", (data) => {
      console.log(data);

      switch (data.action) {
        case "current-queue":
          setCurrentQueue(data.payload.queue);
          setCurrentVideo(data.payload.currentVideo);
          setIsQueueLoading(false);

          break;
        case "player-status-changed":
          setPlayerIsPlaying(data.payload.isPlaying);

          break;
      }
    });

    emitEvent("get-queue");
    emitEvent("get-player-state");

    return () => {
      socket.off("sync-event");
    };
  }, []);

  return {
    currentQueue,
    currentVideo,
    playerIsPlaying,
    isQueueLoading,
  };
}
