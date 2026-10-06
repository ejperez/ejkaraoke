export default function PlayerError({ video, onSkip }) {
  const handlePlayInYT = () => {
    document.location.href = `https://www.youtube.com/watch?v=${video.id}`;
  };

  return (
    <div className="relative flex items-center justify-center h-full w-full text-2xl bg-red-950">
      <div className="text-center">
        <h2 className="my-4 text-4xl">Oops!</h2>
        We can't play the song "{video.title}"
        <br />
        Click "Watch on YouTube" to play it or click the "Skip" button to play
        the next song.
        <div className="flex gap-2 justify-center mt-4">
          <button
            type="button"
            className="w-52 px-4 py-2 my-4 text-2xl text-black bg-white rounded-full"
            onClick={handlePlayInYT}
          >
            Watch on YouTube
          </button>
          <button
            type="button"
            className="w-52 px-4 py-2 my-4 text-2xl text-black bg-white rounded-full"
            onClick={onSkip}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
