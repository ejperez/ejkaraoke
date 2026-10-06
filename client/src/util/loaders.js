import { search } from "./yt";

export async function remoteSearchLoader({ request }) {
  const [, searchParams] = request.url.split("?");
  const keyword = new URLSearchParams(searchParams).get("keyword");

  return await search(keyword + " karaoke");
}
