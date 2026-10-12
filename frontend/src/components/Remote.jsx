import RemoteNav from "./RemoteNav";
import useRemoteView from "../hooks/useRemoteView";
import RemoteSongBook from "./RemoteSongBook";
import useRemoteSync from "../hooks/useRemoteSync";
import useRemoteFaves from "../hooks/useRemoteFaves";
import { createContext } from "react";

export const RemoteContext = createContext();

export default function Remote() {
  const { currentView, setCurrentView, views } = useRemoteView();
  const { faves, addFave, isInFaves, removeFromFaves } = useRemoteFaves();
  const {
    playerIsPlaying,
    currentQueue,
    currentVideo,
    isQueueLoading,
    emitEvent,
  } = useRemoteSync();

  return (
    <RemoteContext.Provider
      value={{
        playerIsPlaying,
        currentQueue,
        currentVideo,
        isQueueLoading,
        emitEvent,
        faves,
        addFave,
        isInFaves,
        removeFromFaves,
      }}
    >
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
    </RemoteContext.Provider>
  );
}
