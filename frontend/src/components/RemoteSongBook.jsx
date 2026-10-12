import { useContext, useState } from "react";
import {
  MdChevronLeft,
  MdChevronRight,
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

function SearchForm({ setCurrentSearch, setCurrentPage }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    setCurrentSearch(data.search);
    setCurrentPage(1);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        name="search"
        className="border-2 border-white w-full rounded-2xl p-2"
        type="search"
        placeholder="Search title or artist"
      />
    </form>
  );
}

function Pagination({ getSongs, currentPage, setCurrentPage, maxPages }) {
  const handlePrevious = () => {
    setCurrentPage((page) => page - 1);
  };

  const handleNext = () => {
    setCurrentPage((page) => page + 1);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        disabled={currentPage === 1}
        onClick={handlePrevious}
        type="button"
        className="px-1 flex justify-center items-center rounded-2xl bg-white/30 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <MdChevronLeft size={20} /> Previous page
      </button>
      <button
        disabled={currentPage === maxPages}
        onClick={handleNext}
        type="button"
        className="px-1 flex justify-center items-center rounded-2xl bg-white/30 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next page <MdChevronRight size={20} />
      </button>
    </div>
  );
}

export default function RemoteSongBook() {
  const {
    getSongs,
    songs,
    maxPages,
    currentPage,
    setCurrentPage,
    currentSearch,
    setCurrentSearch,
  } = useSongBook();

  return (
    <div className="flex flex-col gap-2 px-2">
      <SearchForm
        {...{
          getSongs,
          currentSearch,
          setCurrentSearch,
          setCurrentPage,
        }}
      />
      <SongList
        items={songs}
        OptionsElement={SongListItemOptions}
        emptyMessage="No downloaded songs yet"
      />
      <Pagination {...{ getSongs, currentPage, setCurrentPage, maxPages }} />
    </div>
  );
}
