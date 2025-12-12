// import { ChatProvider } from "../context/ChatProvider";
// import NewChatModal from "./NewChatModal";
// import ConversationList from "./ConversationList";
// import ChatWindow from "./ChatWindow";
// import React from "react";

// export default function Page() {
//   return (
//     <ChatProvider>
//       <div className="bg-[#fff] px-20 py-7">
//         <NewChatModal />

//         <div className="h-[calc(100vh-100px)]  grid grid-cols-[400px_1fr]">
//           <ConversationList />
//           <ChatWindow />
//         </div>
//       </div>
//     </ChatProvider>
//   );
// }

// -----------------------------

import { ChatProvider } from "../context/ChatProvider";
import NewChatModal from "./NewChatModal";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import React from "react";

export default function Page() {
  return (
    <ChatProvider>
      <div className="bg-[#fff] px-20 py-7 h-screen overflow-hidden">
        <NewChatModal />

        <div className="h-[calc(100vh-100px)] grid grid-cols-[400px_1fr] overflow-hidden">
          <ConversationList />
          <ChatWindow />
        </div>
      </div>
    </ChatProvider>
  );
}
