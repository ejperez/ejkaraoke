import useRemoteView from "../hooks/useRemoteView";
import RemoteNav from "./RemoteNav";
import RemoteSearch from "./RemoteSearch";
import RemoteSongBook from "./RemoteSongBook";
import RemoteQueue from "./RemoteQueue";

export default function Remote() {
  const { currentView, setCurrentView, views } = useRemoteView();

  return (
    <>
      <header className="flex fixed top-0 z-1 w-full bg-black/50 py-1 px-2 gap-1">
        <RemoteNav
          {...{
            currentView,
            setCurrentView,
            views,
          }}
        />
      </header>

      <div className="mt-12">
        {currentView === "songbook" && <RemoteSongBook />}
        {currentView === "search" && <RemoteSearch />}
        {currentView === "queue" && <RemoteQueue />}
      </div>
    </>
  );
}
