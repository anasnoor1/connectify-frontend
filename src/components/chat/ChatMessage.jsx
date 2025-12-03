export default function ChatMessage({ msg, isOwn, isGroup }) {
  const time = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // System messages: center aligned, no avatar, no sender name
  if (msg?.isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="px-3 py-1.5 rounded-full bg-gray-200 text-gray-700 text-xs">
          {msg.message}
        </div>
      </div>
    );
  }

  const roleRaw = msg?.senderId?.role || '';

  const roleLabel = roleRaw
    ? roleRaw.charAt(0).toUpperCase() + roleRaw.slice(1).toLowerCase()
    : '';
  const name = msg?.senderId?.name || '';
  const avatarUrl = msg?.senderId?.avatar_url;
  const initials = (name || roleLabel || '?').charAt(0).toUpperCase();

  return (
    <div className={`flex items-end mb-1.5 md:mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {/* Left-side avatar for incoming messages */}
      {!isOwn && (
        <div className="mr-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name || roleLabel || 'User'}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-8 h-8 items-center justify-center ${avatarUrl ? 'hidden' : 'flex'}`}>
              {initials}
            </div>
          </div>
        </div>
      )}

      <div
        className={`
          max-w-sm md:max-w-md lg:max-w-lg px-3 py-2 rounded-2xl text-sm shadow-sm relative
          ${isOwn
            ? 'bg-indigo-600 text-white rounded-br-md'
            : 'bg-slate-50 text-gray-900 border border-slate-200 rounded-bl-md'}
        `}
      >
        {/* In group chats, show who sent the message (like WhatsApp group). In 1-1 DMs, no label. */}
        {isGroup && !isOwn && (roleLabel || name) && (
          <div className="text-[11px] font-semibold mb-0.5 text-slate-700">
            {roleLabel && `${roleLabel}: `}{name}
          </div>
        )}
        <div className="whitespace-pre-line break-words">{msg.message}</div>
        <div
          className={`text-[11px] mt-1 text-right ${isOwn ? 'text-indigo-100' : 'text-slate-400'}`}
        >
          {time}
        </div>
      </div>

      {/* Right-side avatar for own messages */}
      {isOwn && (
        <div className="ml-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name || roleLabel || 'You'}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-8 h-8 items-center justify-center ${avatarUrl ? 'hidden' : 'flex'}`}>
              {initials}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}