import { useState, useEffect } from "react";

const BACKEND_API =
  (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") +
  "/api/downloads";

export default function useRemoteDownloads() {
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
  };
}
