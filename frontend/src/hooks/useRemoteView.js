import { useState } from "react";

export default function useRemoteView() {
  const views = ["Song Book", "Search", "Queue"];
  const [currentView, setCurrentView] = useState("Song Book");

  return { currentView, setCurrentView, views };
}
