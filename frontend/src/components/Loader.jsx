import { useNavigation } from "react-router";

export function AnimatedMessage({
  message = "Loading...",
  heightClass = "h-20",
}) {
  return (
    <div
      className={`relative flex items-center justify-center w-full overflow-hidden ${heightClass}`}
    >
      <div
        className={`absolute inset-y-0 -left-1/2 -right-1/2 -z-10 opacity-50
         bg-[linear-gradient(-60deg,#f20_50%,#000_50%)]
         ${heightClass}
         animate-slide`}
      ></div>
      <div
        className={`absolute inset-y-0 -left-1/2 -right-1/2 -z-10 opacity-50
         bg-[linear-gradient(-60deg,#f20_50%,#000_50%)]
         ${heightClass}
         animate-slide [animation-duration:1s]`}
      ></div>
      <div
        className={`absolute inset-y-0 -left-1/2 -right-1/2 -z-10 opacity-50
         bg-[linear-gradient(-60deg,#f20_50%,#000_50%)]
         ${heightClass}
         animate-slide [animation-duration:2s]`}
      ></div>
      <div className="">{message}</div>
    </div>
  );
}

export default function Loader({ children }) {
  const { state } = useNavigation();

  return state === "loading" ? <AnimatedMessage /> : children;
}
