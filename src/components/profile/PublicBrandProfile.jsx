import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utills/privateIntercept";

const PublicBrandProfile = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [collaborations, setCollaborations] = useState([]);
  const [collabLoading, setCollabLoading] = useState(false);
  const [collabError, setCollabError] = useState("");

  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/influencer/dashboard");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/profile/public/brand/${slug}`);
        setProfile(res.data?.data || null);
        setError("");
      } catch (err) {
        console.error("Public brand profile error:", err?.response || err);
        setError("Brand profile not found or unavailable.");
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
        const res = await axios.get(`/api/profile/public/brand/id/${profile.id}/collaborations`);
        setCollaborations(res.data?.data?.collaborations || []);
        setCollabError("");
      } catch (err) {
        console.error("Public brand collaborations error:", err?.response || err);
        setCollabError("Unable to load collaborations.");
      } finally {
        setCollabLoading(false);
      }
    };

    fetchCollaborations();
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-gray-600 text-sm font-medium">Loading brand profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md bg-white rounded-2xl shadow p-8 text-center space-y-3">
          <h1 className="text-xl font-semibold text-gray-900">Brand profile</h1>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const {
    name,
    company_name,
    avatar_url,
    industry,
    website,
    bio,
  } = profile;

  const displayName = company_name || name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 text-sm rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 mb-4"
          >
            Back
          </button>
        </div>
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
              {avatar_url ? (
                <img
                  src={avatar_url}
                  alt={displayName}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-2xl font-semibold text-indigo-600">
                  {displayName?.charAt(0).toUpperCase() || "B"}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{displayName}</h1>
              {industry && (
                <p className="text-sm text-indigo-600 mt-1 capitalize">{industry}</p>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 mt-1 inline-block break-all"
                >
                  {website}
                </a>
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

        <section className="bg-white rounded-2xl shadow p-6 border border-slate-100">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Brand details</h2>
          <dl className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <dt>Brand name</dt>
              <dd className="font-medium text-gray-900">{displayName}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Industry</dt>
              <dd className="font-medium text-gray-900">{industry || "Not specified"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Website</dt>
              <dd className="font-medium text-gray-900 break-all">
                {website || "Not provided"}
              </dd>
            </div>
          </dl>
        </section>

        {(collabLoading || collabError || collaborations.length > 0) && (
          <section className="bg-white rounded-2xl shadow p-6 border border-slate-100">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Influencer collaborations</h2>
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
                {collaborations.map((item) => (
                  <div
                    key={item.proposal_id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.influencer?.name || "Influencer"}
                      </p>
                      {item.influencer?.instagram_username && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Instagram: <span className="font-medium">@{item.influencer.instagram_username.replace(/^@/, "")}</span>
                        </p>
                      )}
                      {item.campaign?.title && (
                        <p className="text-xs text-indigo-600 mt-0.5">
                          Campaign: {item.campaign.title}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      {item.status === "accepted" ? "Completed" : item.status || "Active"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default PublicBrandProfile;