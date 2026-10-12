    import { QRCode } from "react-qr-code";

export default function RemoteShare() {
  const remoteLink = document.location.href.replace("/share", "");

  return (
    <div className="flex items-center flex-col">
      <p className="text-xl mb-4">
        Scan the QR code below to invite another singer.
      </p>
      <QRCode className="p-2 rounded-xl bg-white" value={remoteLink} />
    </div>
  );
}
