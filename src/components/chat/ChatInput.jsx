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
    <div className="border-t bg-white/90 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto flex items-end gap-2 px-3 py-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
          placeholder={isReadOnly ? "Campaign is completed. Chat is read-only." : "Type a message..."}
          disabled={isReadOnly}
          rows={1}
        />
        <button
          onClick={send}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-shadow ${
            isReadOnly
              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
              : "bg-green-500 text-white shadow-sm hover:bg-green-600 hover:shadow"
          }`}
          disabled={isReadOnly}
        >
          Send
        </button>
      </div>
    </div>
  );
}