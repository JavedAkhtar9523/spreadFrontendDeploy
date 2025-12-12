"use client";
import React, { useEffect, useState } from "react";
import {
  MdLocationOn,
  MdEmail,
  MdVerifiedUser,
  MdSchool,
} from "react-icons/md";
import { FaRegCalendarAlt, FaUniversity } from "react-icons/fa";
import Link from "next/link";
import ProfileTopSection from "./ProfileTopSection";
import { useDispatch, useSelector } from "react-redux";
import { TruncateText } from "../helper/truncateText";
import { FIELD_LIMITS } from "../constents/constents";
import { MapPin } from "lucide-react";

export default function ProfileHeader({ user }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.users.currentUser)
  const isOwner = currentUser?.id === user?.id;
  const displayUser = isOwner ? currentUser : user;

  // College onboarding state
  const [showCollegeOnboarding, setShowCollegeOnboarding] = useState(false);
  const [showCollegeInfo, setShowCollegeInfo] = useState(false);
  const [isCollegeAccount, setIsCollegeAccount] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(displayUser?.followersCount || 0);
  const [following, setFollowing] = useState(displayUser?.followingCount || 0);
  const [collabs, setCollabs] = useState(displayUser?.collabsCount || 0);

  // Check if user is a college account
  useEffect(() => {
    if (displayUser) {
      setFollowers(displayUser.followersCount || 0);
      setFollowing(displayUser.followingCount || 0);
      setCollabs(displayUser.collabsCount || 0);

      // Check if user has college role or college-specific data
      setIsCollegeAccount(
        displayUser.role === "college" ||
        displayUser.accountType === "college" ||
        displayUser.isCollege === true
      );
    }
  }, [displayUser]);

  useEffect(() => {
    setIsFollowing(Boolean(currentUser?.following?.includes(user?.id)));
  }, [currentUser?.following, user?.id]);

  const rightColumnItems = [
    ...(displayUser.experience || []),
    ...(displayUser.college
      ? Array.isArray(displayUser.college)
        ? displayUser.college
        : [displayUser.college]
      : []),
  ]
    .slice(0, 2)
    .map((item) => ({
      ...item,
      logo: item.logo || "/placeholder.png",
      company: item.company || item.name || "",
    }));

  if (!displayUser) {
    return <div className="p-4 text-gray-400">Loading profile...</div>;
  }

  // College action button for non-college users - FIXED
  const CollegeActionButton = () => {
    if (isCollegeAccount || !isOwner) return null;

    return (
      <button 
        onClick={() => setShowCollegeOnboarding(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
      >
        <FaUniversity className="w-4 h-4" />
        <span>Claim College Account</span>
      </button>
    );
  };

  return (
    <div className="mt-5 border border-[#aeadad] rounded-xl bg-white">

      {/* Main Profile Content */}

      <div className="mb-14">
        <ProfileTopSection user={displayUser} />
      </div>

      <div className="flex flex-col md:flex-row gap-2 px-10 ">
        <div className="w-full md:w-[60%]">
          <div className="flex items-center gap-2">
            <h2 className="text-lg  font-semibold text-gray-900 flex gap-2 items-center font-josefin">
              {TruncateText(displayUser.name, FIELD_LIMITS.name)}
              {displayUser.verified && (
                <MdVerifiedUser className="text-blue-500" />
              )}
            </h2>
          </div>

          {displayUser.headline && (
            <p className="sm:text-[13px] text-[#303a53] break-words">
              {displayUser.headline}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-gray-600 text-xs font-medium my-1 mr-1">
            {displayUser.location && (
              <div className="flex items-center">
                <MapPin size={14} className="text-[#585a5e]" />
                <p>
                  {TruncateText(displayUser.location, FIELD_LIMITS.location)}
                </p>
              </div>
            )}

            {displayUser.email && (
              <div className="flex items-center">
                <MdEmail size={14} />
                <p className="text-blue-600 hover:underline cursor-pointer">{displayUser.email}</p>
              </div>
            )}

            {displayUser.joined && (
              <div className="flex items-center">
                <FaRegCalendarAlt size={14} />
                <p>Joined {displayUser.joined}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-10">
              <Link href="/collabs" className="flex flex-col items-center">
                <span className="text-[12px] font-semibold text-blue-500">
                  {collabs} Collabs
                </span>
              </Link>
              <Link
                href="/network-manager/followers"
                className="flex flex-col items-center"
              >
                <span className="text-[12px] font-semibold text-blue-500">
                  {followers} Followers
                </span>
              </Link>
              <Link
                href="/network-manager/following"
                className="flex flex-col items-center"
              >
                <span className="text-[12px] font-semibold text-blue-500">
                  {following} Following
                </span>
              </Link>
            </div>

          
          </div>

          {/* VISIT MY WEBSITE OPTION */}
          {user?.website && (
            <div
              onClick={() => window.open(user.website.startsWith("http") ? user.website : `https://${user.website}`, "_blank")}
              className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-5 h-5 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c4.97 0 9 4.03 9 9 0 4.97-4.03 9-9 9s-9-4.03-9-9c0-4.97 4.03-9 9-9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.502 5 12 5c4.498 0 8.268 2.943 9.542 7M12 19c-2.63-3.2-3.862-6.4-3.725-9.6M12 19c2.63-3.2 3.862-6.4 3.725-9.6"
                />
              </svg>
              <span className="text-sm font-medium text-blue-800">
                Visit my Website
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}