import List from "./List";
import useRemoteList from "../hooks/useRemoteList";
import { AnimatedMessage } from "./Loader";

export default function RemoteQueue() {
  const {
    currentQueue,
    currentVideo,
    currentMenuOptions,
    listClickHandler,
    queueMenuOptions,
    selectedVideo,
    isQueueLoading,
  } = useRemoteList();

  return (
    <div className="px-4">
      <div className="pb-2 text-sm font-bold">NOW PLAYING</div>

      {isQueueLoading ? (
        <AnimatedMessage />
      ) : (
        <List
          items={currentVideo ? [currentVideo] : null}
          selectedItem={selectedVideo}
          menuOptions={currentMenuOptions}
          onSelect={listClickHandler}
          emptyMessage="Nothing"
        />
      )}

      <div className="pb-2 pt-4 text-sm font-bold">IN QUEUE</div>

      {isQueueLoading ? (
        <AnimatedMessage />
      ) : (
        <List
          items={currentQueue}
          selectedItem={selectedVideo}
          menuOptions={queueMenuOptions}
          onSelect={listClickHandler}
          emptyMessage="Nothing"
        />
      )}
    </div>
  );
}
