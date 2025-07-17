import React, { useEffect, useState } from "react";
import ReelCard from "../../components/ReelCard";

const videoSources = [
  "/videos/video1.mp4",
  "/videos/video2.mp4",
  "/videos/video3.mp4",
  
];

const dummyReels = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  video: videoSources[i % videoSources.length],
  author: `user${i + 1}`,
  caption: `Enjoy this awesome video #${i + 1}`,
}));

export default function Reels() {
  const [reels, setReels] = useState(dummyReels.slice(0, 4));
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const more = dummyReels.slice(page * 4, (page + 1) * 4);
    if (more.length > 0) {
      setReels((prev) => [...prev, ...more]);
    }
  }, [page]);

  return (
    <div className="bg-white text-black w-full overflow-x-hidden">
      {reels.map((reel) => (
        <ReelCard key={reel.id} reel={reel} />
      ))}
    </div>
  );
}
