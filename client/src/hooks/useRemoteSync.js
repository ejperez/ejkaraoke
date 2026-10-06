import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { emitRemoteEvent, socket } from "../util/socket";

export default function useRemoteSync() {
  const { playerID } = useParams();
  const [currentQueue, setCurrentQueue] = useState([]);
  const [isQueueLoading, setIsQueueLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playerIsPlaying, setPlayerIsPlaying] = useState(null);

  const emitEvent = (action, payload) => {
    emitRemoteEvent(socket, playerID, action, payload);
  };

  useEffect(() => {
    socket.on("sync-event", (data) => {
      if (String(playerID) !== String(data.payload.playerID)) {
        return;
      }

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
  }, [playerID]);

  return {
    playerIsPlaying,
    currentQueue,
    currentVideo,
    isQueueLoading,
    emitEvent,
  };
}
