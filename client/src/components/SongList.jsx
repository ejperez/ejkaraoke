export default function SongList({ songs, emitEvent }) {
  const handlePlay = (id) => {
    emitEvent("request-play-video", { id });
  };

  return (
    <ul>
      {songs.map((song) => (
        <li key={song.videoId}>
          {song.title} - {song.channelName}{" "}
          <button
            type="button"
            onClick={() => {
              handlePlay(song.videoId);
            }}
          >
            Play
          </button>
        </li>
      ))}
    </ul>
  );
}
