"use client";
import React from "react";
import { useSelector } from "react-redux";
import CollabButton from "../../../components/CollabButton";
import FollowButtonUniversal from "../../../components/FollowButton";
// import { TruncateText } from "../../helper/truncateText";

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
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
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
          c.about || "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
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
      name: "IIT Delhi",
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
    {
      id: "clg4",
      name: "Delhi University",
      avatar: "/default-user-profile.svg",
      desc: "Central University",
      headline: "Excellence in education since 1922.",
      type: "college",
    },
    {
      id: "clg5",
      name: "BITS Pilani",
      avatar: "/default-user-profile.svg",
      desc: "Premier Institute",
      headline: "Innovation and research hub.",
      type: "college",
    },
  ];

  const colleges = fallbackColleges;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SectionBox title="People" items={people} />
        <SectionBox title="Companies" items={companyList} />
        <SectionBox title="Colleges & Universities" items={colleges} />
      </div>
    </div>
  );
}

function SectionBox({ title, items }) {
  if (!items || items.length === 0) {
    return (
      <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 text-center">
          {title}
        </h3>
        <p className="text-center text-gray-500 text-sm">
          No {title.toLowerCase()} available
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
      <h3 className="text-lg font-semibold text-blue-900 mb-4 text-center">
        {title}
      </h3>

      {/* VERTICAL SCROLL COLUMN */}
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[450px] pr-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
        {items.map((x) => (
          <div
            key={x.id}
            className="w-full p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all"
          >
            {/* Avatar + Name */}
            <div className="flex items-start gap-3 mb-3">
              <img
                src={x.avatar}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-gray-100"
                alt={x.name}
              />

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                  {x.name}
                </h4>
                <p className="text-gray-600 text-xs line-clamp-1">{x.desc}</p>
              </div>
            </div>

            {/* Headline */}
            <p className="text-gray-500 text-xs line-clamp-2 mb-3 min-h-[32px]">
              {x.headline}
            </p>

            {/* Button */}
            <div className="mt-auto">
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
        ))}
      </div>
    </div>
  );
}
