import { QRCode } from "react-qr-code";

function AnimatedBackground() {
  return (
    <>
      <div
        className="fixed inset-y-0 -left-1/2 -right-1/2 -z-10 opacity-50
         bg-[linear-gradient(-60deg,#f20_50%,#000_50%)]
         animate-slide"
      ></div>
      <div
        className="fixed inset-y-0 -left-1/2 -right-1/2 -z-10 opacity-50
         bg-[linear-gradient(-60deg,#f20_50%,#000_50%)]
         animate-slide [animation-duration:2s]"
      ></div>
      <div
        className="fixed inset-y-0 -left-1/2 -right-1/2 -z-10 opacity-50
         bg-[linear-gradient(-60deg,#f20_50%,#000_50%)]
         animate-slide [animation-duration:3s]"
      ></div>
    </>
  );
}

export default function PlayerHome({ playerID, remoteLink }) {
  return (
    <div className="flex flex-col h-full w-full justify-center items-center">
      <AnimatedBackground />

      <div className="z-2 text-center p-2">
        <h1 className="text-center font-bold lg:text-7xl md:text-5xl text-4xl">
          Welcome great singers!
        </h1>
        <p className="mt-2">
          Scan the QR code below using your phone to search and play songs.
        </p>
        <p className="mt-8 flex justify-center">
          <a
            href={remoteLink}
            target="_blank"
            title={`Click to open in a new tab (Player ID: ${playerID})`}
          >
            <QRCode className="p-2 rounded-xl bg-white" value={remoteLink} />
          </a>
        </p>
      </div>
    </div>
  );
}
