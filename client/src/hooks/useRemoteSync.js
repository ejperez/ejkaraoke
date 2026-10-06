import { useEffect, useState } from "react";
import { emitRemoteEvent, socket } from "../util/socket";

export default function useRemoteSync() {
  const [currentQueue, setCurrentQueue] = useState([]);
  const [isQueueLoading, setIsQueueLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playerIsPlaying, setPlayerIsPlaying] = useState(null);

  const emitEvent = (action, payload) => {
    emitRemoteEvent(socket, action, payload);
  };

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
    playerIsPlaying,
    currentQueue,
    currentVideo,
    isQueueLoading,
    emitEvent,
  };
}
