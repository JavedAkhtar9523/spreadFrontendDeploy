// // app/community/[id]/page.js
// "use client";
// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { useSelector } from "react-redux";
// import { getCommunityById } from "../../utils/communityService";
// import CommunityHeader from "../../community/CommunityHeader";
// import CommunityTabs from "../../community/CommunityTabs";
// import CommunitySidebar from "../../community/CommunitySidebar";
// import FeedTab from "../../community/tabs/FeedTab";
// import MembersTab from "../../community/tabs/MembersTab";
// import EventsTab from "../../community/tabs/EventsTab";
// import {FilesTab} from "../../community/tabs/FilesTab";
// import {ChatTab} from "../../community/tabs/FilesTab";
// import {AboutTab} from "../../community/tabs/FilesTab";
// import GroupChat from '../tabs/GroupChat'
// export default function CommunityPage() {
//   const params = useParams();
//   const { currentUser } = useSelector((state) => state.users);
//   const [community, setCommunity] = useState(null);
//   const [activeTab, setActiveTab] = useState("feed");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (params.id) {
//       const foundCommunity = getCommunityById(params.id);
//       setCommunity(foundCommunity);
//       setLoading(false);
//     }
//   }, [params.id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading community...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!community) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <span className="text-2xl text-red-600">❌</span>
//           </div>
//           <h2 className="text-xl font-bold text-gray-900 mb-2">Community Not Found</h2>
//           <p className="text-gray-600">The community you're looking for doesn't exist.</p>
//         </div>
//       </div>
//     );
//   }

//   const isMember = community.members.includes(currentUser?.id);
//   const isAdmin = community.createdBy === currentUser?.id;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <CommunityHeader
//         community={community}
//         isMember={isMember}
//         isAdmin={isAdmin}
//       />

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Left Side - Main Content */}
//           <div className="flex-1">
//             {/* Tabs Navigation */}
//             <CommunityTabs
//               activeTab={activeTab}
//               onTabChange={setActiveTab}
//               isMember={isMember}
//             />

//             {/* Tab Content */}
//             <div className="mt-6">
//               {activeTab === "feed" && <FeedTab community={community} isMember={isMember} />}
//               {activeTab === "members" && <MembersTab community={community} isMember={isMember} />}
//               {activeTab === "events" && <EventsTab community={community} isMember={isMember} />}
//               {activeTab === "files" && <FilesTab community={community} isMember={isMember} />}
//               {activeTab === "chat" && <ChatTab community={community} isMember={isMember} />}
//               {activeTab === "about" && <AboutTab community={community} />}
//             </div>
//           </div>

//           {/* Right Sidebar */}
//           <div className="lg:w-80">
//             <CommunitySidebar
//               community={community}
//               isMember={isMember}
//               isAdmin={isAdmin}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

import { getCommunityById } from "../../utils/communityService";
import CommunityHeader from "../../community/CommunityHeader";
import CommunityTabs from "../../community/CommunityTabs";
import CommunitySidebar from "../../community/CommunitySidebar";
import CommunityPagee from "../../community/communityHome";

import FeedTab from "../../community/tabs/FeedTab";
import MembersTab from "../../community/tabs/MembersTab";
import EventsTab from "../../community/tabs/EventsTab";
import { FilesTab } from "../../community/tabs/FilesTab";
import { ChatTab } from "../../community/tabs/FilesTab";
import { AboutTab } from "../../community/tabs/FilesTab";

import GroupChat from "../tabs/GroupChat";

export default function CommunityPage() {
  const params = useParams();
  const { currentUser } = useSelector((state) => state.users);

  const [community, setCommunity] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");
  const [loading, setLoading] = useState(true);

  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      const foundCommunity = getCommunityById(params.id);
      setCommunity(foundCommunity);
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!community) {
    return <div>Community Not Found</div>;
  }

  const isMember = community.members.includes(currentUser?.id);
  const isAdmin = community.createdBy === currentUser?.id;

  return (
    <div className="min-h-screen mt-10">
      <div className="flex items-start mx-15 gap-8">
        <div className="w-[70%]">
          {/* <CommunityHeader community={community} isMember={isMember} isAdmin={isAdmin} /> */}

          <CommunityPagee />

          {/* Navigation */}
          {/* <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} isMember={isMember} />
                      {activeTab === "feed" && <FeedTab community={community} isMember={isMember} />}
            {activeTab === "members" && <MembersTab community={community} isMember={isMember} />}
            {activeTab === "events" && <EventsTab community={community} isMember={isMember} />}
            {activeTab === "files" && <FilesTab community={community} isMember={isMember} />}
            {activeTab === "about" && <AboutTab community={community} />} */}
        </div>

        <div className="w-[30%]">
          <CommunitySidebar
            community={community}
            isMember={isMember}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  );
}
