"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followEntitySuccess, unfollowEntitySuccess } from "../store/userSlice";

export default function FollowButtonUniversal({
  targetId,
  targetType = "user", // or "company"
  followclassName = "",
}) {
  const dispatch = useDispatch();
  const [hydrated, setHydrated] = useState(false);
  const { currentUser, users, companies } = useSelector((s) => s.users || {});

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || !currentUser) return null;

  const targetList = targetType === "user" ? users : companies;
  const target = targetList?.find((t) => t.id === targetId);

  const isFollowing = currentUser.following?.includes(targetId);

  const handleFollowToggle = () => {
    const payload = {
      followerId: currentUser.id,
      targetId,
      targetType,
    };

    if (isFollowing) dispatch(unfollowEntitySuccess(payload));
    else dispatch(followEntitySuccess(payload));
  };

  return (
    <button
      onClick={handleFollowToggle}
      className={`text-[12px] flex justify-center items-center bg-[#1529ff] gap-1 px-3 py-2.5 rounded-full 
       font-semibold text-white hover:cursor-pointer ${followclassName}`}
    >
      {isFollowing ? "Following" : "+ Follow"}
    </button>
  );
}
