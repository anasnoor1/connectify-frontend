import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utills/privateIntercept";

const PublicInfluencerProfile = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/profile/public/influencer/${slug}`);
        setProfile(res.data?.data || null);
        setError("");
      } catch (err) {
        console.error("Public influencer profile error:", err?.response || err);
        setError("Profile not found or unavailable.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-gray-600 text-sm font-medium">Loading influencer profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md bg-white rounded-2xl shadow p-8 text-center space-y-3">
          <h1 className="text-xl font-semibold text-gray-900">Influencer profile</h1>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const {
    name,
    avatar_url,
    category,
    instagram_username,
    followers_count,
    engagement_rate,
    bio,
    social_links = [],
  } = profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
              {avatar_url ? (
                <img
                  src={avatar_url}
                  alt={name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-2xl font-semibold text-indigo-600">
                  {name?.charAt(0).toUpperCase() || "I"}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{name}</h1>
              {category && (
                <p className="text-sm text-indigo-600 mt-1 capitalize">{category}</p>
              )}
              {instagram_username && (
                <p className="text-sm text-gray-500 mt-1">
                  Instagram: <span className="font-medium">@{instagram_username.replace(/^@/, "")}</span>
                </p>
              )}
            </div>
          </div>
        </header>

        {bio && (
          <section className="bg-white rounded-2xl shadow p-6 border border-slate-100">
            <h2 className="text-base font-semibold text-gray-900 mb-2">About</h2>
            <p className="text-sm text-gray-600 whitespace-pre-line">{bio}</p>
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow p-5 border border-slate-100">
            <p className="text-xs uppercase tracking-wide text-gray-400">Followers</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">
              {typeof followers_count === "number"
                ? followers_count.toLocaleString()
                : followers_count || "N/A"}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 border border-slate-100">
            <p className="text-xs uppercase tracking-wide text-gray-400">Engagement rate</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">
              {typeof engagement_rate === "number" ? `${engagement_rate}%` : "N/A"}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 border border-slate-100">
            <p className="text-xs uppercase tracking-wide text-gray-400">Category</p>
            <p className="mt-2 text-xl font-semibold text-gray-900 capitalize">
              {category || "Not specified"}
            </p>
          </div>
        </section>

        {social_links.length > 0 && (
          <section className="bg-white rounded-2xl shadow p-6 border border-slate-100">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Social links</h2>
            <div className="flex flex-wrap gap-3">
              {social_links.map((link, idx) => (
                <a
                  key={`${link}-${idx}`}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 break-all"
                >
                  {link}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PublicInfluencerProfile;
