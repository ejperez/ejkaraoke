import useRemoteView from "../hooks/useRemoteView";
import RemoteNav from "./RemoteNav";
import RemoteSearch from "./RemoteSearch";
import RemoteSongBook from "./RemoteSongBook";
import RemoteQueue from "./RemoteQueue";

export default function Remote() {
  const { currentView, setCurrentView, views } = useRemoteView();

  return (
    <>
      <header>
        <RemoteNav
          {...{
            currentView,
            setCurrentView,
            views,
          }}
        />
      </header>

      <div className="mt-12">
        <RemoteSongBook isActive={currentView === "Song Book"} />
        <RemoteSearch isActive={currentView === "Search"} />
        <RemoteQueue isActive={currentView === "Queue"} />
      </div>
    </>
  );
}
