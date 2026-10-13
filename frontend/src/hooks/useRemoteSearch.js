import { useEffect, useState } from "react";

const BACKEND_API =
  (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000") + "/api/search";

const decodeEntity = (inputStr) => {
  var textarea = document.createElement("textarea");
  textarea.innerHTML = inputStr;
  return textarea.value;
};

const processResponse = (data) => {
  const hasNextPage = "nextPage" in data;
  let items = [];

  if (data.items.length > 0) {
    items = data.items.map((item) => {
      return { ...item, title: decodeEntity(item.title) };
    });
  }

  if (hasNextPage) {
    sessionStorage.setItem(
      "nextPage",
      JSON.stringify({ nextPage: data.nextPage }),
    );
  } else {
    sessionStorage.removeItem("nextPage");
  }

  return {
    items: items,
    hasNextPage: hasNextPage,
  };
};

const search = async (keyword) => {
  const response = await fetch(`${BACKEND_API}/${keyword}`);
  const data = await response.json();

  return processResponse(data);
};

const getNextPage = async () => {
  const defaultResponse = { items: [], hasNextPage: false };
  const nextPage = sessionStorage.getItem("nextPage");

  if (!nextPage) {
    return defaultResponse;
  }

  const response = await fetch(`${BACKEND_API}/nextPage`, {
    method: "POST",
    body: nextPage,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    throw new Error("There has been a server error. Please try again later.");
  }

  const data = await response.json();

  return processResponse(data);
};

export default function useRemoteSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    async function doSearch() {
      if (searchTerm === "") return;

      try {
        const result = await search(searchTerm);

        setItems(result.items);
        setHasNextPage(result.hasNextPage);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
      }
    }

    doSearch();
  }, [searchTerm]);

  const loadMoreHandler = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const { items, hasNextPage } = await getNextPage();

      setItems((currentItems) => {
        return [...currentItems, ...items];
      });
      setHasNextPage(hasNextPage);

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
    items,
    hasNextPage,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
  };
}
