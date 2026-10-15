import SongListItem from "./SongListItem";

export default function SongList({
  items,
  OptionsElement,
  emptyMessage = "No items",
}) {
  if (!items || (items && items.length === 0))
    return <div className="italic">{emptyMessage}</div>;

  return (
    <ul className="flex flex-col gap-2 overflow-x-hidden">
      {items.map((item) => (
        <SongListItem
          key={item.id + (item?.index || "")}
          item={item}
          OptionsElement={OptionsElement}
        />
      ))}
    </ul>
  );
}
