import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatWindow({ messages, onSend, userId, chatUser, room }) {

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages?.length]);

  const isGroup = room?.isGroup;
  const title = isGroup
    ? room?.groupName || "Group Chat"
    : chatUser?.userId?.name || "Chat";

  const initial = isGroup
    ? (room?.groupName?.charAt(0)?.toUpperCase() || "G")
    : (chatUser?.userId?.name?.charAt(0)?.toUpperCase() || "C");

  const avatarUrl = !isGroup ? chatUser?.userId?.avatar_url : null;

  const isOwnMessage = (msg) => {
    const raw = msg?.senderId;
    if (!raw || !userId) return false;
    const senderId = raw._id || raw; // handle populated object or plain ID
    return String(senderId) === String(userId);
  };

  return (
    <div className="h-screen flex flex-col bg-white">

      {/* WhatsApp-style Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white shadow-md">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center font-semibold text-indigo-50">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={title}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget.nextElementSibling;
                if (fallback) fallback.style.display = "flex";
              }}
            />
          ) : null}
          <div className={`w-10 h-10 items-center justify-center ${avatarUrl ? "hidden" : "flex"}`}>
            {initial}
          </div>
        </div>

        <div>
          <div className="font-semibold text-base md:text-lg leading-tight">{title}</div>
          <div className="text-xs md:text-sm text-white/80">online</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-4">
        <div className="space-y-3">
          {messages.map((msg) => (
            <ChatMessage
              key={msg._id}
              msg={msg}
              isOwn={isOwnMessage(msg)}
              isGroup={isGroup}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={onSend} isReadOnly={false} />
    </div>
  );
}