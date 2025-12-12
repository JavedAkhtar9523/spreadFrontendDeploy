"use client";
import React from "react";
import { useSelector } from "react-redux";
import CollabButton from "../../../components/CollabButton";
import FollowButtonUniversal from "../../../components/FollowButton";
import { TruncateText } from "../../../helper/truncateText";

export default function CollabStep({ data, updateData }) {
  const { users, companies } = useSelector((s) => s.users);

  // PEOPLE → From Redux Users
  const people = users?.length
    ? users.map((u) => ({
        id: u.id,
        name: u.fullName || u.name,
        avatar: u.avatar || "/default-user-profile.svg",
        desc: u.position || "Content Writer | Seo",
        headline:
          u.headline ||
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        type: "user",
      }))
    : [];

  // COMPANIES → Redux Companies
  const companyList = companies?.length
    ? companies.map((c) => ({
        id: c.id,
        name: c.companyName || c.name,
        avatar: c.logo || "/default-company.svg",
        desc: c.tagline || "Innovating the future",
        headline:
          c.about ||
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        type: "company",
      }))
    : [];

  // COLLEGES → Fallback dummy
  const fallbackColleges = [
    {
      id: "clg1",
      name: "Awadhesh Pratap Singh University",
      avatar: "/default-user-profile.svg",
      desc: "Higher Education",
      headline: "Where innovation meets excellence.",
      type: "college",
    },
    {
      id: "clg2",
      name: "IIT",
      avatar: "/default-user-profile.svg",
      desc: "Top Technical Institute",
      headline: "Crafting world-class engineers.",
      type: "college",
    },
    {
      id: "clg3",
      name: "ISB Hyderabad",
      avatar: "/default-user-profile.svg",
      desc: "Business School",
      headline: "Shaping future leaders.",
      type: "college",
    },
  ];

  const colleges = fallbackColleges;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* ===== 3 COLUMN GRID ===== */}
        <SectionBox title="People" items={people} />
        <SectionBox title="Companies" items={companyList} />
        <SectionBox title="College & University" items={colleges} />
      </div>
    </div>
  );
}

function SectionBox({ title, items }) {
  return (
    <div className="p-4 bg-[#b9d9f933] rounded-xl">
      <h3 className="text-[18px] text-[#020BA7FC] font-semibold mb-4 text-center">
        {title}
      </h3>

      {/* VERTICAL SCROLL COLUMN */}
      <div className="flex flex-col gap-4 overflow-y-auto custom-scroll max-h-[380px] scrollbar-hide">
        {items.map((x) => (
          <div key={x.id} className="w-full pb-4 border-b border-[#B2B7BD]">
            {/* Avatar + Name */}
            <div className="flex items-start gap-3">
              <img
                src={x.avatar}
                className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                alt=""
              />

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-[16px] text-[#373E41] truncate">
                  {x.name}
                </h4>
                <p className="text-gray-600 text-[13px] font-medium">
                  {x.desc}
                </p>
                <p className="text-gray-500 text-[12px] line-clamp-2">
                  {TruncateText(x.headline, 65, false)}
                </p>

                {/* BUTTONS */}
                <div className="mt-2">
                  {x.type === "user" ? (
                    <CollabButton targetId={x.id} />
                  ) : (
                    <FollowButtonUniversal
                      targetId={x.id}
                      targetType={x.type === "company" ? "company" : "college"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
