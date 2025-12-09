import React, { useEffect, useState } from 'react';
import axios from '../../../utills/privateIntercept';
import { useNavigate } from "react-router-dom";
import { socket } from "../../../socket";

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get('/api/user/me');
                const raw = res.data?.user || res.data?.data?.user || res.data || {};
                const id = (raw._id || raw.id || "").toString();
                setCurrentUserId(id || null);
            } catch (err) {
                console.error('Error fetching current user for chats', err);
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                // Unified endpoint for both influencer and brand
                const response = await axios.get('/api/chat/my-chats');
                const data = response.data.data || [];
                setChats(data);

                // Join all chat rooms so socket receives real-time messages
                data.forEach((chat) => {
                    if (chat && chat._id) {
                        socket.emit("join_room", chat._id);
                    }
                });
            } catch (err) {
                console.error('Error fetching chats', err);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    useEffect(() => {
        const handleReceiveMessage = (msg) => {
            if (!msg?.roomId) return;
            setChats((prev) =>
                prev.map((chat) =>
                    chat._id === msg.roomId
                        ? {
                            ...chat,
                            lastMessage: {
                                text: msg.message,
                                senderId: msg.senderId?._id || msg.senderId,
                                createdAt: msg.createdAt || new Date().toISOString(),
                            },
                        }
                        : chat
                )
            );
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, []);

    if (loading) return <p className="p-6">Loading chats...</p>;

    const openChat = (roomId) => {
        navigate(`/chats/${roomId}`);
    };

    // Determine the "other participant" dynamically
    const getParticipant = (chat) => {
        if (!currentUserId || !Array.isArray(chat.participants)) return {};

        // Find the participant that is NOT the current user (normalize to strings)
        const otherParticipant = chat.participants.find((p) => {
            const raw = p?.userId?._id || p?.userId;
            if (!raw) return false;
            const pId = raw.toString();
            return pId !== currentUserId;
        });

        return otherParticipant?.userId || {};
    };

    return (
        <div className="max-w-lg mx-auto bg-white h-screen border-x border-slate-200">
            <div className="p-4 border-b border-slate-200 bg-indigo-600 text-white text-xl font-semibold tracking-wide">
                Chats
            </div>

            {chats.length === 0 ? (
                <p className="p-6 text-gray-600">No chats available.</p>
            ) : (
                <div className="divide-y divide-slate-100">
                    {chats.map(chat => {
                        const isGroup = chat.isGroup;
                        const participant = isGroup ? null : getParticipant(chat);

                        const displayName = isGroup
                            ? (chat.groupName || "Group Chat")
                            : (participant?.name || "Unknown");

                        const avatarLetter = isGroup
                            ? (chat.groupName?.charAt(0)?.toUpperCase() || "G")
                            : (participant?.name?.charAt(0)?.toUpperCase() || "U");

                        const avatarUrl = isGroup ? null : participant?.avatar_url;

                        return (
                            <div
                                key={chat._id}
                                onClick={() => openChat(chat._id)}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition"
                            >

                                {/* Avatar */}
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isGroup && participant?.role && participant?._id) {
                                            navigate(`/profile/${participant.role}/id/${participant._id}`);
                                        }
                                    }}
                                    className="w-12 h-12 rounded-full relative cursor-pointer"
                                    title={isGroup ? undefined : "View Profile"}
                                >

                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt={displayName}
                                            className="w-12 h-12 rounded-full object-cover border border-indigo-100 shadow-sm"

                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                                const fallback = e.currentTarget.nextElementSibling;
                                                if (fallback) fallback.style.display = "flex";
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className={`w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-lg font-semibold text-white hover:opacity-80 transition-opacity ${avatarUrl ? "hidden" : "flex"}`}
                                    >
                                        {avatarLetter}
                                    </div>
                                </div>

                                {/* Chat info */}
                                <div className="flex-1 min-w-0">
                                    <div
                                        className={`font-semibold text-slate-900 truncate ${isGroup ? '' : 'hover:underline'}`}
                                        onClick={(e) => {
                                            if (isGroup) return;

                                            e.stopPropagation();
                                            if (participant?.role && participant?._id) {
                                                navigate(`/profile/${participant.role}/id/${participant._id}`);
                                            }
                                        }}
                                    >
                                        {displayName}
                                    </div>
                                    <div className="text-slate-500 text-sm truncate">
                                        {chat.lastMessage?.text || "No messages yet"}
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="text-xs text-slate-500 whitespace-nowrap text-right min-w-[60px]">
                                    {chat.lastMessage?.createdAt
                                        ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : ""}
                                </div>
                            </div>

                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ChatList;