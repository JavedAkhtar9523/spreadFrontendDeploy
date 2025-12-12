"use client";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { users } from "../../../constents/constents";
import PostCard from "../../../feeds/PostCard";

export default function ActivityPage() {
  const { type } = useParams(); // "all" | "posts" | "comments" | "likes" | "repost"
  const user = users[0];

  // Tab Config
  const tabs = [
    { key: "all", label: "Posts" },
    //     { key: "posts", label: "Posts" },
    { key: "comments", label: "Comments" },
    { key: "likes", label: "Likes" },
    { key: "repost", label: "Repost" },
  ];

  const activeTab = type || "all";

  // Filter Data
  let items = [...user.posts];
  if (activeTab !== "all") {
    const map = {
      posts: "Posts",
      comments: "Comments",
      likes: "Likes",
      repost: "Repost",
    };
    items = items.filter((p) => p.activity === map[activeTab]);
  }

  // Recent → Old
  items.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="flex flex-col px-10 lg:px-16 mt-4 md:flex-row gap-8 lg:gap-16">
        {/* LEFT SECTION */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <h1 className="text-2xl font-bold text-white mb-6">Activity</h1>

          {/* Tabs */}
          <div className="flex gap-3 mb-6 border-b border-gray-700 pb-2 flex-wrap">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                href={`/profile/activity/${tab.key}`}
                className={`px-4 py-1 rounded-full transition ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-[#0f172a] to-[#0b2540] text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Content */}
          {items.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {items.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No activity found.</p>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="hidden md:block md:w-1/3 lg:w-1/4">
          <div className="bg-[#0f172a] p-4 rounded-lg shadow-md text-gray-300">
            <h3 className="text-lg font-semibold text-white mb-4">
              Right Section
            </h3>
            <p>Suggested profiles, ads, or analytics can go here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================
