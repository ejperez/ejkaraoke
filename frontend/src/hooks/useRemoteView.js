import { useState } from "react";

export default function useRemoteView() {
  const views = ["songbook", "search", "faves", "queue"];
  const [currentView, setCurrentView] = useState("songbook");

  return { currentView, setCurrentView, views };
}
