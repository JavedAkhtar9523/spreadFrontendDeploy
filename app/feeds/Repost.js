// components/post/RepostCard.jsx
"use client";
import React from "react";
import Link from "next/link";
import { FaShare } from "react-icons/fa";
import PostCard from "./PostCard";

export default function RepostCard({ post, originalPost, ...handlers }) {
  // originalPost expected to be the actual post object (found by parent)
  return (
    <div className="w-full p-8">
      <div className="flex items-center text-gray-400 text-sm">
        <FaShare className="" /> {post.user.name}
        <Link href={`/profile/${post.user.username}`} className="text-gray-600 ms-4 font-medium hover:underline">         
        </Link>{" "}
       <span className="text-gray-600">+ 4 other  reposted </span>
      </div>

      <div className="">
        <PostCard post={originalPost} {...handlers} />
      </div>
    </div>
  );
}
