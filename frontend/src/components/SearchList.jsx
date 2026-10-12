import SearchListItem from "./SearchListItem";

export default function SearchList({
  items,
  selectedItem,
  menuOptions,
  onSelect,
  emptyMessage = "No items",
}) {
  if (!items || (items && items.length === 0))
    return <div className="italic">{emptyMessage}</div>;

  return (
    <ul className="flex flex-col gap-2 overflow-x-hidden">
      {items.map((item) => (
        <SearchListItem
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
