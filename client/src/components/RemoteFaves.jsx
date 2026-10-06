import List from "./List";
import useRemoteList from "../hooks/useRemoteList";

export default function RemoteFaves() {
  const { faves, selectedVideo, favesMenuOptions, listClickHandler } =
    useRemoteList();

  return (
    <div className="px-4">
      <div className="pb-2 text-sm font-bold">YOUR FAVORITES</div>
      <List
        items={faves}
        selectedItem={selectedVideo}
        menuOptions={favesMenuOptions}
        onSelect={listClickHandler}
      />
    </div>
  );
}
