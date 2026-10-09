import { useEffect } from "react";
import useSongBook from "../hooks/useSongBook";
import SongList from "./SongList";

export default function RemoteSongBook({ emitEvent }) {
  const { getRecent, songs, maxPages } = useSongBook();

  useEffect(() => {
    getRecent();
  }, []);

  return (
    <div>
      <input
        name="search"
        className="border border-white"
        type="search"
        placeholder="Search title or artist"
      />
      Recently added songs
      <SongList {...{ songs, emitEvent }} />
    </div>
  );
}
