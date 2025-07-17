// src/components/PostCard.jsx
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, text: "Great post!", replies: [] },
    { id: 2, text: "Nice shot!", replies: [] },
    { id: 3, text: "Love this!", replies: [] },
  ]);
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const toggleLike = () => setLiked(!liked);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment,
        replies: [],
      };
      setComments([comment, ...comments]);
      setNewComment("");
      setShowCommentInput(false); // Close comment input after submitting
    }
  };

  return (
    <div className="shadow rounded p-4 break-inside-avoid transition duration-300 border border-gray-200 bg-white dark:bg-white">
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-2">
        <img
          src={`https://i.pravatar.cc/150?u=${post.author}`}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <div className="font-semibold">{post.author}</div>
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </div>
        </div>
      </div>

      {/* Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="rounded w-full object-cover mb-3"
        />
      )}

      {/* Caption */}
      <p className="mb-2 text-sm">{post.caption}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={toggleLike}
          className="text-lg hover:scale-110 transition-transform"
        >
          {liked ? "❤️" : "🤍"}
        </button>
        <span>{post.likes + (liked ? 1 : 0)} likes</span>
        <button onClick={() => setShowCommentInput(!showCommentInput)}>
          💬 {comments.length} comments
        </button>
      </div>

      {/* Comment Input (conditional) */}
      {showCommentInput && (
        <form onSubmit={handleCommentSubmit} className="mb-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full border rounded px-3 py-1 text-sm"
          />
        </form>
      )}

      {/* Comments Section */}
      {showCommentInput && (
        <div className="space-y-1 max-h-40 overflow-y-auto pr-2 text-sm">
          {comments.map((c, i) => (
            <div key={c.id} className="text-gray-700">
              <strong>{post.author}</strong>: {c.text}
              {/* Replies UI */}
              {c.replies.length > 0 && (
                <div className="ml-4 mt-1 space-y-1">
                  {c.replies.map((r, j) => (
                    <div key={j} className="text-xs text-gray-600">
                      ↳ {r}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
