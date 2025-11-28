

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatWindow({ messages, onSend, userId, chatUser, room }) {

  const isGroup = room?.isGroup;
  const title = isGroup
    ? room?.groupName || "Group Chat"
    : chatUser?.userId?.name || "Chat";

  const initial = isGroup
    ? (room?.groupName?.charAt(0)?.toUpperCase() || "G")
    : (chatUser?.userId?.name?.charAt(0)?.toUpperCase() || "C");

  const isOwnMessage = (msg) => {
    const raw = msg?.senderId;
    if (!raw || !userId) return false;
    const senderId = raw._id || raw; // handle populated object or plain ID
    return String(senderId) === String(userId);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* WhatsApp-style Header */}
      <div className="flex items-center gap-3 p-3 bg-green-600 text-white shadow">
        <div className="w-10 h-10 rounded-full bg-white text-green-700 flex items-center justify-center font-semibold">
          {initial}
        </div>

        <div>
          <div className="font-semibold text-lg">{title}</div>
          <div className="text-sm text-white/80">online</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">

        {messages.map((msg) => (
          <ChatMessage
            key={msg._id}
            msg={msg}
            isOwn={isOwnMessage(msg)}
            isGroup={isGroup}
          />
        ))}

      </div>

      {/* Input */}
      <ChatInput onSend={onSend} />
    </div>
  );
}
