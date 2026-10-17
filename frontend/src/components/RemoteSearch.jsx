import { useState, useEffect } from "react";
import {
  MdDownload,
  MdDownloadDone,
  MdOutlinePlaylistAdd,
  MdOutlineDownloading,
} from "react-icons/md";
import useRemoteSearch from "../hooks/useRemoteSearch";
import ErrorComponent from "./ErrorComponent";
import SearchList from "./SearchList";
import useRemoteDownloads from "../hooks/useRemoteDownloads";

function SearchListItemOptions({ video }) {
  const { download, latestDownloadedId, latestFailedId } = useRemoteDownloads();

  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (latestFailedId === video.id) {
      setIsClicked(false);
    }
  }, [latestFailedId]);

  const handleClick = async (addToQueue = false) => {
    await download(video.id, addToQueue);

    setIsClicked(true);
  };

  return (
    <div className="flex justify-end items-center grow">
      {latestDownloadedId === video.id && isClicked ? (
        <div className="flex items-center justify-center size-12">
          <MdDownloadDone size={30} color="green" />
        </div>
      ) : isClicked ? (
        <div className="flex items-center justify-center size-12">
          <MdOutlineDownloading size={30} color="orange" />
        </div>
      ) : (
        <>
          <button
            type="button"
            className="flex items-center justify-center size-12"
            onClick={() => {
              handleClick(true);
            }}
          >
            <MdOutlinePlaylistAdd size={30} />
          </button>

          <button
            type="button"
            className="flex items-center justify-center size-12"
            onClick={() => {
              handleClick();
            }}
          >
            <MdDownload size={30} />
          </button>
        </>
      )}
    </div>
  );
}

function SearchForm({ setSearchTerm }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.search.trim() === "") return;

    setSearchTerm(data.search + " karaoke");
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

export default function RemoteSearch() {
  const {
    loadMoreHandler,
    items,
    hasNextPage,
    isLoadingMore,
    isLoadingSearch,
    error,
    setSearchTerm,
  } = useRemoteSearch();

  return (
    <div className="px-2">
      <SearchForm {...{ setSearchTerm }} />
      <div className="mt-2">
        {items.length === 0 && !isLoadingMore && !isLoadingSearch ? (
          <div className="pb-2 text-sm font-bold">NO RESULTS</div>
        ) : isLoadingSearch ? (
          <div className="my-2 h-10">Loading results...</div>
        ) : (
          <>
            <div className="pb-2 text-sm font-bold">SEARCH RESULTS</div>

            <SearchList
              items={items.filter(
                (obj, index, self) =>
                  index === self.findIndex((o) => o.id === obj.id),
              )}
              OptionsElement={SearchListItemOptions}
            />

            {hasNextPage && !isLoadingMore && (
              <button
                className="w-full p-2 bg-white/30 my-2 rounded-2xl"
                type="button"
                onClick={loadMoreHandler}
                disabled={isLoadingMore}
              >
                Load more
              </button>
            )}

            {isLoadingMore && <div className="my-2 h-10">Loading more...</div>}

            {error && <ErrorComponent className="mt-2" message={error} />}
          </>
        )}
      </div>
    </div>
  );
}
