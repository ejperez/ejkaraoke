import { decodeEntity } from "./util";

const backendAPI = import.meta.env.VITE_YT_API_URL || "http://localhost:3030";

const mapFields = (items) =>
  items.map((item) => {
    return {
      id: item?.id,
      title: decodeEntity(item?.title),
      channel: item.channelTitle,
      image: item.thumbnail.thumbnails.shift()?.url,
      length: item.length.simpleText,
    };
  });

const processResponse = (data) => {
  const hasNextPage = "nextPage" in data;
  let items = [];

  if (data.items.length > 0) {
    items = mapFields(data.items);
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

export const search = async (keyword) => {
  const response = await fetch(`${backendAPI}/search/${keyword}`);
  const data = await response.json();

  return processResponse(data);
};

export const getNextPage = async () => {
  const defaultResponse = { items: [], hasNextPage: false };
  const nextPage = sessionStorage.getItem("nextPage");

  if (!nextPage) {
    return defaultResponse;
  }

  const response = await fetch(`${backendAPI}/search/nextPage`, {
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
