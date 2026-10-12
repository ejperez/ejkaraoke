import { useState } from "react";
import { useLoaderData } from "react-router";
import { getNextPage } from "../util/yt";

export default function useRemoteSearch() {
  const { items, hasNextPage } = useLoaderData();
  const [currentItems, setCurrentItems] = useState(items);
  const [currentHasNextPage, setCurrentHasNextPage] = useState(hasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMoreHandler = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const { items, hasNextPage } = await getNextPage();

      setCurrentItems((currentItems) => {
        return [...currentItems, ...items];
      });
      setCurrentHasNextPage(hasNextPage);

      // Scroll to new items
      setTimeout(() => {
        window.scrollBy({
          left: 0,
          top: window.innerHeight - 100,
          behavior: "smooth",
        });
      }, 100);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  };

  return {
    loadMoreHandler,
    currentItems,
    currentHasNextPage,
    isLoading,
    error,
  };
}
