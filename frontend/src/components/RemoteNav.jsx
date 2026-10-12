import { cn } from "../util/util";

export default function RemoteNav({ currentView, setCurrentView, views }) {
  return (
    <>
      {views.map((view) => (
        <button
          key={view}
          type="button"
          onClick={() => setCurrentView(view)}
          title="Click to see favorites"
          className={cn("rounded-2xl border-2 p-1", {
            "bg-white text-black border-white": currentView === view,
          })}
        >
          {view}
        </button>
      ))}
    </>
  );
}
