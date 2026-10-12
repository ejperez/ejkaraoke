import { useState, useEffect } from "react";
import useSongBook from "../hooks/useSongBook";
import SongList from "./SongList";
import useRemoteList from "../hooks/useRemoteList";

export default function RemoteSongBook({ emitEvent }) {
  const { getRecent, songs, maxPages } = useSongBook();
  const { searchMenuOptions, listClickHandler, selectedVideo } =
    useRemoteList();

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
      <SongList
        items={songs}
        selectedItem={selectedVideo}
        menuOptions={searchMenuOptions}
        onSelect={listClickHandler}
        emptyMessage="Nothing"
      />
    </div>
  );
}
