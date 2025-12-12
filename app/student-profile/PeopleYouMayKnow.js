"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Buttonborder } from "../components/Button";
import LinkButton from "../components/button/Button";
import FollowButton from "../components/FollowButton";
import CollabButton from "../components/CollabButton";
import { FIELD_LIMITS } from "../constents/constents";
import { ProfileAvatar } from "../components/ProfileAvatar";

import { TruncateText } from "../helper/truncateText";
import FollowButtonUniversal from "../components/FollowButton";

// function ProfileAvatar({ name, image, className=""}) {
//   const [imgError, setImgError] = useState(false);

//   if (!image || imgError) {
//     return (
//       <div className={`w-[60px] h-[60px] flex items-center justify-center bg-gray-200 text-gray-600 font-semibold rounded-[20px] ${className} `}>
//         {name ? name.charAt(0).toUpperCase() : "?"}
//       </div>
//     );
//   }

//   return (
//     <img
//       src={image}
//       alt={name}
//       width={55}
//       height={55}
//       className={`rounded-[20px] w-[55px] h-[55px] object-cover border ${className} `}
//       onError={() => setImgError(true)}
//     />
//   );
// }

export default function PeopleYouMayKnow({
  users = [],
  currentUserId = null,
  limit = 2,
}) {
  const suggestions = (users && users.length ? users : []).filter(
    (u) => u.id !== currentUserId
  );
  const list = suggestions.slice(0, limit);

  return (
    <div className="p-5 bg-[#ffffff] rounded-[25px] border border-gray-700">
      <h2 className="text-gray-600 font-semibold text-[18px] my-2">
        People You May Know
      </h2>
      <div className="space-y-5">
        {list.map((person) => (
          <div key={person.id} className="border-b border-gray-500 pb-4">
            {/* Avatar + Name */}
            <Link
              href={`/in/${person.username}`}
              className="flex items-center gap-3"
            >
              <ProfileAvatar name={person.name} image={person.avatar} />
              <div>
                <h4 className="font-semibold  text-gray-700 hover:underline">
                  {TruncateText(person.name, FIELD_LIMITS.name)}
                </h4>
                <p className="text-xs text-gray-600">
                  {TruncateText(person.headline || "", 40)}
                </p>
              </div>
            </Link>

            {/* About */}

            <p className="text-[12px] my-1 text-gray-600">
              {" "}
              {person.about &&
                TruncateText(
                  person.about,
                  FIELD_LIMITS.youmaynowabout,
                  true,
                  "more"
                )}
            </p>

            {/* Buttons */}
            <div className="mt-3 flex gap-2">
              <div className="w-full md:w-[45%]">
                {/* <FollowButton targetId={person.id} followclassName="w-full" /> */}
                <FollowButtonUniversal
                  targetId={person.id}
                  targetType="user"
                  followclassName="w-full"
                />
              </div>
              <div className="w-full md:w-[45%]">
                <CollabButton targetId={person.id} collabclass="w-full" />
              </div>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <p className="text-sm text-gray-400">No suggestions yet.</p>
        )}
      </div>

      {/* show "View All" if more users than limit */}
      {suggestions.length > limit && (
        <div className="text-center my-3">
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
