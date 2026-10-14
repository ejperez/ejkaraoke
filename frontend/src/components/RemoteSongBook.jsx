import { useState } from "react";
import { FaSortAlphaDown } from "react-icons/fa";
import {
  MdChevronLeft,
  MdChevronRight,
  MdOutlinePlaylistAdd,
  MdOutlinePlaylistAddCheck,
  MdDateRange,
} from "react-icons/md";
import useRemoteSongBook from "../hooks/useRemoteSongBook";
import SongList from "./SongList";
import { cn } from "../util/util";
import { emitEvent } from "../util/socket";

function SongListItemOptions({ video }) {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="flex justify-end items-center grow">
      <button
        type="button"
        disabled={isClicked}
        className="flex items-center justify-center size-12"
      >
        {isClicked ? (
          <MdOutlinePlaylistAddCheck className="w-10" size={30} color="green" />
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
    </div>
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
        placeholder="Search title, artist or channel name"
      />
    </form>
  );
}

function Pagination({ currentPage, setCurrentPage, maxPages }) {
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

function Sort({ currentSort, setCurrentSort, setCurrentPage }) {
  const handleClick = (sort) => {
    setCurrentPage(1);
    setCurrentSort(sort);
  };

  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => {
          handleClick("title");
        }}
        className={cn(
          "bg-white/10 w-10 rounded-2xl flex justify-center items-center",
          { "bg-white/30": currentSort === "title" },
        )}
      >
        <FaSortAlphaDown size={20} />
      </button>
      <button
        type="button"
        onClick={() => {
          handleClick("createdAt");
        }}
        className={cn(
          "bg-white/10 w-10 rounded-2xl flex justify-center items-center",
          { "bg-white/30": currentSort === "createdAt" },
        )}
      >
        <MdDateRange size={20} />
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
    currentSort,
    setCurrentSort,
  } = useRemoteSongBook();

  return (
    <div className="flex flex-col gap-2 px-2">
      <div className="flex gap-2">
        <SearchForm
          {...{
            getSongs,
            currentSearch,
            setCurrentSearch,
            setCurrentPage,
          }}
        />
        <Sort
          {...{
            currentSort,
            setCurrentSort,
            setCurrentPage,
          }}
        />
      </div>
      <SongList
        items={songs}
        OptionsElement={SongListItemOptions}
        emptyMessage="No downloaded songs yet"
      />
      <Pagination {...{ getSongs, currentPage, setCurrentPage, maxPages }} />
    </div>
  );
}
