export default function PlayerFrame({
  videoID,
  onError,
  onEnd,
  onReady,
  onStateChange,
  currentVideo,
}) {
  return <video src={currentVideo.filePath} autoPlay />;
}
