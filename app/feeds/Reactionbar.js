import React from "react";

export default function ReactionBar({ post, onLike, onComment, onRepost }) {
  return (
    <div className="flex justify-between items-center mt-3 text-gray-300">
      <div className="flex gap-4 items-center">
        <button onClick={onLike} className="flex items-center gap-1 hover:text-white">
          ❤️ <span className="text-xs">{post.likes?.length || 0}</span>
        </button>
        <button onClick={onComment} className="flex items-center gap-1 hover:text-white">
          💬 <span className="text-xs">{post.commentsCount || 0}</span>
        </button>
        <button onClick={onRepost} className="flex items-center gap-1 hover:text-white">
          🔁 <span className="text-xs">{post.reposts?.length || 0}</span>
        </button>
      </div>
      <div className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</div>
    </div>
  );
}
