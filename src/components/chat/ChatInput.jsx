import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const send = () => {
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
        className="flex-1 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Type a message..."
        rows={1}
      />
      <button
        onClick={send}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
      >
        Send
      </button>
    </div>
  );
}