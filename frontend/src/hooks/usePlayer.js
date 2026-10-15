import { useCallback, useEffect, useRef, useState } from "react";
import { socket } from "../util/socket";

export default function usePlayer() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [queue, setQueueState] = useState([]);
  const setQueue = useCallback((nextQueue) => {
    setQueueState((currentQueue) => {
      const updatedQueue =
        typeof nextQueue === "function" ? nextQueue(currentQueue) : nextQueue;

      return updatedQueue.map((item, index) => ({ ...item, index }));
    });
  }, []);
  // const [isInitialLoad, setIsInitialLoad] = useState(true);
  const queueRef = useRef(queue);
  const currentVideoRef = useRef(currentVideo);
  const videoPlayerRef = useRef(null);

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

  const broadcastQueue = () => {
    socket.emit("sync-event", {
      action: "current-queue",
      payload: {
        queue: queueRef.current,
        currentVideo: currentVideoRef.current,
      },
    });
  };

  const isVideoPlayerPlaying = () => {
    if (!videoPlayerRef.current) return false;

    return !videoPlayerRef.current.paused && !videoPlayerRef.current.ended;
  };

  const broadcastPlayerStatus = () => {
    socket.emit("sync-event", {
      action: "player-status-changed",
      payload: {
        isPlaying: isVideoPlayerPlaying(),
      },
    });
  };

  videoPlayerRef.current?.addEventListener("play", broadcastPlayerStatus);
  videoPlayerRef.current?.addEventListener("pause", broadcastPlayerStatus);
  videoPlayerRef.current?.addEventListener("ended", broadcastPlayerStatus);

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
            queue.filter((item) => item.index !== data.payload.video.index),
          );
          break;
        case "restart-current-video":
          if (!videoPlayerRef.current) return;

          videoPlayerRef.current.currentTime = 0;
          videoPlayerRef.current.playVideo();
          break;
        case "pause-current-video":
          videoPlayerRef.current?.pause();
          break;
        case "play-current-video":
          videoPlayerRef.current?.play();
          broadcastQueue();
          break;
        case "get-player-state":
          broadcastPlayerStatus();
          break;
      }
    });

    return () => {
      socket.off("sync-event");
    };
  }, []);

  return {
    currentVideo,
    queue,
    playNextInQueue,
    videoPlayerRef,
  };
}
