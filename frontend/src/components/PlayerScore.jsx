import { useState, useEffect } from "react";

function getKaraokeResult() {
  const min = 55;
  const max = 100;
  const score = Math.floor(Math.random() * (max - min + 1)) + min;

  let message = "";
  let emoji = "";

  if (score === 100) {
    message = "Uwian na may nanalo na!";
    emoji = "👑🔥";
  } else if (score >= 95) {
    message = "Absolute Rockstar! A perfect performance!";
    emoji = "👑🔥";
  } else if (score >= 85) {
    message = "Amazing job! The crowd loves you!";
    emoji = "👏🎤";
  } else if (score >= 70) {
    message = "Good effort! You've got some rhythm!";
    emoji = "🎵👍";
  } else {
    message = "Keep practicing! Don't quit your day job just yet.";
    emoji = "💔😂";
  }

  return { score, message, emoji };
}

function getTwoDigitString(min = 0, max = 99) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return String(num).padStart(2, "0");
}

const audio = new Audio("/score.mp3");

export default function PlayerScore({ callback }) {
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const result = getKaraokeResult();

  useEffect(() => {
    const duration = 1000;
    const intervalTime = 80;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;

      if (elapsed < duration) {
        setScore(getTwoDigitString(0, 99));
      } else {
        setScore(result.score);
        setMessage(result.message);

        audio.volume = 0.5;
        audio.play();

        clearInterval(timer);
        setTimeout(callback, 10000);
      }
    }, intervalTime);
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center flex-col">
        <div className="font-heading text-9xl z-1">{score}</div>
        {message && <div className="z-1 text-2xl">{message}</div>}
      </div>
      <video
        className="fixed -top-25 w-auto min-w-full min-h-[120%] max-w-none opacity-60"
        autoPlay
        loop
        muted
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
