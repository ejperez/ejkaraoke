import { cn } from "../util/util";

export default function SongListItem({
  item,
  clickHandler,
  isActive,
  options,
}) {
  return (
    <li
      key={item.id}
      className={cn(
        "bg-cover relative rounded-2xl transform transition-transform duration-300 ease-in-out",
        {
          "-translate-x-full": isActive,
        },
      )}
    >
      <button
        className="relative flex gap-2 p-2 bg-white/20 w-full rounded-2xl"
        type="button"
        onClick={() => {
          clickHandler(item);
        }}
      >
        <div className="w-3/4 text-left">
          <p className="line-clamp-1 font-text font-bold">
            {item.title} -<em className="text-xs">{item.channelName}</em>
          </p>
        </div>
      </button>

      {options && isActive && (
        <div className="absolute top-0 -right-full flex flex-wrap gap-2 w-full h-full">
          {options.map((item) => (
            <button
              disabled={item?.isDisabled}
              key={item.label}
              onClick={(e) => {
                setTimeout(() => {
                  item.action(e);
                }, 200);
              }}
              className={cn("flex-1 rounded-2xl text-sm bg-white/20 p-1", {
                "active:bg-white active:text-black  text-white":
                  !item.isDisabled,
                "text-white/50": item.isDisabled,
              })}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </li>
  );
}
