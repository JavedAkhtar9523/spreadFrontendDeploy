// "use client";

// import { useChat } from "../context/ChatProvider";
// import ConversationItem from "./ConversationItem";
// import ConversationFilters from "./ConversationFilters";
// import { MessageSquarePlus, EllipsisVertical } from "lucide-react";

// export default function ConversationList() {
//     const {
//         conversations,
//         selectedChatId,
//         setSelectedChatId,
//         setShowNewChatModal,
//         setShowNewChatPanel,
//     } = useChat();
//     const { filteredConversations, setSearchQuery } = useChat();

//     return (
//         <div className="w-full h-full border-r flex flex-col">

//             {/* 👉 New Chat Button */}
//             <div className="flex justify-between border-b">
//                 <h1 className="text-xl font-lato font-semibold text-gray-700 p-4">Messages</h1>
//                 <div className="p-4 border-b flex justify-end">
//                     {/* <button
//                         onClick={() => setShowNewChatModal(true)}
//                         className="w-[40px] flex items-center justify-center gap-2  hover:bg-gray-200 hover:text-2xl text-black py-2 rounded-full cursor-pointer"
//                     >
//                         <MessageSquarePlus size={25} />
//                     </button> */}
// <button
//   onClick={() => setShowNewChatPanel(true)}
//   className="w-[40px] flex items-center justify-center text-black hover:bg-gray-200 p-2 rounded-full"
// >
//   <MessageSquarePlus size={25} />
// </button>

//                     <button
//                         className="w-[40px] flex items-center justify-center gap-2  hover:bg-gray-200 hover:text-2xl text-black py-2 rounded-full cursor-pointer"
//                     >
//                         <EllipsisVertical size={25} />
//                     </button>

//                 </div>
//             </div>

//             {/* 👉 Search Input */}
//             <div className="p-4 bg-white">
//                 <input
//                     type="text"
//                     placeholder="Search"
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full px-3 py-2 text-gray-700 rounded-md bg-gray-100 outline-none text-sm"
//                 />
//             </div>

//             <ConversationFilters />

//             <div className="flex-1 overflow-y-auto bg-white">
//                 {conversations.map((conversation) => (
//                     <ConversationItem
//                         key={conversation.id}
//                         conversation={conversation}
//                         onClick={() => setSelectedChatId(conversation.id)}
//                         isSelected={selectedChatId === conversation.id}
//                     />

//                 ))}

//             </div>

//         </div>
//     );
// }

// ---------------------------------

// "use client";

// import { useChat } from "../context/ChatProvider";
// import ConversationItem from "./ConversationItem";
// import ConversationFilters from "./ConversationFilters";
// import { MessageSquarePlus, EllipsisVertical } from "lucide-react";

// export default function ConversationList() {
//   const {
//     conversations,
//     selectedChatId,
//     setSelectedChatId,
//     setShowNewChatModal,
//     setShowNewChatPanel,
//     setSearchQuery,
//   } = useChat();

//   return (
//     <div className="w-full h-full border-r flex flex-col overflow-hidden">
//       {/* Header - Fixed */}
//       <div className="flex justify-between border-b flex-shrink-0">
//         <h1 className="text-xl font-lato font-semibold text-gray-700 p-4">
//           Messages
//         </h1>
//         <div className="p-4 flex gap-2">
//           <button
//             onClick={() => setShowNewChatPanel(true)}
//             className="w-[40px] flex items-center justify-center text-black hover:bg-gray-200 p-2 rounded-full"
//           >
//             <MessageSquarePlus size={25} />
//           </button>

//           <button className="w-[40px] flex items-center justify-center text-black hover:bg-gray-200 p-2 rounded-full">
//             <EllipsisVertical size={25} />
//           </button>
//         </div>
//       </div>

//       {/* Search - Fixed */}
//       <div className="p-4 bg-white flex-shrink-0">
//         <input
//           type="text"
//           placeholder="Search"
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full px-3 py-2 text-gray-700 rounded-md bg-gray-100 outline-none text-sm"
//         />
//       </div>

//       {/* Filters - Fixed */}
//       <div className="flex-shrink-0">
//         <ConversationFilters />
//       </div>

//       {/* Scrollable Conversation List */}
//       <div className="flex-1 overflow-y-auto bg-white">
//         {conversations.map((conversation) => (
//           <ConversationItem
//             key={conversation.id}
//             conversation={conversation}
//             onClick={() => setSelectedChatId(conversation.id)}
//             isSelected={selectedChatId === conversation.id}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// ========================

"use client";

import { useChat } from "../context/ChatProvider";
import ConversationItem from "./ConversationItem";
import ConversationFilters from "./ConversationFilters";
import { MessageSquarePlus, EllipsisVertical } from "lucide-react";

export default function ConversationList() {
  const {
    conversations,
    selectedChatId,
    setSelectedChatId,
    setShowNewChatModal,
    setShowNewChatPanel,
    setSearchQuery,
  } = useChat();

  return (
    <div className="w-full h-full border-r flex flex-col">
      {/* Header - Fixed */}
      <div className="flex justify-between border-b flex-shrink-0">
        <h1 className="text-xl font-lato font-semibold text-gray-700 p-4">
          Messages
        </h1>
        <div className="p-4 flex gap-2">
          <button
            onClick={() => setShowNewChatPanel(true)}
            className="w-[40px] flex items-center justify-center text-black hover:bg-gray-200 p-2 rounded-full"
          >
            <MessageSquarePlus size={25} />
          </button>

          <button className="w-[40px] flex items-center justify-center text-black hover:bg-gray-200 p-2 rounded-full">
            <EllipsisVertical size={25} />
          </button>
        </div>
      </div>

      {/* Search - Fixed */}
      <div className="p-4 bg-white flex-shrink-0">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-gray-700 rounded-md bg-gray-100 outline-none text-sm"
        />
      </div>

      {/* Filters - Fixed */}
      <div className="flex-shrink-0">
        <ConversationFilters />
      </div>

      {/* Scrollable Conversation List */}
      <div className="flex-1 overflow-y-auto bg-white min-h-0">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            onClick={() => setSelectedChatId(conversation.id)}
            isSelected={selectedChatId === conversation.id}
          />
        ))}
      </div>
    </div>
  );
}
