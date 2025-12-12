"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import FollowButtonUniversal from "../components/FollowButton";
import LinkButton from "../components/button/Button";

export default function CompanySuggestion({ profileUser }) {
  const dispatch = useDispatch();
  const { currentUser, companies } = useSelector((state) => state.users);

  const activeUser = profileUser || currentUser;

  const recommended = companies
    ?.map((c) => {
      const skillScore = c.tags.filter((tag) =>
        activeUser.skills.includes(tag)
      ).length;

      const fieldMatch = activeUser.interests?.some((interest) =>
        c.field.toLowerCase().includes(interest.toLowerCase())
      );

      const locationMatch = c.location === activeUser.location ? 2 : 0;

      const mutualConnections = c.employees.filter((id) =>
        activeUser.following.includes(id)
      ).length;

      const popularityScore = Math.min(c.followers.length / 1000, 5);

      const totalScore =
        skillScore * 4 +
        (fieldMatch ? 3 : 0) +
        locationMatch * 2 +
        mutualConnections * 1 +
        popularityScore * 0.5;

      return { ...c, totalScore, mutualConnections };
    })
    .filter((c) => c.totalScore > 0)
    .sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="p-5 bg-[#f4f9ff] rounded-[25px] border border-gray-700">
      <h2 className="text-lg font-semibold text-gray-700 text-[18px] mb-3">
        Best Match For You
      </h2>

      {recommended.length ? (
        recommended.splice(0, 3).map((c) => {
          const isFollowing = c.followers.includes(activeUser.id);

          return (
            <div key={c.id} className="border-b my-4 border-gray-500">
              <div>
                <img
                  src={c.logo}
                  alt={c.name}
                  className="w-10 h-10 rounded-full"
                />
                <h3 className="font-semibold mt-2">{c.name}</h3>
                <p className="text-[12px] my-1 text-[#000000]">{c.about}</p>
                <p className="text-[14px] text-[#000000]">{c.field}</p>

                <p className="text-xs text-gray-600 mt-1">
                  👥 {c.followers.length.toLocaleString()} followers
                  {c.mutualConnections > 0 && (
                    <> · {c.mutualConnections} connections work here</>
                  )}
                </p>
              </div>

              <div className="flex gap-2 my-2">

                <FollowButtonUniversal
                  targetId={c.id}
                  targetType="company"
                  followclassName="w-full"
                />
               
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-600 text-sm">No company matches found.</p>
      )}

      {recommended.length > 3 && (
        <div className="text-center">
          <LinkButton
            showIcon={false}
            href="/collabs"
            name="View All"
            linkclassname="!text-[14px] "
          />
        </div>
      )}
    </div>
  );
}
