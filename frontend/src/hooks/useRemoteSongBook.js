import { useState, useEffect } from "react";

const BACKEND_API =
  (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + "/api/songs";
const PER_PAGE = 10;

export default function useRemoteSongBook() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState("createdAt");
  const [currentSearch, setCurrentSearch] = useState("");
  const [songs, setSongs] = useState([]);
  const [maxPages, setMaxPages] = useState(1);

  useEffect(() => {
    getSongs();
  }, [currentPage, currentSearch, currentSort]);

  const getSongs = async () => {
    const paramsObj = {
      per_page: PER_PAGE,
      page: currentPage,
      sort: currentSort,
      search: currentSearch,
    };
    const queryString = new URLSearchParams(paramsObj).toString();
    const response = await fetch(`${BACKEND_API}?${queryString}`);
    const result = await response.json();

    setSongs(result.data);
    setMaxPages(result.max_pages);
  };

  return {
    getSongs,
    songs,
    maxPages,
    currentPage,
    setCurrentPage,
    currentSort,
    setCurrentSort,
    currentSearch,
    setCurrentSearch,
  };
}
