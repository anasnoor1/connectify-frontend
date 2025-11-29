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
  const avatarUrl = msg?.senderId?.avatar_url;
  const initials = (name || roleLabel || '?').charAt(0).toUpperCase();

  return (
    <div className={`flex items-end mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {/* Left-side avatar for incoming messages */}
      {!isOwn && (
        <div className="mr-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
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
          max-w-xs md:max-w-md px-3 py-2 rounded-lg text-sm shadow relative
          ${isOwn ? 'bg-green-500 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none'}
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
          className={`text-xs mt-1 text-right ${isOwn ? 'text-green-100' : 'text-gray-400'}`}
        >
          {time}
        </div>
      </div>

      {/* Right-side avatar for own messages */}
      {isOwn && (
        <div className="ml-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-green-100 flex items-center justify-center text-xs font-semibold text-green-700">
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