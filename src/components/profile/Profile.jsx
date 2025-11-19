import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../utills/privateIntercept";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Shield, Users } from "lucide-react";

const InfoCard = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 min-h-[42px] break-all whitespace-normal">
      {value || "—"}
    </p>
  </div>
);

const HeaderSnapshotItem = ({ label, value }) => {
  const displayValue =
    value === null || value === undefined || value === "" ? "—" : value;

  return (
    <div className="flex flex-col space-y-0.5 min-w-0">
      <p className="text-[11px] text-white/75 tracking-wide">{label}</p>
      <p className="text-sm font-medium text-white/95 truncate sm:line-clamp-2 break-words max-w-xs">
        {displayValue}
      </p>
    </div>
  );
};

const BrandSnapshot = ({ profile = {} }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <InfoCard label="Company" value={profile.company_name} />
    <InfoCard label="Industry" value={profile.industry} />
    <InfoCard label="Website" value={profile.website} />
    <InfoCard label="Phone" value={profile.phone} />
    <div className="md:col-span-2">
      <InfoCard label="Bio" value={profile.bio} />
    </div>
  </div>
);

const InfluencerSnapshot = ({ profile = {} }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <InfoCard label="Category" value={profile.category} />
    <InfoCard label="Instagram" value={profile.instagram_username} />
    <InfoCard label="Followers" value={profile.followers_count} />
    <InfoCard label="Engagement (%)" value={profile.engagement_rate} />
    <InfoCard label="Phone" value={profile.phone} />
    <InfoCard
      label="Social links"
      value={Array.isArray(profile.social_links) ? profile.social_links.join(", ") : profile.social_links}
    />
    <div className="md:col-span-2">
      <InfoCard label="Bio" value={profile.bio} />
    </div>
  </div>
);

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    user: { name: "", email: "", role: "" },
    profile: {},
    stats: { profile_completion: 0 }
  });
  const [instaStats, setInstaStats] = useState(null);
  const [instaLoading, setInstaLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/user/me");
        setData({
          ...res.data,
          profile: res.data?.profile || {},
          stats: res.data?.stats || {},
        });
      } catch (e) {
        console.error("Profile load error:", e);
        toast.error(e.response?.data?.message || "Failed to load profile");
        if (e.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  // Load Instagram stats for influencers when username is available
  useEffect(() => {
    const loadInsta = async () => {
      const role = data.user.role;
      const username = data.profile?.instagram_username?.trim();
      if (role !== "influencer" || !username) return;
      try {
        setInstaLoading(true);
        const res = await axios.get(`/api/instagram/${encodeURIComponent(username)}`);
        setInstaStats(res.data || null);
      } catch (e) {
        // Silent fail to avoid noisy UI; main profile still works
        console.error("Instagram stats load error:", e);
        setInstaStats(null);
      } finally {
        setInstaLoading(false);
      }
    };

    loadInsta();
  }, [data.user.role, data.profile?.instagram_username]);

  const completion = useMemo(() => {
    const profile = data.profile || {};
    const role = data.user.role;
    const fields = role === "brand"
      ? ["company_name", "industry", "website", "bio", "avatar_url"]
      : ["category", "bio", "avatar_url", "social_links"];
    if (!fields.length) return 0;
    const filled = fields.reduce((count, field) => {
      if (field === "social_links") {
        const links = profile[field];
        const hasLinks = Array.isArray(links)
          ? links.length > 0
          : !!String(links || "").trim();
        return count + (hasLinks ? 1 : 0);
      }
      return count + (profile[field] && String(profile[field]).trim() ? 1 : 0);
    }, 0);
    return Math.round((filled / fields.length) * 100);
  }, [data.profile, data.user.role]);

  const isBrand = data.user.role === "brand";
  const profile = data.profile || {};

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-xl" />
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group h-24 w-24 rounded-full ring-4 ring-white/20 bg-white/10 backdrop-blur flex-shrink-0 overflow-hidden border border-white/20 shadow-lg">
              {data.profile.avatar_url ? (
                <img src={data.profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="h-full w-full flex items-center justify-center text-3xl sm:text-4xl font-semibold bg-gradient-to-br from-indigo-100 to-purple-100">
                  {(data.user.name || data.user.email || "U").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold leading-tight">{data.user.name || "Your Name"}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                {data.user.role === "influencer" && (
                  <>
                    <span className="inline-flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full">
                      <Users className="h-3.5 w-3.5" />
                      <span>Followers:</span>
                      <span>{
                        instaStats?.followers_count?.toLocaleString?.() ??
                        instaStats?.followers_count ??
                        data.profile.followers_count ??
                        0
                      }</span>
                    </span>
                    {instaStats && (
                      <>
                        <span className="inline-flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full">
                          <span>Following:</span>
                          <span>{instaStats.following_count?.toLocaleString?.() ?? instaStats.following_count ?? "-"}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full">
                          <span>Posts:</span>
                          <span>{instaStats.post_count?.toLocaleString?.() ?? instaStats.post_count ?? "-"}</span>
                        </span>
                      </>
                    )}
                  </>
                )}
                {!!data.user.email && (
                  <span className="inline-flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full">
                    <Mail className="h-3.5 w-3.5" /> {data.user.email}
                  </span>
                )}
                {!!data.user.role && (
                  <span className="inline-flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full capitalize">
                    <Shield className="h-3.5 w-3.5" /> {data.user.role}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="min-w-44 text-right">
            <div className="text-xs text-white/80 mb-1">Profile Completion</div>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-300 rounded-full transition-all duration-300"
                style={{ width: `${completion}%` }}
              />
            </div>
            <div className="text-sm font-semibold mt-1">{completion}%</div>
            <Link
              to="/dashboard"
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-white/60 px-4 py-2 text-xs sm:text-sm text-white hover:bg-white/10"
            >
              Open dashboard
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {isBrand ? (
            <>
              <HeaderSnapshotItem label="Company" value={profile.company_name} />
              <HeaderSnapshotItem label="Industry" value={profile.industry} />
              <HeaderSnapshotItem label="Website" value={profile.website} />
              <HeaderSnapshotItem label="Phone" value={profile.phone} />
              <HeaderSnapshotItem label="Bio" value={profile.bio} />
            </>
          ) : (
            <>
              <HeaderSnapshotItem label="Category" value={profile.category} />
              <HeaderSnapshotItem
                label="Instagram"
                value={profile.instagram_username || (instaStats && instaStats.username)}
              />
              <HeaderSnapshotItem
                label="Engagement (%)"
                value={profile.engagement_rate ?? (instaStats && instaStats.engagement_rate)}
              />
              <HeaderSnapshotItem label="Phone" value={profile.phone} />
              <HeaderSnapshotItem
                label="Social links"
                value={Array.isArray(profile.social_links) ? profile.social_links.join(", ") : profile.social_links}
              />
              <HeaderSnapshotItem label="Bio" value={profile.bio} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

