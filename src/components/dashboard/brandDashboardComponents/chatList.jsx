import React, { useEffect, useState } from 'react';
import axios from '../../../utills/privateIntercept';
import { useNavigate } from "react-router-dom";

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                // Unified endpoint for both influencer and brand
                const response = await axios.get('/api/chat/my-chats');
                setChats(response.data.data);
            } catch (err) {
                console.error('Error fetching chats', err);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    if (loading) return <p className="p-6">Loading chats...</p>;

    const openChat = (roomId) => {
        navigate(`/chats/${roomId}`);
    };

    // Determine the "other participant" dynamically
    const getParticipant = (chat) => {
        const stored = localStorage.getItem("user");
        if (!stored) return {};

        let userData = null;
        try {
            userData = JSON.parse(stored);
        } catch (e) {
            console.error("Invalid user in storage:", stored);
            return {};
        }

        const currentUser = userData.user || userData;
        const currentUserId = currentUser._id || currentUser.id;

        if (!currentUserId || !chat.participants) return {};

        // Find the participant that is NOT the current user
        const otherParticipant = chat.participants.find(p => {
            const pId = p.userId?._id || p.userId;
            return pId !== currentUserId;
        });

        return otherParticipant?.userId || {};
    };

    return (
        <div className="max-w-lg mx-auto bg-white h-screen border-x">
            <div className="p-4 border-b bg-green-600 text-white text-xl font-bold">
                Chats
            </div>

            {chats.length === 0 ? (
                <p className="p-6 text-gray-600">No chats available.</p>
            ) : (
                <div className="divide-y">
                    {chats.map(chat => {
                        const participant = getParticipant(chat);
                        return (
                            <div
                                key={chat._id}
                                onClick={() => openChat(chat._id)}
                                className="flex items-center gap-4 p-4 hover:bg-gray-100 cursor-pointer"
                            >
                                {/* Avatar */}
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (participant?.role && participant?._id) {
                                            navigate(`/profile/${participant.role}/id/${participant._id}`);
                                        }
                                    }}
                                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-lg font-semibold text-white hover:opacity-80 transition-opacity"
                                    title="View Profile"
                                >
                                    {participant?.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>

                                {/* User info */}
                                <div className="flex-1">
                                    <div
                                        className="font-semibold text-gray-900 truncate hover:underline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (participant?.role && participant?._id) {
                                                navigate(`/profile/${participant.role}/id/${participant._id}`);
                                            }
                                        }}
                                    >
                                        {participant?.name || "Unknown"}
                                    </div>
                                    <div className="text-gray-600 text-sm truncate max-w-[220px]">
                                        {chat.lastMessage?.text || "No messages yet"}
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="text-xs text-gray-500">
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