// import ChatMessage from "./ChatMessage";
// import ChatInput from "./ChatInput";

// export default function ChatWindow({ messages, onSend, userId }) {
//   return (
//     <div className="h-screen flex flex-col bg-gray-100">
//       <div className="flex-1 overflow-y-auto p-4">
//         {messages.map((msg) => (
//           <ChatMessage
//             key={msg._id}
//             msg={msg}
//             isOwn={msg.senderId === userId}
//           />
//         ))}
//       </div>

//       <ChatInput onSend={onSend} />
//     </div>
//   );
// }
/////////////////////////////////

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatWindow({ messages, onSend, userId, chatUser }) {
  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* WhatsApp-style Header */}
      <div className="flex items-center gap-3 p-3 bg-green-600 text-white shadow">
        <div className="w-10 h-10 rounded-full bg-white text-green-700 flex items-center justify-center font-semibold">
          {chatUser?.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <div className="font-semibold text-lg">{chatUser?.name || "Chat"}</div>
          <div className="text-sm text-white/80">online</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">

        {messages.map((msg) => (
          <ChatMessage
            key={msg._id}
            msg={msg}
            isOwn={msg.senderId?._id === userId}
          />
        ))}

      </div>

      {/* Input */}
      <ChatInput onSend={onSend} />
    </div>
  );
}
