import { useEffect, useRef, useState } from "react";

export default function MarqueeTitle({ title }) {
  const viewportRef = useRef(null);
  const textRef = useRef(null);
  const [overflow, setOverflow] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    const text = textRef.current;
    if (!viewport || !text) return;

    const measure = () =>
      setOverflow(Math.max(0, text.scrollWidth - viewport.clientWidth));

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(text);
    measure();

    return () => observer.disconnect();
  }, [title]);

  return (
    <div ref={viewportRef} className="marquee-viewport" title={title}>
      <span
        ref={textRef}
        className={
          overflow > 0 ? "marquee-text is-overflowing" : "marquee-text"
        }
        style={{
          "--marquee-distance": `${overflow}px`,
          "--marquee-duration": `${Math.max(0.2, overflow / 60)}s`,
        }}
      >
        {title}
      </span>
    </div>
  );
}
