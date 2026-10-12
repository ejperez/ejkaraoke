export default function SongListItem({ item, OptionsElement }) {
  return (
    <li
      key={item.id}
      className="flex relative rounded-2xl bg-white/20 w-full p-2"
    >
      <div className="flex flex-col justify-center w-full text-left">
        <p className="line-clamp-1 font-bold font-text">{item.title}</p>
        <p className="text-xs">{item.channelName}</p>
      </div>

      {<OptionsElement video={item} />}
    </li>
  );
}
