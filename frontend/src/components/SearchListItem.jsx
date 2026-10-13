export default function SearchListItem({ item, OptionsElement }) {
  return (
    <li className="flex gap-2 relative rounded-2xl bg-white/20 w-full p-2">
      <div className="relative w-1/8">
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

      {<OptionsElement video={item} />}
    </li>
  );
}
