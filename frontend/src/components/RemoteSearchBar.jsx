import { useRef } from "react";
import { Form, useParams, useSearchParams } from "react-router";
import useRemoteView from "../hooks/useRemoteView";
import { cn } from "../util/util";

export default function RemoteSearchBar() {
  const { playerID } = useParams();
  const { currentView } = useRemoteView();
  const [searchParams, _] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const keywordField = useRef(null);

  const handleSubmit = () => {
    keywordField.current.blur();
  };

  return (
    <div className="flex items-center grow">
      <Form
        action={`/${playerID}/remote/search`}
        method="get"
        className="relative z-3 w-full"
        onSubmit={handleSubmit}
      >
        <input
          className={cn(
            "w-full bg-black text-white! placeholder:text-white! border-white pl-3 py-1 pr-9 rounded-full border-2",
            {
              "bg-white text-black! ": currentView === "search",
            },
          )}
          name="keyword"
          type="text"
          placeholder="Search YouTube"
          defaultValue={keyword}
          required
          ref={keywordField}
        />

        <svg
          className="size-6 absolute right-3 top-1.25"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke={currentView === "search" ? "#000" : "#fff"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.65" y1="16.65" x2="21" y2="21" />
        </svg>
      </Form>
    </div>
  );
}
