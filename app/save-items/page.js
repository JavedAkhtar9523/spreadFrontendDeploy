"use client";

import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSaveItem, selectCurrentUser } from "../store/userSlice";
import { Trash2, Bookmark } from "lucide-react";
import LinkButton from "../button/Button";

export default function SavedItemsPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = React.useState("posts");

  // dynamically filter saved items by type
  const savedItems = useMemo(() => {
    if (!currentUser?.saved) return [];
    const ids = currentUser.saved[activeTab] || [];
    const items = (currentUser[activeTab] || []).filter((x) =>
      ids.includes(x.id)
    );
    return items;
  }, [activeTab, currentUser]);

  const handleRemove = (type, id) => {
    dispatch(toggleSaveItem({ type, id }));
  };

  return (
    <div className=" bg-[#070C11] text-gray-100 font-inter">
      {/* Sidebar */}
      <aside className=" bg-[#0C121A] border-r border-gray-800 p-5 ">
        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-blue-400" /> Saved Items
        </h2>
        <div className="flex justify-between mt-3">
          {Object.keys(currentUser?.saved || {}).map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`block w-full text-left px-3 py-2 rounded-md mb-2 capitalize transition ${
                activeTab === type
                  ? "bg-blue-900/30 text-blue-400 font-medium"
                  : "hover:bg-[#111924] text-gray-300"
              }`}
            >
              {type}
              <span className="text-gray-500 ml-2">
                ({currentUser.saved[type]?.length || 0})
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-5 capitalize text-white">
          Saved {activeTab}
        </h1>

        {savedItems.length === 0 ? (
          <p className="text-gray-500 mt-20 text-center">
            No saved {activeTab} yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {savedItems.map((item) => (
              <div key={item.id} className="relative group">
                {/* Dynamic Card Render */}
                {renderCardByType(item, activeTab, () =>
                  handleRemove(activeTab, item.id)
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// 🎨 TYPE-WISE CARD DESIGN
function renderCardByType(item, type, onRemove) {
  switch (type) {
    case "posts":
      return <PostCard item={item} onRemove={onRemove} />;
    case "courses":
      return <CourseCard item={item} onRemove={onRemove} />;
    case "mentors":
      return <MentorCard item={item} onRemove={onRemove} />;
    case "collabs":
      return <CollabCard item={item} onRemove={onRemove} />;
    case "jobs":
      return <JobCard job={item} />;
    case "articles":
      return <ArticleCard item={item} onRemove={onRemove} />;
    case "services":
      return <ServiceCard item={item} onRemove={onRemove} />;
    default:
      return <DefaultCard item={item} onRemove={onRemove} type={type} />;
  }
}

function PostCard({ item, onRemove }) {
  return (
    <div className="bg-[#0C121A] border border-gray-800 p-4 rounded-xl hover:shadow-md transition">
      <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
      <p className="text-sm text-gray-400 line-clamp-2">{item.content}</p>
      <div className="flex justify-between mt-3 text-sm text-gray-500">
        <span>{item.author}</span>
        <button
          onClick={onRemove}
          className="hover:text-red-500 flex items-center gap-1"
        >
          <Trash2 size={14} /> Remove
        </button>
      </div>
    </div>
  );
}

function MentorCard({ item, onRemove }) {
  return (
    <div className="bg-[#0C121A] border border-gray-800 p-4 rounded-xl text-center hover:shadow-md transition">
      <img
        src={item.avatar}
        alt={item.name}
        className="w-20 h-20 rounded-full mx-auto mb-3"
      />
      <h3 className="font-semibold text-white">{item.name}</h3>
      <p className="text-sm text-gray-400">{item.specialization}</p>
      <div className="flex justify-center mt-2">
        <button
          onClick={onRemove}
          className="hover:text-red-500 flex items-center gap-1 text-xs"
        >
          <Trash2 size={14} /> Remove
        </button>
      </div>
    </div>
  );
}
function CollabCard({ item, onRemove }) {
  return (
    <div className="bg-[#0C121A] border border-gray-800 p-4 rounded-xl hover:shadow-md transition">
      <h3 className="font-semibold text-white">{item.projectName}</h3>
      <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
      <div className="flex justify-between mt-3 text-xs text-gray-500">
        <span>{item.teamSize} members</span>
        <button
          onClick={onRemove}
          className="hover:text-red-500 flex items-center gap-1"
        >
          <Trash2 size={14} /> Remove
        </button>
      </div>
    </div>
  );
}
function ArticleCard({ item, onRemove }) {
  return (
    <div className="bg-[#0C121A] border border-gray-800 p-4 rounded-xl hover:shadow-md transition">
      <h3 className="font-semibold text-white">{item.title}</h3>
      <p className="text-sm text-gray-400 line-clamp-2">{item.summary}</p>
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span>{item.author}</span>
        <button
          onClick={onRemove}
          className="hover:text-red-500 flex items-center gap-1"
        >
          <Trash2 size={14} /> Remove
        </button>
      </div>
    </div>
  );
}

function CourseCard({ item, onRemove }) {
  return (
    <div className="bg-[#0C121A] border border-gray-800 p-4 rounded-xl hover:shadow-md transition">
      <img
        src={item.thumbnail}
        alt={item.title}
        className="rounded-lg mb-3 w-full h-36 object-cover"
      />
      <h3 className="font-semibold text-white">{item.title}</h3>
      <p className="text-sm text-gray-400">{item.instructor}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-blue-400">{item.level}</span>
        <button
          onClick={onRemove}
          className="hover:text-red-500 flex items-center gap-1 text-xs"
        >
          <Trash2 size={14} /> Remove
        </button>
      </div>
    </div>
  );
}
