import { useLocation } from "react-router";

export default function useRemoteView() {
  const location = useLocation();

  const currentView = location.pathname.includes("/search")
    ? "search"
    : location.pathname.includes("/queue")
      ? "queue"
      : location.pathname.includes("/share")
        ? "share"
        : "faves";

  return { currentView };
}
