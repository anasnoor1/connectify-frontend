import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Users, Circle } from "lucide-react";

export default function ChatWindow({ 
  messages, 
  onSend, 
  userId, 
  chatUser, 
  room, 
  onTypingStart, 
  onTypingStop,
  onReply,
  onReaction,
  onlineUsers = {},
  typingUsers = []
}) {
  const messagesEndRef = useRef(null);
  const [replyToMessage, setReplyToMessage] = useState(null);

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
  const otherUserId = !isGroup ? chatUser?.userId?._id || chatUser?.userId : null;
  const isUserOnline = otherUserId ? onlineUsers[otherUserId] : false;

  const isOwnMessage = (msg) => {
    const raw = msg?.senderId;
    if (!raw || !userId) return false;
    const senderId = raw._id || raw; // handle populated object or plain ID
    return String(senderId) === String(userId);
  };

  const handleReply = (message) => {
    setReplyToMessage(message);
  };

  const handleReaction = (messageId, emoji) => {
    onReaction?.(messageId, emoji);
  };

  const handleSend = (messageData) => {
    const data = {
      ...messageData,
      replyTo: replyToMessage?._id
    };
    onSend(data);
    setReplyToMessage(null);
  };

  // Get typing users in this room
  const currentTypingUsers = typingUsers.filter(userId => userId !== String(userId));

  return (
    <div className="h-screen flex flex-col bg-white">

      {/* Enhanced Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white shadow-md">
        <div className="flex items-center gap-3">
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
            <div className="text-xs md:text-sm text-white/80 flex items-center gap-1">
              {!isGroup && (
                <>
                  <Circle className={`w-2 h-2 fill-current ${isUserOnline ? 'text-green-400' : 'text-gray-400'}`} />
                  {isUserOnline ? 'online' : 'offline'}
                </>
              )}
              {isGroup && room?.participants && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {room.participants.length} members
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Typing indicator in header */}
        {currentTypingUsers.length > 0 && (
          <div className="text-xs text-white/80 flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span>
              {currentTypingUsers.length === 1 ? 'Someone is typing...' : `${currentTypingUsers.length} people typing...`}
            </span>
          </div>
        )}
      </div>

      {/* Reply Preview */}
      {replyToMessage && (
        <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-indigo-700">
            <span className="font-medium">Replying to:</span>
            <span className="truncate max-w-xs">{replyToMessage.message}</span>
          </div>
          <button
            onClick={() => setReplyToMessage(null)}
            className="text-indigo-500 hover:text-indigo-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-4">
        <div className="space-y-3">
          {messages.map((msg) => (
            <ChatMessage
              key={msg._id}
              msg={msg}
              isOwn={isOwnMessage(msg)}
              isGroup={isGroup}
              onReply={handleReply}
              onReaction={handleReaction}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Input */}
      <ChatInput 
        onSend={handleSend} 
        isReadOnly={false} 
        roomId={room?._id}
        onTypingStart={onTypingStart}
        onTypingStop={onTypingStop}
      />
    </div>
  );
}