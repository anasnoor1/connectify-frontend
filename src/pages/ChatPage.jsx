import { useEffect, useState } from "react";
import axiosInstance from "../utills/privateIntercept";
import { connectSocket, socket } from "../socket";
import ChatWindow from "../components/chat/ChatWindow";
import { useParams } from "react-router-dom";

export default function ChatPage() {
    const { roomId } = useParams();

    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null);
    const [room, setRoom] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [typingUsers, setTypingUsers] = useState([]);

    // Load logged-in user from API
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

    // Fetch chat info
    useEffect(() => {
        const fetchChatInfo = async () => {
            try {
                const res = await axiosInstance.get(`/api/chat/chatroom/${roomId}`);
                const roomData = res.data.room;
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

        // Message handling
        const handleReceiveMessage = (msg) => {
            setMessages((prev) => [...prev, msg]);
            // Mark messages as read if they're not from current user
            if (msg.senderId._id !== user._id) {
                socket.emit("mark_messages_read", {
                    roomId,
                    messageIds: [msg._id]
                });
            }
        };

        // Typing indicators
        const handleUserTyping = (data) => {
            if (data.roomId === roomId && data.userId !== user._id) {
                setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
            }
        };

        const handleUserStoppedTyping = (data) => {
            if (data.roomId === roomId) {
                setTypingUsers(prev => prev.filter(id => id !== data.userId));
            }
        };

        // Online status
        const handleUserOnline = (data) => {
            setOnlineUsers(prev => ({
                ...prev,
                [data.userId]: true
            }));
        };

        const handleUserOffline = (data) => {
            setOnlineUsers(prev => ({
                ...prev,
                [data.userId]: false
            }));
        };

        // Message status updates
        const handleMessageDelivered = (data) => {
            if (data.roomId === roomId) {
                setMessages(prev => prev.map(msg => 
                    msg._id === data.messageId 
                        ? { ...msg, status: 'delivered', deliveredAt: new Date() }
                        : msg
                ));
            }
        };

        const handleMessagesRead = (data) => {
            if (data.roomId === roomId) {
                setMessages(prev => prev.map(msg => 
                    data.messageIds.includes(msg._id) 
                        ? { 
                            ...msg, 
                            status: 'read',
                            readBy: [...(msg.readBy || []), data.readBy],
                            readAt: {
                                ...(msg.readAt || {}),
                                [data.readBy]: data.readAt
                            }
                        }
                        : msg
                ));
            }
        };

        const handleReactionUpdated = (data) => {
            setMessages(prev => prev.map(msg => 
                msg._id === data.messageId 
                    ? { ...msg, reactions: data.reactions }
                    : msg
            ));
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("user_typing", handleUserTyping);
        socket.on("user_stopped_typing", handleUserStoppedTyping);
        socket.on("user_online", handleUserOnline);
        socket.on("user_offline", handleUserOffline);
        socket.on("message_delivered", handleMessageDelivered);
        socket.on("messages_read", handleMessagesRead);
        socket.on("reaction_updated", handleReactionUpdated);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("user_typing", handleUserTyping);
            socket.off("user_stopped_typing", handleUserStoppedTyping);
            socket.off("user_online", handleUserOnline);
            socket.off("user_offline", handleUserOffline);
            socket.off("message_delivered", handleMessageDelivered);
            socket.off("messages_read", handleMessagesRead);
            socket.emit("leave_room", roomId);
        };
    }, [user, roomId]);

    const sendMessage = async (messageData) => {
        if (!user) return;

        const { text, attachments, replyTo } = messageData;

        // Handle file uploads if any
        let uploadedAttachments = [];
        if (attachments && attachments.length > 0) {
            try {
                const formData = new FormData();
                attachments.forEach(file => {
                    formData.append('files', file);
                });
                formData.append('roomId', roomId);

                const uploadRes = await axiosInstance.post('/api/chat/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                uploadedAttachments = uploadRes.data.attachments || [];
            } catch (error) {
                console.error("Failed to upload files:", error);
                // Still send message without attachments if upload fails
            }
        }

        socket.emit("send_message", {
            roomId,
            message: text,
            attachments: uploadedAttachments,
            replyTo
        });
    };

    const handleTypingStart = () => {
        socket.emit("typing_start", { roomId });
    };

    const handleTypingStop = () => {
        socket.emit("typing_stop", { roomId });
    };

    const handleReply = (message) => {
        // This will be handled by ChatWindow state
    };

    const handleReaction = (messageId, emoji) => {
        socket.emit("add_reaction", {
            roomId,
            messageId,
            emoji
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
            onTypingStart={handleTypingStart}
            onTypingStop={handleTypingStop}
            onReply={handleReply}
            onReaction={handleReaction}
            onlineUsers={onlineUsers}
            typingUsers={typingUsers}
        />
    );
}