import { useEffect, useRef, useState } from "react";

export default function usePlayerQueue() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [queue, setQueue] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const queueRef = useRef(queue);
  const currentVideoRef = useRef(currentVideo);

  useEffect(() => {
    const savedQueue = localStorage.getItem("queue");

    if (savedQueue) {
      setQueue(JSON.parse(savedQueue));
    }

    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (isInitialLoad) return;

    queueRef.current = queue;
    currentVideoRef.current = currentVideo;
    localStorage.setItem("queue", JSON.stringify([currentVideo, ...queue]));
  }, [queue, currentVideo, isInitialLoad]);

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
  };
}
