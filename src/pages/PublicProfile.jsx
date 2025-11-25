import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    User,
    MapPin,
    Link as LinkIcon,
    Instagram,
    Twitter,
    Facebook,
    Youtube,
    Globe,
    Mail,
    CheckCircle,
    Briefcase,
    Users,
    Activity
} from 'lucide-react';

const PublicProfile = () => {
    const { role, id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Use relative path if proxy is set up or if axios has baseURL, otherwise fallback
                // Since we are using default axios here, we should probably use the full URL or configure it.
                // But to be safe and consistent with other parts, let's try relative path if we were using the instance, 
                // but here we are using raw axios. Let's stick to the hardcoded localhost for now as requested by previous context,
                // BUT ensure we handle the response structure correctly.
                const response = await axios.get(`http://localhost:5000/api/profile/public/${role}/id/${id}`);
                setProfile(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        if (role && id) {
            fetchProfile();
        }
    }, [role, id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
                    <p className="text-gray-600">{error || "The user you are looking for doesn't exist or is unavailable."}</p>
                </div>
            </div>
        );
    }

    const isBrand = role === 'brand';

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Cover Image Placeholder */}
                    <div className="h-32 sm:h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    {/* Profile Header */}
                    <div className="relative px-6 pb-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16 mb-6">
                            {/* Avatar */}
                            <div className="relative">
                                <img
                                    src={profile.avatar_url || "https://via.placeholder.com/150"}
                                    alt={profile.name}
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                                />
                                {profile.is_verified && (
                                    <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-white" title="Verified">
                                        <CheckCircle size={16} fill="currentColor" className="text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Name & Role */}
                            <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left flex-1">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-2">
                                    {profile.company_name || profile.name}
                                </h1>
                                <p className="text-gray-500 font-medium capitalize flex items-center justify-center sm:justify-start gap-1">
                                    {isBrand ? <Briefcase size={16} /> : <User size={16} />}
                                    {isBrand ? 'Brand' : 'Influencer'}
                                    {profile.industry && ` • ${profile.industry}`}
                                    {profile.category && ` • ${profile.category}`}
                                </p>
                            </div>
                        </div>

                        {/* Bio */}
                        {profile.bio && (
                            <div className="mb-8 text-center sm:text-left">
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                            </div>
                        )}

                        {/* Stats / Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 border-t border-gray-100 pt-6">
                            {/* Brand Specifics */}
                            {isBrand && (
                                <>
                                    {profile.website && (
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                                <Globe size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Website</p>
                                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate block">
                                                    {profile.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Influencer Specifics */}
                            {!isBrand && (
                                <>
                                    {profile.followers_count !== null && (
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                                                <Users size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Followers</p>
                                                <p className="font-semibold">{profile.followers_count.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )}
                                    {profile.engagement_rate !== null && (
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                                <Activity size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Engagement Rate</p>
                                                <p className="font-semibold">{profile.engagement_rate}%</p>
                                            </div>
                                        </div>
                                    )}
                                    {profile.instagram_username && (
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                                <Instagram size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Instagram</p>
                                                <a href={`https://instagram.com/${profile.instagram_username}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                                                    @{profile.instagram_username}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Social Links (Generic) */}
                        {profile.social_links && profile.social_links.length > 0 && (
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Social Presence</h3>
                                <div className="flex flex-wrap gap-3">
                                    {profile.social_links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.startsWith('http') ? link : `https://${link}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200"
                                        >
                                            <LinkIcon size={16} />
                                            <span className="text-sm font-medium truncate max-w-[200px]">{link.replace(/^https?:\/\//, '')}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
