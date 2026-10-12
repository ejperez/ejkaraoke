import SongListItem from "./SongListItem";

export default function SongList({
  items,
  selectedItem,
  menuOptions,
  onSelect,
  emptyMessage = "No items",
}) {
  if (!items || (items && items.length === 0))
    return <div className="italic">{emptyMessage}</div>;

  console.log(items);

  return (
    <ul>
      {items.map((item) => (
        <SongListItem
          key={item.id}
          clickHandler={onSelect}
          item={item}
          isActive={item.id === selectedItem?.id}
          options={menuOptions}
        />
      ))}
    </ul>
  );
}
