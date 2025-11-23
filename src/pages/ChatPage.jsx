
// import { useEffect, useState } from "react";
// import axiosInstance from "../utills/privateIntercept";
// import { socket } from "../socket";
// import ChatWindow from "../components/chat/ChatWindow";

// export default function ChatPage() {
//   const roomId = window.location.pathname.split("/").pop();
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   // Fetch user from localStorage safely
//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     const currentUser = storedUser?.user || storedUser || null;

//     if (!currentUser) {
//       setLoading(false); // done loading
//       return;
//     }

//     setUser(currentUser);
//     setLoading(false);
//   }, []);

//   // Fetch messages and setup socket
//   useEffect(() => {
//     if (!user) return; // don't run if user not found

//     const fetchMessages = async () => {
//       try {
//         const res = await axiosInstance.get(`/api/message/${roomId}`);
//         setMessages(res.data);
//       } catch (err) {
//         console.error("Failed to fetch messages:", err);
//       }
//     };

//     fetchMessages();

//     // Join socket room
//     socket.emit("join_room", roomId);

//     // Listen for incoming messages
//     const handleReceiveMessage = (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     };
//     socket.on("receive_message", handleReceiveMessage);

//     // Cleanup on unmount
//     return () => {
//       socket.off("receive_message", handleReceiveMessage);
//     };
//   }, [user, roomId]);

//   const sendMessage = (text) => {
//     if (!user) return;
//     socket.emit("send_message", {
//       roomId,
//       senderId: user._id,
//       message: text,
//     });
//   };

//   if (loading) {
//     return <p>Loading chat...</p>;
//   }

//   if (!user) {
//     return <p>User not found. Please log in.</p>;
//   }

//   return (
//     <ChatWindow
//       messages={messages}
//       onSend={sendMessage}
//       userId={user._id}
//     />
//   );
// }
/////////////////////////
import { useEffect, useState } from "react";
import axiosInstance from "../utills/privateIntercept";
import { socket } from "../socket";
import ChatWindow from "../components/chat/ChatWindow";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const { roomId } = useParams();  // cleaner than split pathname

  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null); // influencer or brand user
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load logged-in user
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const currentUser = parsed.user || parsed || null;
        setUser(currentUser);
      } catch (e) {
        console.error("Failed to parse user", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch chat info (influencer details)
  useEffect(() => {
    const fetchChatInfo = async () => {
      try {
        // Use the correct endpoint for fetching a specific room by ID (or just use the room ID if the backend supports it)
        // Since getChatRoom in backend expects query params, we might need a new endpoint or adapt.
        // However, we are already in a room with roomId.
        // Let's assume we can fetch room details by ID or we need to fetch all chats and find this one,
        // OR we update the backend to get room by ID.
        // Actually, the previous code used `/api/chat/room/${roomId}` which doesn't exist in the routes I saw.
        // The routes are: /open, /chatroom (query), /my-chats.
        // We should probably add a route to get room by ID or use my-chats and filter.
        // For now, let's use my-chats and find the room.

        const res = await axiosInstance.get(`/api/chat/my-chats`);
        const room = res.data.data.find(r => r._id === roomId);

        if (room && user) {
          // Determine who is the other person
          // room.participants is array of { userId: { ... }, role: ... }
          const otherParticipant = room.participants.find(p => p.userId._id !== user._id);
          if (otherParticipant) {
            setChatUser(otherParticipant.userId);
          }
        }
      } catch (err) {
        console.error("Failed to fetch chat info:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchChatInfo();
  }, [user, roomId]);

  // Fetch messages + setup socket listeners
  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`/api/message/${roomId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();

    socket.emit("join_room", roomId);

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [user, roomId]);

  const sendMessage = (text) => {
    if (!user) return;

    socket.emit("send_message", {
      roomId,
      senderId: user._id,
      message: text,
    });
  };

  if (loading) {
    return <p>Loading chat...</p>;
  }

  if (!user) {
    return <p>Please log in to view this chat.</p>;
  }

  return (
    <ChatWindow
      messages={messages}
      onSend={sendMessage}
      userId={user._id}
      chatUser={chatUser}  // 👈 for header info
    />
  );
}
