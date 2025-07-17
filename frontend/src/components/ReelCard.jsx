import React, { useRef, useState, useEffect } from "react";
import { Heart, MessageCircle, Edit, Trash, Share2 } from "lucide-react";

export default function ReelCard({ reel }) {
  const videoRef = useRef();
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [showTapLike, setShowTapLike] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (video) {
          if (entry.isIntersecting) {
            video.muted = false;
            video.play().catch((e) => console.warn("Autoplay failed", e));
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.75 }
    );

    const current = videoRef.current;
    if (current) observer.observe(current);
    return () => current && observer.unobserve(current);
  }, []);

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const onDoubleClick = () => {
    setLiked(true);
    setShowTapLike(true);
    setTimeout(() => setShowTapLike(false), 800); // Heart disappears after 0.8s
  };

  const handleHashtags = (text) => {
    return text.split(/(#[a-zA-Z0-9_]+)/g).map((part, i) =>
      part.startsWith("#") ? (
        <span key={i} className="text-blue-500">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments([{ user: "you", text: commentInput }, ...comments]);
    setCommentInput("");
    setShowComments(false);
  };

  const handleDelete = (index) => {
    setComments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditText(comments[index].text);
  };

  const handleEditSave = () => {
    const updated = [...comments];
    updated[editingIndex].text = editText;
    setComments(updated);
    setEditingIndex(null);
    setEditText("");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + reel.video);
    alert("Video link copied to clipboard!");
  };

  return (
    <div className="relative w-full h-[92vh] flex items-center justify-center rounded-lg shadow overflow-hidden">
      <video
        ref={videoRef}
        src={reel.video}
        loop
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        onClick={handleTogglePlay}
        onDoubleClick={onDoubleClick}
      />

      {/* Double-tap like heart animation */}
      {showTapLike && (
        <Heart
          size={80}
          className="absolute text-white animate-ping pointer-events-none left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          fill="white"
          stroke="white"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between px-4 py-6 z-10 pointer-events-none">
        <div />

        <div className="flex justify-between items-end pointer-events-auto">
          {/* Left Content */}
          <div className="space-y-2 max-w-[75%] text-white">
            <h2 className="font-bold text-lg">@{reel.author}</h2>
            <p className="text-sm">{handleHashtags(reel.caption)}</p>
          </div>

          {/* Right Icons */}
          <div className="flex flex-col items-center gap-4 text-white mr-2">
            <button onClick={() => setLiked(!liked)}>
              <Heart
                fill={liked ? "red" : "none"}
                stroke={liked ? "red" : "white"}
                className="transition-colors duration-300"
              />
            </button>
            <button onClick={() => setShowComments(!showComments)}>
              <MessageCircle />
            </button>
            <button onClick={handleShare}>
              <Share2 />
            </button>
          </div>
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="absolute bottom-0 left-0 w-full bg-white bg-opacity-95 p-4 backdrop-blur z-20 max-h-72 overflow-y-auto text-black">
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 border rounded p-1"
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button type="submit" className="px-3 bg-blue-500 text-white rounded">
              Post
            </button>
          </form>
          <div className="space-y-2">
            {comments.map((c, i) => (
              <div key={i} className="text-sm flex flex-col gap-1">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold">@{c.user}:</span>
                  {editingIndex === i ? (
                    <div className="flex gap-1">
                      <input
                        type="text"
                        className="border p-1 rounded"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <button onClick={handleEditSave} className="text-green-600 text-xs">
                        Save
                      </button>
                    </div>
                  ) : (
                    <span className="flex-1">{handleHashtags(c.text)}</span>
                  )}
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(i)} className="text-xs text-gray-500">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(i)} className="text-xs text-red-500">
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
