"use client";
import React, { use, useTransition } from "react";
import { useSelector } from "react-redux";
import ProfileHeader from "../../student-profile/Profileheader";
import DesignerProfile from "../../student-profile/DesignerProfile";
import PeopleYouMayKnow from "../../student-profile/PeopleYouMayKnow";
import ProfileAnalytics from "../../student-profile/ProfileAnalytics";
import { users } from "../../constents/constents";
import JoinCommunities from "../../student-profile/JoinCommunities";
import CompanySuggestion from "../../student-profile/companySuggestion";
import Edge from "../../student-profile/Edge";
import { GlobalLoader } from "../../components/Loader";

export default function UserProfilePage({ params }) {
  const [isPending, startTransition] = useTransition();
  const { username } = use(params);
  const user = users.find((u) => u.username === username);
  const currentUser = useSelector((state) => state.users?.currentUser);
  const isOwner = currentUser?.id === user?.id;
  console.log("Rendering UserProfilePage for: user", user);
  console.log("currentUser:", currentUser);
  if (isPending) {
    return <GlobalLoader text="Loading Profile..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fff] text-black p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold">User not found</h2>
        <p className="text-gray-400 mt-2">
          No profile exists for <strong>{username}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-screen bg-[#fafafa] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-1 px-16 flex-col md:flex-row transition-all gap-12 lg:gap-20 duration-300">
        <section className="w-full lg:w-3/4 space-y-6">
          <ProfileHeader user={user} />
          {/* <DesignerProfile user={user} /> */}
          {/* <Edge user={user} /> */}
        </section>

        {/* <aside className="w-full lg:max-w-[300px] flex flex-col gap-4">
          {isOwner && <ProfileAnalytics />}
          <CompanySuggestion profileUser={user} />
          <PeopleYouMayKnow users={users} currentUserId={user.id} limit={2} />
          <JoinCommunities />
        </aside> */}
      </div>
    </div>
  );
}
