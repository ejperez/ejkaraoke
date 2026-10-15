import { cn } from "../util/util";
import { MdMenuBook } from "react-icons/md";
import { FaYoutube, FaListUl } from "react-icons/fa";

const viewIcons = {
  "Song Book": <MdMenuBook size={20} />,
  Search: <FaYoutube size={20} />,
  Queue: <FaListUl size={20} />,
};

export default function RemoteNav({ currentView, setCurrentView, views }) {
  return (
    <div className="flex fixed top-0 z-1 w-full bg-black/50 py-1 px-2 gap-1 justify-around">
      {views.map((view) => (
        <button
          key={view}
          type="button"
          onClick={() => setCurrentView(view)}
          title="Click to see favorites"
          className={cn(
            "rounded-2xl border-2 p-1 w-full h-9 flex justify-center items-center gap-1",
            {
              "bg-white text-black border-white": currentView === view,
            },
          )}
        >
          {viewIcons[view]}
          {view}
        </button>
      ))}
    </div>
  );
}
