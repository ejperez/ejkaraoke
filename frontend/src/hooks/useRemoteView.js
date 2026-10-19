import { useState } from "react";
import { NO_DOWNLOADS } from "../util/config";

export default function useRemoteView() {
  const views = ["Song Book", "Search", "Queue"];

  if (NO_DOWNLOADS) {
    views.splice(0, 1);
  }

  const [currentView, setCurrentView] = useState(views[0]);

  return { currentView, setCurrentView, views };
}
