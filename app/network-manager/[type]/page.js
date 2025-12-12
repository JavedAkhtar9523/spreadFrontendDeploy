"use client";
import { useSelector } from "react-redux";
import Link from "next/link";
import FollowButton from "../../components/FollowButton";
import { useState } from "react";
import Pagination from "../../components/Pagination";

export default function NetworkPage({ params }) {
  const { type } = params; // followers | following
  const { currentUser, users } = useSelector((s) => s.users);
  const [page, setPage] = useState(1);
  const perPage = 50;

  if (!currentUser)
    return <p className="p-5 text-gray-500">No user logged in.</p>;

  // ✅ Select data depending on type
  let people = [];
  if (type === "following") {
    const followingIds = currentUser.following || [];
    people = users.filter((u) => followingIds.includes(u.id));
  } else if (type === "followers") {
    const followerIds = currentUser.followers || [];
    people = users.filter((u) => followerIds.includes(u.id));
  }

  const total = people.length;
  const start = (page - 1) * perPage;
  const paginated = people.slice(start, start + perPage);

  return (
    <div className="p-8 bg-[#070C11] md:p-16 h-screen">
      {/* ✅ SEO-friendly Heading */}
      <h1 className="text-2xl font-semibold text-white mb-2">
        {type === "following"
          ? `${currentUser.name} is Following (${total}) People`
          : `${currentUser.name}’s Followers (${total})`}
      </h1>

      {/* ✅ Description (SEO optimized paragraph) */}
      <p className="text-gray-300 mb-6">
        {type === "following"
          ? `These are the ${total} people whose updates and posts you’re following.`
          : `These are the ${total} people who follow your updates and posts.`}
      </p>

      {/* ✅ List Section */}
      {paginated.length === 0 && (
        <p className="text-gray-400">No {type} yet.</p>
      )}

      <div className="space-y-4">
        {paginated.map((person) => (
          <div
            key={person.id}
            className="flex justify-between items-center border-b border-gray-700 pb-3"
          >
            <Link
              href={`/in/${person.username}`}
              className="flex items-center gap-3"
            >
              <img
                src={person.avatar}
                alt={person.name}
                className="w-12 h-12 rounded-full border"
              />
              <div>
                <p className="font-semibold text-white">{person.name}</p>
                <p className="text-sm text-gray-400">{person.headline}</p>
              </div>
            </Link>

            <FollowButton targetId={person.id} />
          </div>
        ))}
      </div>

      {/* ✅ Reusable Pagination */}
      <Pagination
        page={page}
        total={total}
        perPage={perPage}
        onPageChange={setPage}
      />
    </div>
  );
}
