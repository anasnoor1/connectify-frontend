export default function ChatMessage({ msg, isOwn, isGroup }) {
  const time = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const roleRaw = msg?.senderId?.role || '';
  const roleLabel = roleRaw
    ? roleRaw.charAt(0).toUpperCase() + roleRaw.slice(1).toLowerCase()
    : '';
  const name = msg?.senderId?.name || '';

  return (
    <div className={`flex mb-2 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-xs md:max-w-md px-3 py-2 rounded-lg text-sm shadow relative
          ${isOwn ? "bg-green-500 text-white rounded-br-none" : "bg-white text-gray-900 rounded-bl-none"}
        `}
      >
        {/* In group chats, show who sent the message (like WhatsApp group). In 1-1 DMs, no label. */}
        {isGroup && !isOwn && (roleLabel || name) && (
          <div className="text-xs font-semibold mb-0.5 text-gray-700">
            {roleLabel && `${roleLabel}: `}{name}
          </div>
        )}
        <div>{msg.message}</div>
        <div
          className={`text-xs mt-1 text-right ${isOwn ? "text-green-100" : "text-gray-400"}`}
        >
          {time}
        </div>
      </div>
    </div>
  );
}