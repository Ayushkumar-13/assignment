import React, { useEffect, useRef, useState, useMemo } from "react";
import ReelCard from "../../components/ReelCard";

const videoSources = [
  "/videos/video1.mp4",
  "/videos/video2.mp4",
  "/videos/video3.mp4",
];

export default function Reels() {
  const dummyReels = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i + 1,
      video: videoSources[i % videoSources.length],
      author: `user${i + 1}`,
      caption: `Enjoy this awesome video #${i + 1}`,
    }));
  }, []);

  const [reels, setReels] = useState(dummyReels.slice(0, 4));
  const [page, setPage] = useState(1);
  const containerRef = useRef(null);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const more = dummyReels.slice(page * 4, (page + 1) * 4);
    if (more.length > 0) {
      setReels((prev) => {
        const newReels = [...prev, ...more];

        // 🔐 Ensure no duplicate keys by filtering by unique IDs
        const uniqueReels = Array.from(
          new Map(newReels.map((r) => [r.id, r])).values()
        );

        return uniqueReels;
      });
    }
  }, [page, dummyReels]);

  // Scroll with arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      const container = containerRef.current;
      if (!container) return;

      if (e.key === "ArrowDown") {
        container.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        container.scrollBy({ top: -window.innerHeight, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="w-full min-h-screen overflow-y-scroll snap-y snap-mandatory text-white no-scrollbar"
      ref={containerRef}
      tabIndex={0}
    >
      <div className="w-full max-w-[420px] mx-auto">
        {reels.map((reel) => (
          <div key={reel.id} className="snap-start my-3">
            <ReelCard reel={reel} />
          </div>
        ))}
      </div>
    </div>
  );
}
