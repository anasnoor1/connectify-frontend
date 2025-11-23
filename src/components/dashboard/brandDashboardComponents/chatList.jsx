// import React, { useEffect, useState } from 'react';
// import axios from '../../../utills/privateIntercept'; // your axios instance with token

// const BrandChats = () => {
//     const [chats, setChats] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchChats = async () => {
//             try {
//                 const response = await axios.get('/api/chat/brand'); // backend route
//                 setChats(response.data.data);
//                 console.log(response.data.data);
//             } catch (err) {
//                 console.error('Error fetching chats', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchChats();
//     }, []);

//     if (loading) return <p>Loading chats...</p>;

//     return (
//         <div className="p-6">
//             <h2 className="text-2xl font-bold mb-4">Your Chats</h2>
//             {chats.length === 0 ? (
//                 <p>No chats available.</p>
//             ) : (
//                 <div className="space-y-2">
//                     {/* {chats.map((chat) => (
//             <div key={chat._id} className="p-4 border rounded shadow-sm hover:bg-gray-50 cursor-pointer">
//               <p>Chat with: {chat.participants.map(u => u.name).join(', ')}</p>
//               <p>Last message: {chat.lastMessage?.text || 'No messages yet'}</p>
//             </div>
//           ))} */}
//                     {chats.map((chat) => (
//                         <div
//                             key={chat._id}
//                             className="p-4 border rounded shadow-sm hover:bg-gray-50 cursor-pointer"
//                         >
//                             <p>Chat with: {chat.influencerId?.name || "Unknown"}</p>

//                             <p>Last message: {chat.lastMessage?.text || 'No messages yet'}</p>
//                         </div>
//                     ))}

//                 </div>
//             )}
//         </div>
//     );
// };

// export default BrandChats;
/////////////////

// import React, { useEffect, useState } from 'react';
// import axios from '../../../utills/privateIntercept';
// import { useNavigate } from "react-router-dom";

// const BrandChats = () => {
//     const [chats, setChats] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchChats = async () => {
//             try {
//                 const response = await axios.get('/api/chat/brand');
//                 setChats(response.data.data);
//             } catch (err) {
//                 console.error('Error fetching chats', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchChats();
//     }, []);

//     if (loading) return <p className="p-6">Loading chats...</p>;

//     const openChat = (roomId) => {
//         navigate(`/chat/${roomId}`);
//     };

//     return (
//         <div className="max-w-lg mx-auto bg-white h-screen border-x">
//             <div className="p-4 border-b bg-green-600 text-white text-xl font-bold">
//                 Chats
//             </div>

//             {chats.length === 0 ? (
//                 <p className="p-6 text-gray-600">No chats available.</p>
//             ) : (
//                 <div className="divide-y">
//                     {chats.map((chat) => (
//                         <div
//                             key={chat._id}
//                             onClick={() => openChat(chat._id)}
//                             className="flex items-center gap-4 p-4 hover:bg-gray-100 cursor-pointer"
//                         >
//                             {/* Avatar */}
//                             <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-lg font-semibold text-white bg-green-500">
//                                 {chat.influencerId?.name?.charAt(0).toUpperCase()}
//                             </div>

//                             {/* User info */}
//                             <div className="flex-1">
//                                 <div className="font-semibold text-gray-900">
//                                     {chat.influencerId?.name}
//                                 </div>

//                                 <div className="text-gray-600 text-sm truncate max-w-[220px]">
//                                     {chat.lastMessage?.text || "No messages yet"}
//                                 </div>
//                             </div>

//                             {/* Time */}
//                             <div className="text-xs text-gray-500">
//                                 {chat.lastMessage?.createdAt
//                                     ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//                                     : ""}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BrandChats;
//////////////////////

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
        navigate(`/chat/${roomId}`);
    };

    // Determine the "other participant" dynamically
    const getParticipant = (chat) => {
        let userId = null;
        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                const parsed = JSON.parse(stored);
                // Handle both structures: { user: { _id: ... } } or { _id: ... }
                userId = parsed.user?._id || parsed._id;
            }
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
        }

        if (!userId) return {};

        const other = chat.participants.find(p => p.userId._id !== userId);
        return other?.userId || {};
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
