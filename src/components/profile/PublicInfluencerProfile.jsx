import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../utills/privateIntercept";
import { Star } from "lucide-react";

const makeSlug = (value) =>
  typeof value === "string"
    ? value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    : "";

function StarRating({ value, size = 16, className = "" }) {
  const safe = typeof value === "number" && Number.isFinite(value) ? value : 0;
  const rounded = Math.round(safe * 2) / 2;
  const full = Math.floor(rounded);
  const hasHalf = rounded - full === 0.5;

  return (
    <div className={`flex items-center gap-0.5 ${className}`.trim()} aria-label={`Rating ${safe} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        if (idx <= full) {
          return <Star key={idx} size={size} className="text-yellow-500" fill="currentColor" />;
        }

        if (idx === full + 1 && hasHalf) {
          return (
            <span key={idx} className="relative inline-flex" style={{ width: size, height: size }}>
              <Star size={size} className="text-slate-300" />
              <Star
                size={size}
                className="absolute inset-0 text-yellow-500"
                fill="currentColor"
                style={{ clipPath: "inset(0 50% 0 0)" }}
              />
            </span>
          );
        }

        return <Star key={idx} size={size} className="text-slate-300" />;
      })}
    </div>
  );
}

const PublicInfluencerProfile = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [collaborations, setCollaborations] = useState([]);
  const [collabLoading, setCollabLoading] = useState(false);
  const [collabError, setCollabError] = useState("");
  const [rating, setRating] = useState(null);
  const [ratingCount, setRatingCount] = useState(0);

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

  useEffect(() => {
    if (!profile || !profile.id) return;

    const fetchCollaborations = async () => {
      try {
        setCollabLoading(true);
        const res = await axios.get(`/api/profile/public/influencer/id/${profile.id}/collaborations`);
        setCollaborations(res.data?.data?.collaborations || []);
        setCollabError("");
      } catch (err) {
        console.error("Public influencer collaborations error:", err?.response || err);
        setCollabError("Unable to load collaborations.");
      } finally {
        setCollabLoading(false);
      }
    };

    fetchCollaborations();
  }, [profile]);

  useEffect(() => {
    if (!profile || !profile.id) return;

    const fetchRating = async () => {
      try {
        const res = await axios.get(`/api/reviews/user/${profile.id}`);
        const data = res.data?.data || {};
        setRating(typeof data.average_rating === 'number' ? data.average_rating : null);
        setRatingCount(data.reviews_count || 0);
      } catch (err) {
        console.error("Public influencer rating error:", err?.response || err);
      }
    };

    fetchRating();
  }, [profile]);

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
    stats,
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
              {rating !== null && (
                <div className="mt-1 flex items-center gap-2">
                  <StarRating value={rating} />
                  <span className="text-sm font-semibold text-slate-700">{rating.toFixed(1)}</span>
                  {ratingCount > 0 && (
                    <span className="text-xs text-gray-500">({ratingCount} review{ratingCount > 1 ? 's' : ''})</span>
                  )}
                </div>
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

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <p className="text-xs uppercase tracking-wide text-gray-400">Completed campaigns</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">
              {typeof stats?.completed_campaigns === "number" ? stats.completed_campaigns.toLocaleString() : "0"}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 border border-slate-100">
            <p className="text-xs uppercase tracking-wide text-gray-400">Category</p>
            <p className="mt-2 text-xl font-semibold text-gray-900 capitalize">
              {category || "Not specified"}
            </p>
          </div>
        </section>

        {(collabLoading || collabError || collaborations.length > 0) && (
          <section className="bg-white rounded-2xl shadow p-6 border border-slate-100">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Brand collaborations</h2>
            {collabLoading && (
              <p className="text-sm text-gray-500">Loading collaborations...</p>
            )}
            {!collabLoading && collabError && (
              <p className="text-sm text-red-500">{collabError}</p>
            )}
            {!collabLoading && !collabError && collaborations.length === 0 && (
              <p className="text-sm text-gray-500">No public collaborations yet.</p>
            )}
            {!collabLoading && !collabError && collaborations.length > 0 && (
              <div className="mt-2 space-y-3">
                {collaborations.map((item) => {
                  const isAdminApproved = Boolean(item.adminApprovedCompletion);
                  const label = isAdminApproved ? "Completed" : "Ongoing";
                  const badgeClasses = isAdminApproved
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-700";
                  const brandSlug = makeSlug(item.brand?.company_name || item.brand?.name);
                  const brandTarget = brandSlug
                    ? `/profile/brand/${brandSlug}`
                    : `/profile/brand/id/${item.brand?.id}`;

                  return (
                    <Link
                      key={item.proposal_id}
                      to={brandTarget}
                      className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 hover:bg-slate-100 transition"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {item.campaign?.title || "Campaign"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.brand?.name || item.brand?.company_name || "Brand"}
                        </p>
                        {item.campaign?.category && (
                          <p className="text-xs text-indigo-600 mt-0.5 capitalize">
                            {item.campaign.category}
                          </p>
                        )}
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClasses}`}>
                        {label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        )}

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