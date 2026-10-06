import { useState } from "react";
import { useOutletContext } from "react-router";

export default function useRemoteList() {
  const {
    playerIsPlaying,
    currentQueue,
    currentVideo,
    isQueueLoading,
    emitEvent,
    faves,
    addFave,
    isInFaves,
    removeFromFaves,
  } = useOutletContext();
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
      emitEvent("play-video", { video: selectedVideo });
      emitEvent("remove-from-queue", { video: selectedVideo });
      setSelectedVideo(null);
    },
  };

  const addToFavoritesOption = {
    label: "Add to favorites",
    action: (e) => {
      addFave(selectedVideo);
      e.stopPropagation();
      setSelectedVideo(null);
    },
    isDisabled: selectedVideo && isInFaves(selectedVideo.id),
  };

  const addToQueueOption = {
    label: "Add to queue",
    action: (e) => {
      e.stopPropagation();
      emitEvent("add-to-queue", { video: selectedVideo });
      setSelectedVideo(null);
    },
    isDisabled: selectedVideo && queueIds.includes(selectedVideo.id),
  };

  // Build the menu options
  const queueMenuOptions = [
    playOption,
    addToFavoritesOption,
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
    {
      label: "Add to favorites",
      action: (e) => {
        addFave(currentVideo);
        e.stopPropagation();
        setSelectedVideo(null);
      },
      isDisabled: currentVideo && isInFaves(currentVideo.id),
    },
    cancelOption,
  ];

  const favesMenuOptions = [
    playOption,
    addToQueueOption,
    {
      label: "Remove from favorites",
      action: (e) => {
        removeFromFaves(selectedVideo.id);
        e.stopPropagation();
        setSelectedVideo(null);
      },
    },
    cancelOption,
  ];

  const searchMenuOptions = [
    playOption,
    addToQueueOption,
    addToFavoritesOption,
    cancelOption,
  ];

  const listClickHandler = (item) => {
    setSelectedVideo(item);
  };

  return {
    listClickHandler,
    queueMenuOptions,
    currentMenuOptions,
    currentQueue,
    currentVideo,
    faves,
    selectedVideo,
    favesMenuOptions,
    searchMenuOptions,
    isQueueLoading,
  };
}
