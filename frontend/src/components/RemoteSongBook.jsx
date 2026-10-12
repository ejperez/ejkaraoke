import { useContext, useEffect, useState } from "react";
import {
  MdOutlinePlaylistAdd,
  MdOutlinePlaylistAddCheck,
} from "react-icons/md";
import { RemoteContext } from "../components/Remote";
import useSongBook from "../hooks/useSongBook";
import SongList from "./SongList";

function SongListItemOptions({ video }) {
  const { emitEvent } = useContext(RemoteContext);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <button type="button" className="flex justify-center items-center size-12">
      {isClicked ? (
        <MdOutlinePlaylistAddCheck size={30} color="green" />
      ) : (
        <MdOutlinePlaylistAdd
          size={30}
          onClick={() => {
            emitEvent("request-add-to-queue", { video });
            setIsClicked(true);
          }}
        />
      )}
    </button>
  );
}

export default function RemoteSongBook() {
  const { getRecent, songs, maxPages } = useSongBook();

  useEffect(() => {
    getRecent();
  }, []);

  return (
    <div className="px-2">
      <input
        name="search"
        className="border border-white"
        type="search"
        placeholder="Search title or artist"
      />
      <SongList
        items={songs}
        OptionsElement={SongListItemOptions}
        emptyMessage="No downloaded songs yet"
      />
    </div>
  );
}
