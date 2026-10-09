import { cn } from "../util/util";

export default function ListItem({ item, clickHandler, isActive, options }) {
  return (
    <li
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
        <div className="relative w-1/4">
          <img
            src={item.image}
            className="w-full"
            loading="lazy"
            width="360"
            height="202"
            alt={item.title}
          />
          <div className="absolute right-0 bottom-0 font-bold text-white bg-black/70 pl-0.5 pr-0.5 text-xs">
            {item.length}
          </div>
        </div>
        <div className="w-3/4 text-left">
          <p className="line-clamp-1 font-text font-bold">{item.title}</p>
          <em className="line-clamp-1 text-xs">{item.channel}</em>
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
