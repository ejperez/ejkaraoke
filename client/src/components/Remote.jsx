import RemoteNav from "./RemoteNav";
import useRemoteView from "../hooks/useRemoteView";
import RemoteSongBook from "./RemoteSongBook";
import useRemoteSync from "../hooks/useRemoteSync";

export default function Remote() {
  const { currentQueue, emitEvent } = useRemoteSync();
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

      <div className="mt-14">
        {currentView === "songbook" && <RemoteSongBook {...{ emitEvent }} />}
      </div>
    </>
  );
}
