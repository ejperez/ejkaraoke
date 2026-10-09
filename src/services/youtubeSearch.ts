import youtubesearchapi, { type SearchResult } from "youtube-search-api";

const YT_ITEMS_PER_PAGE = 100;

const processResponse = (data: SearchResult) => ({
  items: data.items
    .filter((item) => item.type === "video")
    .map((item) => {
      return {
        id: item?.id,
        title: item?.title,
        channel: item.channelTitle,
        image: item.thumbnail.thumbnails.shift()?.url,
        length: item.length.simpleText,
      };
    }),
  nextPage: data.nextPage,
});

export const searchVideos = async (query: string) => {
  const data = await youtubesearchapi.GetListByKeyword(
    query,
    false,
    YT_ITEMS_PER_PAGE,
    [{ type: "video" }],
  );

  return processResponse(data);
};

export const getNextSearchPage = async (nextPage: SearchResult["nextPage"]) => {
  const data = await youtubesearchapi.NextPage(
    nextPage,
    false,
    YT_ITEMS_PER_PAGE,
  );

  return processResponse(data);
};
