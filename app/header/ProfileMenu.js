"use client";
import Link from "next/link";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { FaKey, FaQuestionCircle } from "react-icons/fa";
import Dropdown from "../components/Dropdown";
import { TruncateText } from "../helper/truncateText";
import { FIELD_LIMITS } from "../constents/constents";
import { LogOut } from 'lucide-react';

export default function ProfileMenu({ user, isSidebarOpen, onLogout }) {
  const avatarSrc = user?.avatar || "/profile.jpg";
  const userName = user?.name || "Guest";
  const userid = user?.username || "no userid ";
  const userEmail = user?.email || "No email";


  return (
    <Dropdown
      button={
        <div
          className={`bg-white flex items-center gap-2 pb-2.5 cursor-pointer transition ${
            isSidebarOpen ? "justify-start " : "justify-center"
          }`}
        >
          <img
            src={avatarSrc}
            alt={userName}
            className={`rounded-full object-cover z-50 ${
              isSidebarOpen
                ? "w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]"
                : "w-[28px] h-[28px]"
            }`}
            suppressHydrationWarning
          />

          {isSidebarOpen && (
            <div className="flex  items-center gap-4">
              <div>
          

             
              <p className="hidden sm:block text-[12px] text-gray-500 font-medium truncate">
                {TruncateText(userName, 15)}
              </p>
              <p className="text-sm text-gray-600 ">
                @{TruncateText(userid, 15)}
              </p>
              
            </div>
            <div>
            <LogOut  className="text-gray-700 w-4 h-4" />
            </div>
            </div>
          )}
        </div>
      }
      className={`absolute z-50 w-64 bg-white text-gray-800 rounded-lg border border-gray-400 shadow-lg overflow-hidden ${
        isSidebarOpen ? "bottom-14 left-14" : "bottom-6 left-10"
      }`}
    >
      {({ close }) => (
        <div>
          {/* User Info */}
          <div className="p-4 border-b border-gray-400 bg-gray-50">
            <div className="flex gap-3 items-center">
              <img
                src={avatarSrc}
                className="w-[40px] h-[40px] rounded-full object-cover border border-gray-300"
                alt="User avatar"
                suppressHydrationWarning
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">
                  {TruncateText(userName, FIELD_LIMITS.name)}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {TruncateText(userid, FIELD_LIMITS.email)}
                </p>
              </div>
            </div>
          </div>

          {/* Rest of your component remains the same */}
          {/* ... */}
          <div className="flex flex-col text-sm bg-white">
            <Link
              href="/settings"
              className="flex items-center gap-3 border-b border-gray-400 px-4 py-3 hover:bg-gray-100 transition"
            >
              <FiSettings className="w-4 h-4 text-gray-600" /> Settings
            </Link>

            <Link
              href="/help"
              className="flex items-center gap-3 px-4 border-b border-gray-400 py-3 hover:bg-gray-100 transition"
            >
              <FaQuestionCircle className="w-4 h-4 text-gray-600" /> Help &
              Support
            </Link>

            <Link
              href="/change-password"
              className="flex items-center border-b border-gray-400 gap-3 px-4 py-3 hover:bg-gray-100 transition"
            >
              <FaKey className="w-4 h-4 text-gray-600" /> Change Password
            </Link>

            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition"
            >
              <FiLogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </Dropdown>
  );
}
