import { useState } from "react";
import {
  MdDownload,
  MdDownloadDone,
  MdOutlinePlaylistAdd,
  MdOutlinePlaylistAddCheck,
} from "react-icons/md";
import useRemoteSearch from "../hooks/useRemoteSearch";
import ErrorComponent from "./ErrorComponent";
import SearchList from "./SearchList";
import useRemoteDownloads from "../hooks/useRemoteDownloads";

function DownloadAndQueueOption({ video, download }) {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <button type="button" className="flex justify-center items-center size-12">
      {isClicked ? (
        <MdOutlinePlaylistAddCheck size={30} color="green" />
      ) : (
        <MdOutlinePlaylistAdd
          size={30}
          onClick={() => {
            // emitEvent("request-download-add-to-queue", { video });
            setIsClicked(true);
          }}
        />
      )}
    </button>
  );
}

function DownloadOption({ video, download }) {
  const [isClicked, setIsClicked] = useState(false);
  const handleClick = async () => {
    await download(video.id);
    setIsClicked(true);
  };

  return (
    <button type="button" className="flex justify-center items-center size-12">
      {isClicked ? (
        <MdDownloadDone size={30} color="green" />
      ) : (
        <MdDownload size={30} onClick={handleClick} />
      )}
    </button>
  );
}

function SearchListItemOptions({ video }) {
  const { download } = useRemoteDownloads();

  return (
    <>
      <DownloadAndQueueOption {...{ video, download }} />
      <DownloadOption {...{ video, download }} />
    </>
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
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
  } = useRemoteSearch();

  return (
    <div className="px-2">
      <SearchForm {...{ setSearchTerm }} />
      <div className="mt-2">
        {searchTerm !== "" && items.length === 0 && !isLoading ? (
          <div className="pb-2 text-sm font-bold">NO RESULTS</div>
        ) : searchTerm === "" ? null : (
          <>
            <div className="pb-2 text-sm font-bold">SEARCH RESULTS</div>

            <SearchList
              items={items.filter(
                (obj, index, self) =>
                  index === self.findIndex((o) => o.id === obj.id),
              )}
              OptionsElement={SearchListItemOptions}
            />

            {hasNextPage && !isLoading && (
              <button
                className="w-full p-2 bg-white/30 my-2 rounded-2xl"
                type="button"
                onClick={loadMoreHandler}
                disabled={isLoading}
              >
                Load more
              </button>
            )}

            {isLoading && <div className="my-2 h-10">Loading more...</div>}

            {error && <ErrorComponent className="mt-2" message={error} />}
          </>
        )}
      </div>
    </div>
  );
}
