import { useState } from 'react';
import { Check, CheckCheck, Clock, Reply, Smile, MoreVertical } from 'lucide-react';

export default function ChatMessage({ msg, isOwn, isGroup, onReply, onReaction }) {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

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

  // Message status indicator
  const getStatusIcon = () => {
    if (!isOwn) return null;
    
    switch (msg.status) {
      case 'sent':
        return <Check className="w-3 h-3 text-indigo-200" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-indigo-200" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-indigo-100" />;
      default:
        return <Clock className="w-3 h-3 text-indigo-200" />;
    }
  };

  // Common reactions
  const commonReactions = ['❤️', '👍', '😂', '😮', '😢', '👎'];

  const handleReaction = (emoji) => {
    onReaction?.(msg._id, emoji);
    setShowReactions(false);
  };

  const renderAttachment = (attachment, index) => {
    const { type, url, filename } = attachment;
    
    switch (type) {
      case 'image':
        return (
          <div key={index} className="mt-2">
            <img
              src={url}
              alt={filename || 'Image'}
              className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(url, '_blank')}
            />
          </div>
        );
      case 'video':
        return (
          <div key={index} className="mt-2">
            <video
              src={url}
              controls
              className="max-w-xs rounded-lg"
            />
          </div>
        );
      default:
        return (
          <div key={index} className="mt-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
                📄
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{filename || 'File'}</div>
              </div>
            </a>
          </div>
        );
    }
  };

  // Group reactions by emoji
  const groupedReactions = msg.reactions?.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = { count: 0, users: [] };
    }
    acc[reaction.emoji].count++;
    acc[reaction.emoji].users.push(reaction.userId);
    return acc;
  }, {}) || {};

  return (
    <div 
      className={`flex items-end mb-1.5 md:mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
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

      <div className="relative group">
        <div
          className={`
            max-w-sm md:max-w-md lg:max-w-lg px-3 py-2 rounded-2xl text-sm shadow-sm relative
            ${isOwn
              ? 'bg-indigo-600 text-white rounded-br-md'
              : 'bg-slate-50 text-gray-900 border border-slate-200 rounded-bl-md'}
          `}
        >
          {/* Reply indicator */}
          {msg.replyTo && (
            <div className="mb-1 p-2 bg-black/10 rounded-lg text-xs opacity-75">
              <div className="flex items-center gap-1 mb-1">
                <Reply className="w-3 h-3" />
                <span>Replying to</span>
              </div>
              <div className="truncate">{msg.replyTo.message}</div>
            </div>
          )}

          {/* In group chats, show who sent the message */}
          {isGroup && !isOwn && (roleLabel || name) && (
            <div className="text-[11px] font-semibold mb-0.5 text-slate-700">
              {roleLabel && `${roleLabel}: `}{name}
            </div>
          )}

          {/* Message content */}
          <div className="whitespace-pre-line break-words">{msg.message}</div>

          {/* Attachments */}
          {msg.attachments?.map((attachment, index) => renderAttachment(attachment, index))}

          {/* Reactions */}
          {Object.keys(groupedReactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(groupedReactions).map(([emoji, data]) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className={`
                    px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-colors
                    ${isOwn 
                      ? 'bg-indigo-500 hover:bg-indigo-400 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }
                  `}
                >
                  <span>{emoji}</span>
                  <span>{data.count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Time and status */}
          <div className={`flex items-center justify-end gap-1 mt-1 text-[11px] ${isOwn ? 'text-indigo-100' : 'text-slate-400'}`}>
            <span>{time}</span>
            {msg.editedAt && <span>(edited)</span>}
            {getStatusIcon()}
          </div>
        </div>

        {/* Message actions */}
        {showActions && !msg.isSystem && (
          <div className={`
            absolute top-0 flex gap-1 p-1
            ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'}
          `}>
            <button
              onClick={() => onReply?.(msg)}
              className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              title="Reply"
            >
              <Reply className="w-3 h-3" />
            </button>
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              title="Add reaction"
            >
              <Smile className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Reaction picker */}
        {showReactions && (
          <div className={`
            absolute bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2
            ${isOwn ? 'right-0' : 'left-0'}
          `}>
            <div className="flex gap-1">
              {commonReactions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
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