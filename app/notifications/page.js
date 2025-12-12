

"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";


import {
  acceptCollab,
  rejectCollab,
  markNotificationsRead,
  clearAllNotifications,
} from "../store/userSlice";

import Link from "next/link";
import { Bell } from "lucide-react";
import AdvertisementCard from "../components/AdvertisementCard";
import Image from "next/image";

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { notifications, currentUser, users, collabs } = useSelector(
    (s) => s.users
  );
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Backend-ready state for API integration
  const [notificationData, setNotificationData] = useState({
    notifications: [],
    pagination: { page: 1, hasMore: false },
    unreadCount: 0
  });

  useEffect(() => {
    dispatch(markNotificationsRead());
    // Simulate API fetch - replace with actual API call
    fetchNotifications();
  }, [dispatch]);

  
  const ads = [
    {
      companyName: "Spreadnext India",
      tagline: "Where Community meets Careers.",
      logo: "https://img.icons8.com/color/96/company.png",
      link: "https://google.com",
    },
       {
      companyName: "Spreadnext India",
      tagline: "Where Community meets Careers.",
      logo: "https://img.icons8.com/color/96/company.png",
      link: "https://google.com",
    },
   
  ];
  
  // Backend API integration points
  const fetchNotifications = async (page = 1, tab = activeTab) => {
    setIsLoading(true);
    try {
      // TODO:  your actual API endpoint from backend team
      const response = await fetch(`/api/notifications?page=${page}&tab=${tab}`, {
        headers: {
          'Authorization': `Bearer ${yourAuthToken}`, // Add your auth
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('API call failed');

      const data = await response.json();

      // Dispatch to Redux or set state based on your architecture
      // dispatch(setNotifications(data.notifications));

    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // TODO: Add proper error handling UI
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationAction = async (notificationId, action, payload = {}) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Refresh notifications after action
        fetchNotifications();
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  if (!currentUser)
    return <p className="p-5 text-gray-500">No user logged in.</p>;

  // O(1) lookup maps
  const usersMap = useMemo(() => {
    const map = {};
    users.forEach((u) => (map[u.id] = u));
    return map;
  }, [users]);

  const collabsMap = useMemo(() => {
    const map = {};
    collabs.forEach((c) => (map[c.id] = c));
    return map;
  }, [collabs]);

  // Group notifications by time (Today, Yesterday, This Week, Earlier)
  const groupedNotifications = useMemo(() => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      earlier: []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    notifications.forEach((notification) => {
      const notifDate = new Date(notification.createdAt);

      if (notifDate >= today) {
        groups.today.push(notification);
      } else if (notifDate >= yesterday) {
        groups.yesterday.push(notification);
      } else if (notifDate >= thisWeek) {
        groups.thisWeek.push(notification);
      } else {
        groups.earlier.push(notification);
      }
    });

    return groups;
  }, [notifications]);

  // Filter notifications based on active tab (PRD tabs)
  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case "mentions":
        return notifications.filter((n) =>
          n.type === "mention" || n.message?.includes("@")
        );
      case "follows":
        return notifications.filter((n) =>
          n.type === "follow" || n.type === "connection"
        );
      case "jobs":
        return notifications.filter((n) =>
          n.type.includes("job") || n.category === "job_alerts"
        );
      case "all":
      default:
        return notifications;
    }
  }, [notifications, activeTab]);

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const icons = {
      mention: "💬",
      follow: "👤",
      job: "💼",
      "collab-request": "🤝",
      "collab-accepted": "✅",
      "collab-rejected": "❌",
      "job-applied": "📨",
      "job-status": "📊",
      default: "🔔"
    };
    return icons[type] || icons.default;
  };

  return (
    <div className="max-h-screen  ">
      {/* Main Layout - PRD Structure */}
      <div className="max-w-7xl justify-between mx-auto mt-6">

        <div className="flex space-x-2">
          {/* Main Panel Feed - PRD Requirement */}
          <div className="flex-1 p-6 ">
            {/* Tabs - PRD Tabs: All, Mentions, Follows, Job Alerts */}
            <div className="bg-[#ffffffdc]  px-4  border-[0.3px]  border-[#cccccc] rounded-lg mb-6">
              <div className="flex border-b ">
                {[
                  { id: "all", name: "All" },
                  { id: "mentions", name: "Mentions" },
                  { id: "follows", name: "Follows" },
                  { id: "jobs", name: "Job Alerts" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex-1 px-3 py-3 text-sm font-medium transition-colors hover:cursor-pointer ${activeTab === tab.id
                      ? "text-blue-600 border-b-2 -mb-[2px] border-blue-600"
                      : "text-gray-600 "
                      }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white  border-[0.3px] border-[#cccccc] rounded-4xl p-4 animate-pulse">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State - PRD Requirement */}
            {!isLoading && filteredNotifications.length === 0 && (
              <div className="bg-[#fff]  rounded-4xl border h-[620px]  flex justify-center align-middle flex-col  border-gray-200 px-12 text-center">
                  <div className="flex justify-center">
                 <Image src="/nothingillustrator.svg" alt="nothing " width={200} height={200} />

                  </div>
                <h3 className="text-2xl  font-semibold text-gray-900">
                  Quiet for now
                </h3>
                <p className="text-gray-500 text-sm">
                  Something good is on its way.
                </p>
              </div>
            )}

            {/* Notifications Feed - Grouped by time */}
            {!isLoading && filteredNotifications.length > 0 && (
       <div className="border-[0.3px] my-3 border-[#cccccc]   h-[620px] overflow-y-auto custom-scroll  !border-b-0  bg-[#FFF] p-4 rounded-4xl !rounded-br-none !rounded-bl-none">

            <div className="text-right mx-3">
                       {notifications.length > 0 && (
              <button
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                onClick={() => dispatch(clearAllNotifications())}
              >
                Clear All
              </button>
            )}
            </div>

                {Object.entries(groupedNotifications).map(([period, periodNotifications]) => {
                  const filteredPeriodNotifications = periodNotifications.filter(n =>
                    filteredNotifications.includes(n)
                  );

                  if (filteredPeriodNotifications.length === 0) return null;

                  const periodLabels = {
                    today: "Today",
                    yesterday: "Yesterday",
                    thisWeek: "This Week",
                    earlier: "Earlier"
                  };

                  return (
                    <div key={period} className="bg-[#fff] border-b border-[#cccccc]   p-4  ">
                      <h3 className="text-sm  font-medium text-gray-500 mb-3">
                        {periodLabels[period]} 
                      </h3>
                      <div className="space-y-3  ">
                        {filteredPeriodNotifications.map((n) => {
                          const sender = usersMap[n.from] || {
                            name: "Unknown User",
                            avatar: "/default-user-profile.svg",
                          };
                          const collab = collabsMap[n.id];

                          return (
                            <div
                              key={n.id}
                              className={`bg-white rounded-xl transition-all  ${!n.read ? "border-blue-200 bg-blue-50/30" : "border-gray-200"
                                }`}
                            >
                              <div className="">
                                <div className="flex gap-4">
                                  {/* Notification Icon */}
                                      <img
                                          src={sender.avatar || "/default-user-profile.svg"}
                                          alt={sender.name}
                                          className="w-12 h-12 rounded-full"
                                        />

                                  {/* Notification Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center gap-2 mb-1">
                                        {/* <img
                                          src={sender.avatar || "/default-user-profile.svg"}
                                          alt={sender.name}
                                          className="w-12 h-12 rounded-full"
                                        /> */}
                                        <span className="font-medium text-gray-900 text-sm">
                                          {sender.name}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2">

                                      </div>
                                    </div>

                                    <p className="text-gray-700 text-sm mb-2">
                                      {n.message}
                                    </p>

                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500">
                                        {new Date(n.createdAt).toLocaleTimeString([], {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </span>

                                      {/* Action Buttons */}
                                      {n.type === "collab-request" &&
                                        collab &&
                                        collab.status === "pending" &&
                                        n.to === currentUser.id && (
                                          <div className="flex gap-2">
                                            <button
                                              className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                                              onClick={() =>
                                                dispatch(
                                                  acceptCollab({
                                                    notificationId: collab.id,
                                                    currentUserId: currentUser.id,
                                                  })
                                                )
                                              }
                                            >
                                              Accept
                                            </button>
                                            <button
                                              className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
                                              onClick={() =>
                                                dispatch(
                                                  rejectCollab({
                                                    notificationId: collab.id,
                                                    currentUserId: currentUser.id,
                                                  })
                                                )
                                              }
                                            >
                                              Ignore
                                            </button>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar Navigation - PRD Requirement */}
          <div className=" ">


            {/* Ad placeholders */}
            <div className="mt-8 flex flex-col gap-5">
                 {ads.map((ad, i) => (
                          <AdvertisementCard
                            key={i}
                            companyName={ad.companyName}
                            tagline={ad.tagline}
                            logo={ad.logo}
                            link={ad.link}
                          />
                        ))}

            </div>
          </div>



        </div>
      </div>
    </div>
  );
}