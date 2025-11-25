import { useEffect, useState } from "react";
import axiosInstance from "../utills/privateIntercept";
import { socket } from "../socket";
import ChatWindow from "../components/chat/ChatWindow";
import { useParams } from "react-router-dom";

export default function ChatPage() {
    const { roomId } = useParams();  // cleaner than split pathname

    console.log("roomId : ", roomId)
    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null); // influencer or brand user
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load logged-in user
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        // const currentUser = storedUser?.user || storedUser || null;

        // if (currentUser) {
        //     setUser(currentUser);
        // }
        const currentUser = (storedUser?.user || storedUser || {});
        const normalizedUser = {
            _id: currentUser._id || currentUser.id,
            ...currentUser
        };
        setUser(normalizedUser);

        setLoading(false);

    }, []);

    // Fetch chat info (influencer details)
    useEffect(() => {
        const fetchChatInfo = async () => {
            try {
                console.log("roomid12 : ", roomId)
                const res = await axiosInstance.get(`/api/chat/chatroom/${roomId}`);
                const room = res.data.room;
                console.log("room : ", room);
                console.log("user : ", user);

                // Determine who is the other person
                // if (user) {
                //   const other =
                //     room.influencerId._id === user._id
                //       ? room.brandId
                //       : room.influencerId;

                //   console.log("room.influencerId._id : " , room.influencerId._id )
                //   console.log("user._id : ",user._id )
                //   setChatUser(other);
                // }

                if (user && room.participants) {
                    const other = room.participants.find(
                        (p) => p._id !== user._id
                    );

                    setChatUser(other || null);
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
