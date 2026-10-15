import SongList from "./SongList";
import useRemoteQueue from "../hooks/useRemoteQueue";
import { emitEvent } from "../util/socket";
import {
  MdOutlinePlaylistRemove,
  MdOutlinePlayArrow,
  MdOutlineRestartAlt,
  MdOutlinePause,
} from "react-icons/md";
import { createContext, useContext } from "react";

const QueueContext = createContext(null);

function QueueListItemOptions({ video }) {
  return (
    <div className="flex justify-end items-center grow">
      <button
        type="button"
        className="flex justify-center items-center size-12"
      >
        <MdOutlinePlayArrow
          size={30}
          onClick={() => {
            emitEvent("play-video", { video });
            emitEvent("remove-from-queue", { video });
          }}
        />
      </button>
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

function CurrentVideoListItemOptions({ video }) {
  const { playerIsPlaying } = useContext(QueueContext);

  return (
    <div className="flex justify-end items-center grow">
      <button
        type="button"
        className="flex justify-center items-center size-12"
      >
        {playerIsPlaying ? (
          <MdOutlinePause
            size={30}
            onClick={() => {
              emitEvent("pause-current-video", { video });
            }}
          />
        ) : (
          <MdOutlinePlayArrow
            size={30}
            onClick={() => {
              emitEvent("play-current-video", { video });
            }}
          />
        )}
      </button>
      <button
        type="button"
        className="flex justify-center items-center size-12"
      >
        <MdOutlineRestartAlt
          size={30}
          onClick={() => {
            emitEvent("restart-current-video", { video });
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
    <QueueContext.Provider value={{ playerIsPlaying }}>
      <div className="px-4">
        <div className="pb-2 text-sm font-bold">NOW PLAYING</div>

        {isQueueLoading ? (
          <div className="my-2 h-10">Loading queue...</div>
        ) : (
          <SongList
            items={currentVideo ? [currentVideo] : null}
            emptyMessage="Nothing"
            OptionsElement={CurrentVideoListItemOptions}
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
    </QueueContext.Provider>
  );
}
