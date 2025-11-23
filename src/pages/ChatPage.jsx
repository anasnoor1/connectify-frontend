
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
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUser = storedUser?.user || storedUser || null;

    setUser(currentUser);
  }, []);

  // Fetch chat info (influencer details)
  useEffect(() => {
    const fetchChatInfo = async () => {
      try {
        const res = await axiosInstance.get(`/api/chat/room/${roomId}`);
        const room = res.data.room;

        // Determine who is the other person
        if (user) {
          const other =
            room.influencerId._id === user._id
              ? room.brandId
              : room.influencerId;

          setChatUser(other);
        }
      } catch (err) {
        console.error("Failed to fetch chat info:", err);
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

  if (!user || loading) {
    return <p>Loading chat...</p>;
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
