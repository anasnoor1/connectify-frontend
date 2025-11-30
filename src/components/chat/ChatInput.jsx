import { useState } from "react";

export default function ChatInput({ onSend, isReadOnly }) {
  const [text, setText] = useState("");

  const send = () => {
    if (isReadOnly) return;
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();

    }
  };

  return (
    <div className="p-3 bg-white flex gap-2 border-t">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder={isReadOnly ? "Campaign is completed. Chat is read-only." : "Type a message..."}
        disabled={isReadOnly}
        rows={1}
      />
      <button
        onClick={send}
        className={`px-4 py-2 rounded-lg transition ${
          isReadOnly
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
        disabled={isReadOnly}
      >
        Send
      </button>

    </div>
  );
}