import { useState, useEffect } from "react";
import { socket } from "../util/socket";

const BACKEND_API =
  (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") +
  "/api/downloads";

export default function useRemoteDownloads() {
  const [latestDownloadedId, setLatestDownloadedId] = useState(null);
  const [latestFailedId, setLatestFailedId] = useState(null);

  // Handle sync events from server
  useEffect(() => {
    socket.on("sync-event", (data) => {
      console.log(data);

      switch (data.action) {
        case "download-finished":
          setLatestDownloadedId(data.payload.id);

          break;
        case "download-failed":
          setLatestFailedId(data.payload.id);

          break;
      }
    });

    return () => {
      socket.off("sync-event");
    };
  }, []);

  const download = async (id, addToQueue = false) => {
    const response = await fetch(BACKEND_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, add_to_queue: addToQueue }),
    });

    return await response.json();
  };

  return {
    download,
    latestDownloadedId,
    latestFailedId,
  };
}
