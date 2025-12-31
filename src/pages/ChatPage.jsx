import { useEffect, useState } from "react";
import axiosInstance from "../utills/privateIntercept";
import { connectSocket, socket } from "../socket";
import ChatWindow from "../components/chat/ChatWindow";
import { useParams } from "react-router-dom";

export default function ChatPage() {
    const { roomId } = useParams();

    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null); // "other" user for 1-1 chats
    const [room, setRoom] = useState(null);        // full room meta (for group name etc.)
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load logged-in user from API so _id is always correct
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await axiosInstance.get("/api/user/me");
                const raw = res.data?.user || res.data?.data?.user || res.data || {};
                const normalizedUser = {
                    _id: raw._id || raw.id,
                    ...raw,
                };
                setUser(normalizedUser);
            } catch (err) {
                console.error("Failed to load current user for chat:", err?.response || err);
            } finally {
                setLoading(false);
            }
        };

        fetchMe();
    }, []);

    // Fetch chat info (influencer details)
    useEffect(() => {
        const fetchChatInfo = async () => {
            try {
                console.log("roomid12 : ", roomId)
                const res = await axiosInstance.get(`/api/chat/chatroom/${roomId}`);
                const roomData = res.data.room;
                console.log("room : ", roomData);
                console.log("user : ", user);

                setRoom(roomData);

                if (user && roomData.participants && !roomData.isGroup) {
                    const myId = String(user._id || "");

                    const other = roomData.participants.find((p) => {
                        const raw = p?.userId?._id || p?.userId;
                        if (!raw) return false;
                        return String(raw) !== myId;
                    });

                    setChatUser(other || null);
                } else {
                    setChatUser(null);
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

        // Ensure socket is authenticated with the latest token (important when switching accounts)
        connectSocket();

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
            chatUser={chatUser}
            room={room}
        />
    );
}