// src/components/ReelCard.jsx
import React, { useRef, useState, useEffect } from "react";
import { Heart, MessageCircle, Volume2, VolumeX, Edit, Trash } from "lucide-react";

export default function ReelCard({ reel }) {
  const videoRef = useRef();
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentInput.trim() === "") return;
    setComments([{ user: "you", text: commentInput }, ...comments]);
    setCommentInput("");
    setShowComments(false);
  };

  const handleDelete = (index) => {
    const newComments = [...comments];
    newComments.splice(index, 1);
    setComments(newComments);
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

  const handleHashtags = (text) => {
    return text.split(/(#[a-zA-Z0-9_]+)/g).map((part, i) =>
      part.startsWith("#") ? (
        <span key={i} className="text-blue-500">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      },
      { threshold: 0.8 }
    );
    const current = videoRef.current;
    if (current) observer.observe(current);
    return () => observer.unobserve(current);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        src={reel.video}
        loop
        muted={muted}
        autoPlay
        playsInline
        className="w-full h-full object-contain"
      />

      <div className="absolute bottom-24 left-4 text-black z-10">
        <h2 className="font-bold text-lg">@{reel.author}</h2>
        <p className="text-sm max-w-xs line-clamp-3">{handleHashtags(reel.caption)}</p>
      </div>

      <div className="absolute bottom-24 right-4 flex flex-col items-center gap-5 z-10">
        <button
          onClick={() => setLiked(!liked)}
          className="text-2xl transition-transform duration-150"
        >
          <Heart fill={liked ? "red" : "none"} stroke={liked ? "red" : "black"} />
        </button>
        <button onClick={() => setShowComments(!showComments)} className="text-2xl">
          <MessageCircle />
        </button>
        <button
          onClick={() => {
            setMuted((prev) => {
              const newMuted = !prev;
              videoRef.current.muted = newMuted;
              return newMuted;
            });
          }}
          className="text-2xl"
        >
          {muted ? <VolumeX /> : <Volume2 />}
        </button>
      </div>

      {showComments && (
        <div className="absolute bottom-0 left-0 w-full bg-white bg-opacity-90 p-4 backdrop-blur z-20 max-h-72 overflow-y-auto">
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 border rounded p-1"
              placeholder="Add a comment... 😊"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button
              type="submit"
              className="px-3 bg-blue-500 text-white rounded"
            >
              Post
            </button>
          </form>
          <div className="space-y-2">
            {comments.map((c, i) => (
              <div key={i} className="text-sm flex flex-col gap-1">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold">@{c.user}: </span>
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