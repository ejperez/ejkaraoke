import SongList from "./SongList";
import useRemoteQueue from "../hooks/useRemoteQueue";
import { emitEvent } from "../util/socket";
import { MdOutlinePlaylistRemove } from "react-icons/md";

function QueueListItemOptions({ video }) {
  return (
    <div className="flex justify-end items-center grow">
      <button
        type="button"
        className="flex justify-center items-center size-12"
      >
        <MdOutlinePlaylistRemove
          size={30}
          onClick={() => {
            emitEvent("remove-from-queue", { video });
          }}
        />
      </button>
    </div>
  );
}

export default function RemoteQueue() {
  const { currentQueue, currentVideo, playerIsPlaying, isQueueLoading } =
    useRemoteQueue();

  return (
    <div className="px-4">
      <div className="pb-2 text-sm font-bold">NOW PLAYING</div>

      {isQueueLoading ? (
        <div className="my-2 h-10">Loading queue...</div>
      ) : (
        <SongList
          items={currentVideo ? [currentVideo] : null}
          emptyMessage="Nothing"
          OptionsElement={QueueListItemOptions}
        />
      )}

      <div className="pb-2 pt-4 text-sm font-bold">IN QUEUE</div>

      {isQueueLoading ? (
        <div className="my-2 h-10">Loading queue...</div>
      ) : (
        <SongList
          items={currentQueue}
          emptyMessage="Nothing"
          OptionsElement={QueueListItemOptions}
        />
      )}
    </div>
  );
}
