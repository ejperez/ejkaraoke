import { useEffect, useRef, useState } from "react";
import { socket } from "../util/socket";

export default function usePlayer() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [queue, setQueue] = useState([]);
  const [hasError, setHasError] = useState(false);
  // const [isInitialLoad, setIsInitialLoad] = useState(true);
  const queueRef = useRef(queue);
  const currentVideoRef = useRef(currentVideo);
  const playerInstance = useRef(null);

  // useEffect(() => {
  //   const savedQueue = localStorage.getItem("queue");

  //   if (savedQueue) {
  //     setQueue(JSON.parse(savedQueue));
  //   }

  //   setIsInitialLoad(false);
  // }, []);

  // useEffect(() => {
  //   if (isInitialLoad) return;

  //   localStorage.setItem("queue", JSON.stringify([currentVideo, ...queue]));
  // }, [queue, currentVideo, isInitialLoad]);

  const playNextInQueue = () => {
    if (queue.length > 0) {
      setCurrentVideo(queue[0]);
      setQueue((queue) => queue.slice(1));
    } else {
      setCurrentVideo(null);
    }
  };

  // Autoplay first item in queue if nothing is playing
  useEffect(() => {
    if (!currentVideo) {
      playNextInQueue();
    }
  }, [queue, currentVideo]);

  const handleOnError = () => {
    setHasError(true);
  };

  const handleSkip = () => {
    playNextInQueue();
    setHasError(false);
  };

  const broadcastQueue = () => {
    socket.emit("sync-event", {
      action: "current-queue",
      payload: {
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
        isPlaying:
          playerInstance.current.getPlayerState() ===
          window.YT.PlayerState.PLAYING,
      },
    });
  };

  useEffect(() => {
    queueRef.current = queue;
    currentVideoRef.current = currentVideo;
    broadcastQueue();
  }, [queue, currentVideo]);

  useEffect(() => {
    socket.on("sync-event", (data) => {
      console.log(data);

      switch (data.action) {
        case "play-video":
          setCurrentVideo(data.payload.video);
          setHasError(false);
          break;
        case "add-to-queue": {
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
    handleOnReady,
    handleStateChange,
  };
}
