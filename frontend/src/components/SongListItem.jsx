import MarqueeTitle from "./MarqueeTitle";

export default function SongListItem({ item, OptionsElement }) {
  return (
    <li className="flex relative rounded-2xl bg-white/20 w-full p-2 gap-2">
      <div className="flex flex-col justify-center w-3/4 text-left min-w-0">
        <MarqueeTitle title={item.title} />
        <p className="text-xs">{item.channelName}</p>
      </div>

      {<OptionsElement video={item} />}
    </li>
  );
}
