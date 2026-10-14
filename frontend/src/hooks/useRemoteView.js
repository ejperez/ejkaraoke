import { useState } from "react";

export default function useRemoteView() {
  const views = ["songbook", "search", "queue"];
  const [currentView, setCurrentView] = useState("queue");

  return { currentView, setCurrentView, views };
}
