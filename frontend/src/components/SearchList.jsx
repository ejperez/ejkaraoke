import SearchListItem from "./SearchListItem";

export default function SearchList({
  items,
  OptionsElement,
  emptyMessage = "No items",
}) {
  if (!items || (items && items.length === 0))
    return <div className="italic">{emptyMessage}</div>;

  return (
    <ul className="flex flex-col gap-2 overflow-x-hidden">
      {items.map((item) => (
        <SearchListItem
          key={item.id}
          item={item}
          OptionsElement={OptionsElement}
        />
      ))}
    </ul>
  );
}
