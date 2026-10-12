import { useState } from "react";

const backendAPI = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export default function useSongBook() {
  const [songs, setSongs] = useState([]);
  const [maxPages, setMaxPages] = useState(1);

  const getRecent = async () => {
    const response = await fetch(`${backendAPI}/api/songs`);
    const result = await response.json();

    setSongs(result.data);
    setMaxPages(result.max_pages);
  };

  return {
    getRecent,
    songs,
    maxPages,
  };
}
