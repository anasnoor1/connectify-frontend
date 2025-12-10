import ChatList from "../../src/components/dashboard/brandDashboardComponents/chatList";
import ChatPage from "./ChatPage";
import { useParams } from "react-router-dom";

export default function ChatLayout() {
  const { roomId } = useParams();

  return (
    <div className="flex h-screen bg-white">
      
      {/* LEFT SIDEBAR — CHAT LIST */}
      <div className="w-[26%] border-r h-screen overflow-y-auto">
        <ChatList />
      </div>

      {/* RIGHT CHAT WINDOW */}
      <div className="flex-1">
        {roomId ? (
          <ChatPage />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>

    </div>
  );
}
