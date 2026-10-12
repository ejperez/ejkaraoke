import useRemoteList from "../hooks/useRemoteList";
import ErrorComponent from "./ErrorComponent";
import List from "./List";
import { AnimatedMessage } from "./Loader";
import useRemoteSearch from "../hooks/useRemoteSearch";

export default function RemoteSearch() {
  const { searchMenuOptions, listClickHandler, selectedVideo } =
    useRemoteList();

  const {
    loadMoreHandler,
    currentItems,
    currentHasNextPage,
    isLoading,
    error,
  } = useRemoteSearch();

  return (
    <div className="px-4">
      {currentItems.length === 0 ? (
        <div className="pb-2 text-sm font-bold">NO RESULTS</div>
      ) : (
        <>
          <div className="pb-2 text-sm font-bold">SEARCH RESULTS</div>

          <List
            items={currentItems.filter(
              (obj, index, self) =>
                index === self.findIndex((o) => o.id === obj.id),
            )}
            selectedItem={selectedVideo}
            menuOptions={searchMenuOptions}
            onSelect={listClickHandler}
          />

          {currentHasNextPage && !isLoading && (
            <button
              className="w-full p-2 bg-white/50 my-2 rounded-2xl"
              type="button"
              onClick={loadMoreHandler}
              disabled={isLoading}
            >
              Load more
            </button>
          )}

          {isLoading && (
            <div className="my-2 h-10">
              <AnimatedMessage message="Loading more..." heightClass="h-10" />
            </div>
          )}

          {error && <ErrorComponent className="mt-2" message={error} />}
        </>
      )}
    </div>
  );
}
