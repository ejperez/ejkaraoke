import { useState, useContext } from "react";
import { RemoteContext } from "../components/Remote";

export default function useRemoteList() {
  const { playerIsPlaying, currentQueue, currentVideo, emitEvent } =
    useContext(RemoteContext);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const queueIds = [...currentQueue, currentVideo]
    .map((item) => item?.id)
    .filter(Boolean);

  // Common menu options
  const cancelOption = {
    label: "Cancel",
    action: (e) => {
      e.stopPropagation();
      setSelectedVideo(null);
    },
  };

  const playOption = {
    label: "Play",
    action: (e) => {
      e.stopPropagation();
      emitEvent("request-play-video", { id: selectedVideo.id });
      // emitEvent("remove-from-queue", { video: selectedVideo });
      setSelectedVideo(null);
    },
  };

  const addToQueueOption = {
    label: "Add to queue",
    action: (e) => {
      e.stopPropagation();
      emitEvent("add-to-queue", { video: selectedVideo });
    },
    isDisabled: selectedVideo && queueIds.includes(selectedVideo.id),
  };

  // Build the menu options
  const queueMenuOptions = [
    playOption,
    {
      label: "Remove from queue",
      action: (e) => {
        e.stopPropagation();
        emitEvent("remove-from-queue", { video: selectedVideo });
      },
    },
    cancelOption,
  ];

  const currentMenuOptions = [
    {
      label: "Restart",
      action: (e) => {
        e.stopPropagation();
        emitEvent("restart-current-video");
        setSelectedVideo(null);
      },
    },
    {
      label: playerIsPlaying ? "Pause" : "Play",
      action: (e) => {
        e.stopPropagation();

        if (playerIsPlaying) {
          emitEvent("pause-current-video");
        } else {
          emitEvent("play-current-video");
        }
      },
    },
    cancelOption,
  ];

  const searchMenuOptions = [playOption, addToQueueOption, cancelOption];
  const songBookListItemOptions = [addToQueueOption];

  const listClickHandler = (item) => {
    setSelectedVideo(item);
  };

  return {
    listClickHandler,
    queueMenuOptions,
    currentMenuOptions,
    currentQueue,
    currentVideo,
    selectedVideo,
    searchMenuOptions,
    songBookListItemOptions,
  };
}
