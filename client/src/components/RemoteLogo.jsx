import { Link, useParams } from "react-router";

export default function RemoteLogo() {
  const { playerID } = useParams();

  return (
    <div>
      <Link to={`/${playerID}/remote/share`}>
        <img
          className="w-12 h-full"
          src={`${import.meta.env.VITE_BASE_PATH}logo.png`}
          alt="Youtubeoke Logo"
        />
      </Link>
    </div>
  );
}
