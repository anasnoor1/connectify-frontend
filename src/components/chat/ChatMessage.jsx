export default function ChatMessage({ msg, isOwn }) {
  const time = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex mb-2 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-xs md:max-w-md px-3 py-2 rounded-lg text-sm shadow relative
          ${isOwn ? "bg-green-500 text-white rounded-br-none" : "bg-white text-gray-900 rounded-bl-none"}
        `}
      >
        <div>{msg.message}</div>
        <div className="text-xs text-gray-200 mt-1 text-right">
          {time}
        </div>
      </div>
    </div>
  );
}