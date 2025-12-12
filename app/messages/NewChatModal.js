// "use client";
// import { useChat } from "../context/ChatProvider";
// import { X } from "lucide-react";
// import { useState, useEffect, useRef } from "react";

// export default function NewChatPanel() {
//   const {
//     showNewChatPanel,
//     setShowNewChatPanel,
//     users,
//     conversations,
//     setConversations,
//     setSelectedChatId,
//   } = useChat();

//   const [search, setSearch] = useState("");
//   const panelRef = useRef(null);

//   // OUTSIDE CLICK CLOSE
//   useEffect(() => {
//     if (!showNewChatPanel) return;

//     function handleClickOutside(e) {
//       if (panelRef.current && !panelRef.current.contains(e.target)) {
//         setShowNewChatPanel(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [showNewChatPanel]);

//   const filteredUsers = users.filter((u) =>
//     u.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const startChat = (user) => {
//     const existing = conversations.find((c) => c.userId === user.id);

//     if (existing) {
//       setSelectedChatId(existing.id);
//       setShowNewChatPanel(false);
//       return;
//     }

//     const newConv = {
//       id: Date.now(),
//       userId: user.id,
//       name: user.name,
//       avatar: user.avatar,
//       role: user.role,
//       unread: false,
//       messages: [],
//     };

//     setConversations([newConv, ...conversations]);
//     setSelectedChatId(newConv.id);
//     setShowNewChatPanel(false);
//   };

//   return (
//     <>
//       <div
//         ref={panelRef}
//         className={`fixed top-[70px]  px-2 py-3 h-full w-[400px] bg-white
//                 transition-transform duration-300
//                 ${
//                   showNewChatPanel
//                     ? "translate-x-0  "
//                     : "-translate-x-full opacity-0"
//                 }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-4 py-3 border-b">
//           <h2 className="text-lg font-semibold text-gray-600">New Chat</h2>
//           <button onClick={() => setShowNewChatPanel(false)}>
//             <X className="text-gray-600" />
//           </button>
//         </div>

//         {/* Search */}
//         <div className="p-4 bg-white">
//           <input
//             type="text"
//             placeholder="Search"
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-3 py-2 text-gray-700 rounded-md bg-gray-100 outline-none text-sm"
//           />
//         </div>

//         {/* User list */}
//         <div className="overflow-y-auto h-full">
//           {filteredUsers.map((u) => (
//             <button
//               key={u.id}
//               onClick={() => startChat(u)}
//               className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-left"
//             >
//               <img src={u.avatar || " "} className="w-10 h-10 rounded-full" />
//               <div>
//                 <p className="font-medium text-gray-600">{u.name}</p>
//                 <p className="text-xs text-gray-500">{u.role}</p>
//               </div>
//             </button>
//           ))}

//           {filteredUsers.length === 0 && (
//             <p className="text-center text-gray-400 py-6">No user found</p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// -----------------------------

"use client";
import { useChat } from "../context/ChatProvider";
import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function NewChatPanel() {
  const {
    showNewChatPanel,
    setShowNewChatPanel,
    users,
    conversations,
    setConversations,
    setSelectedChatId,
  } = useChat();

  const [search, setSearch] = useState("");
  const panelRef = useRef(null);

  useEffect(() => {
    if (!showNewChatPanel) return;

    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowNewChatPanel(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNewChatPanel]);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const startChat = (user) => {
    const existing = conversations.find((c) => c.userId === user.id);

    if (existing) {
      setSelectedChatId(existing.id);
      setShowNewChatPanel(false);
      return;
    }

    const newConv = {
      id: Date.now(),
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      unread: false,
      messages: [],
    };

    setConversations([newConv, ...conversations]);
    setSelectedChatId(newConv.id);
    setShowNewChatPanel(false);
  };

  return (
    <div
      ref={panelRef}
      className={`fixed top-[70px] left-0 px-2 py-3 h-[calc(100vh-70px)] w-[400px] bg-white border-r shadow-lg
            transition-transform duration-300 flex flex-col overflow-hidden z-50
            ${showNewChatPanel ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Header - Fixed */}
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-600">New Chat</h2>
        <button onClick={() => setShowNewChatPanel(false)}>
          <X className="text-gray-600" />
        </button>
      </div>

      {/* Search - Fixed */}
      <div className="p-4 bg-white flex-shrink-0">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-gray-700 rounded-md bg-gray-100 outline-none text-sm"
        />
      </div>

      {/* Scrollable User List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((u) => (
          <button
            key={u.id}
            onClick={() => startChat(u)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-left"
          >
            <img
              src={u.avatar || "/default-avatar.png"}
              className="w-10 h-10 rounded-full"
              alt={u.name}
            />
            <div>
              <p className="font-medium text-gray-600">{u.name}</p>
              <p className="text-xs text-gray-500">{u.role}</p>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <p className="text-center text-gray-400 py-6">No user found</p>
        )}
      </div>
    </div>
  );
}
