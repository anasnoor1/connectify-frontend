import { useEffect, useState } from "react";

import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import { Edit2, User, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import axiosInstance from "../../utills/privateIntercept";
import Loader from "../../utills/loader";
import ProfileEditor from './ProfileEditor';
import CampaignCard from "./influencerDashboardComponents/CampaignCard";
import ProposalModal from "./influencerDashboardComponents/proposalModal";
import { socket } from "../../socket";

export default function InfluencerDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [influencerData, setInfluencerData] = useState(null);
  const [stats, setStats] = useState({ completedCampaigns: 0, totalEarned: 0 });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [stripeStatus, setStripeStatus] = useState({ loading: true, connected: false });
  const [stripeDashboardLoading, setStripeDashboardLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [disconnectLoading, setDisconnectLoading] = useState(false);

  useEffect(() => {
    fetchInfluencerData();
    fetchInfluencerStats();
    fetchStripeStatus();
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [page, status]);

  useEffect(() => {
    const handleCampaignsUpdated = () => {
      fetchCampaigns();
      fetchInfluencerStats();
    };

    socket.on("campaigns_updated", handleCampaignsUpdated);

    return () => {
      socket.off("campaigns_updated", handleCampaignsUpdated);
    };
  }, [page, status]);

  const fetchInfluencerData = async () => {
    try {
      const response = await axiosInstance.get('/api/user/me');
      const user = response.data?.user || response.data || {};
      const profile = response.data?.profile || response.data?.data?.profile || response.data?.data || {};
      setInfluencerData({
        ...profile,
        name: profile.name || user.name,
        email: profile.email || user.email,
      });
    } catch (error) {
      console.error('Error fetching influencer data:', error);
      toast.error('Failed to load influencer data');
    }
  };

  const fetchStripeStatus = async () => {
    try {
      const res = await axiosInstance.get('/api/payment/stripe/status');
      const data = res.data?.data || {};
      setStripeStatus({
        loading: false,
        connected: !!data.connected,
      });
    } catch (error) {
      console.error('Error fetching Stripe status:', error);
      setStripeStatus({ loading: false, connected: false });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const connect = params.get('connect');
    if (connect) {
      if (connect === 'success') {
        toast.success('Stripe connected successfully');
      } else if (connect === 'refresh') {
        toast.info('Please finish Stripe onboarding to receive payouts');
      }
      fetchStripeStatus();
      const cleanPath = location.pathname;
      window.history.replaceState({}, '', cleanPath);
    }
  }, [location.search]);

  const handleConnectStripe = async () => {
    try {
      const res = await axiosInstance.post('/api/payment/stripe/connect');
      const url = res.data?.url;
      if (!url) {
        toast.error('Failed to start Stripe onboarding');
        return;
      }
      window.location.href = url;
    } catch (error) {
      console.error('Error starting Stripe connect onboarding:', error);
      const msg = error?.response?.data?.message || error?.message || 'Failed to start Stripe onboarding';
      toast.error(msg);
    }
  };

  const handleOpenStripeDashboard = async () => {
    try {
      setStripeDashboardLoading(true);
      const res = await axiosInstance.get('/api/payment/stripe/login-link');
      const url = res.data?.url;
      if (!url) {
        toast.error('Failed to open Stripe dashboard');
        return;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error creating Stripe login link:', error);
      const msg = error?.response?.data?.message || error?.message || 'Failed to open Stripe dashboard';
      toast.error(msg);
    } finally {
      setStripeDashboardLoading(false);
    }
  };

  const handleDisconnectStripe = () => {
    setShowDisconnectModal(true);
  };

  const confirmDisconnect = async () => {
    try {
      setDisconnectLoading(true);
      await axiosInstance.post('/api/payment/stripe/disconnect');
      toast.success('Stripe disconnected successfully');
      setStripeStatus({ loading: false, connected: false });
    } catch (error) {
      console.error('Error disconnecting Stripe:', error);
      const msg = error?.response?.data?.message || error?.message || 'Failed to disconnect Stripe';
      toast.error(msg);
    } finally {
      setDisconnectLoading(false);
      setShowDisconnectModal(false);
    }
  };

  const cancelDisconnect = () => {
    setShowDisconnectModal(false);
  };

  const fetchInfluencerStats = async () => {
    try {
      const res = await axiosInstance.get('/api/proposals/my/stats');
      const data = res.data?.data || {};
      setStats({
        completedCampaigns: data.completedCampaigns || 0,
        totalEarned: data.totalEarned || 0,
      });
    } catch (error) {
      console.error('Error fetching influencer stats:', error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (status !== "All") {
        params.status = status.toLowerCase();
      }
      const res = await axiosInstance.get("/api/campaigns", { params });
      const data = res.data?.data || {};
      setCampaigns(data.campaigns || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const openProposalModal = (campaign) => {
    console.log('Opening proposal modal for campaign:', campaign);
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const openCampaignView = (campaign) => {
    if (!campaign) return;
    const campaignId = campaign._id || campaign.id;
    if (!campaignId) return;
    navigate(`/campaigns/${campaignId}`, { state: { campaign } });
  };

  const openBrandProfile = (campaign) => {
    if (!campaign) return;
    const rawName = campaign.brand_id?.name || campaign.brand;
    if (!rawName) return;
    const slug = String(rawName).trim().toLowerCase().replace(/\s+/g, "-");
    navigate(`/profile/brand/${slug}`);
  };

  const handleChatNow = async (campaign) => {
    try {
      const res = await axiosInstance.post("/api/chat/open", {
        campaignId: campaign._id
      });

      if (res.data.success && res.data.room) {
        navigate(`/chats/${res.data.room._id}`);
      }
    } catch (error) {
      console.error("Error opening chat:", error);
      const msg = error?.response?.data?.error || error?.message || "Failed to open chat";
      toast.error(msg);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleMarkComplete = async (campaign) => {
    if (!campaign?._id) return;
    try {
      const res = await axiosInstance.post(`/api/campaigns/${campaign._id}/influencer-complete`);
      const msg = res?.data?.message || 'Campaign marked as completed from your side';
      toast.success(msg);
      // Refresh campaigns list so status/flags update in UI
      fetchCampaigns();
      fetchInfluencerStats();
    } catch (error) {
      console.error('Error marking campaign complete as influencer:', error);
      const msg = error?.response?.data?.message || error?.message || 'Failed to mark campaign as completed';
      toast.error(msg);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (editingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setEditingProfile(false)}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <ProfileEditor
            userRole="influencer"
            onCancel={() => setEditingProfile(false)}
            onSave={(updatedProfile) => {
              setInfluencerData(prev => ({ ...prev, ...updatedProfile }));
              setEditingProfile(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 grid md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Influencer</h4>
                <p className="text-xs text-slate-500">Dashboard</p>
              </div>
              <div className="text-xs">
                <span className="inline-block rounded-full px-2 py-1 bg-indigo-50 text-indigo-700 text-xs">Pro</span>
              </div>
            </div>
            <nav className="mt-4 space-y-1">
              <NavLink
                to="/influencer/dashboard"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm ${isActive ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-700 hover:bg-gray-50"}`
                }
              >
                Campaign List
              </NavLink>
              <NavLink to="/influencer/proposals" className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-gray-50">
                My Proposals
              </NavLink>
              <NavLink to="/influencer/suggestion" className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-gray-50">
                Suggested Campaigns
              </NavLink>
              <NavLink
                to="/chats"
                className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-gray-50"
              >
                My Chats
              </NavLink>
            </nav>
          </div>

          {influencerData && (
            <>
              {/* Stats card on top */}
              <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 space-y-2">
                <p className="text-xs font-semibold text-slate-700">Performance</p>
                <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-[11px] text-slate-500">Completed campaigns</p>
                    <p className="text-sm font-semibold text-slate-900">{stats.completedCampaigns}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-[11px] text-slate-500">Total earned</p>
                    <p className="text-sm font-semibold text-emerald-600">
                      ${stats.totalEarned.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Payouts</p>
                    <p className="text-[11px] text-slate-500">Connect Stripe to receive earnings</p>
                  </div>
                  {stripeStatus.loading ? (
                    <span className="text-[11px] text-slate-400">Checking...</span>
                  ) : stripeStatus.connected ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium">Connected</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-medium">Not connected</span>
                  )}
                </div>
                {!stripeStatus.loading && !stripeStatus.connected && (
                  <button
                    type="button"
                    onClick={handleConnectStripe}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    Connect Stripe
                  </button>
                )}
                {!stripeStatus.loading && stripeStatus.connected && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-500">
                      Your payouts will be sent to your connected Stripe account after campaign approval.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenStripeDashboard}
                      disabled={stripeDashboardLoading}
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg border border-indigo-100 text-indigo-700 hover:bg-indigo-50 transition disabled:opacity-60"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {stripeDashboardLoading ? 'Opening...' : 'Open Stripe Dashboard'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDisconnectStripe}
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg border border-red-100 text-red-600 hover:bg-red-50 transition"
                    >
                      Disconnect Stripe
                    </button>
                  </div>
                )}
              </div>

              {/* Original profile snapshot card below */}
              <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden">
                    {influencerData.avatar_url ? (
                      <img
                        src={influencerData.avatar_url}
                        alt={influencerData.name || "Influencer avatar"}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/80?text=Profile"; }}
                      />
                    ) : <User className="h-5 w-5 text-indigo-500" />}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Influencer snapshot</p>
                    <h4 className="text-sm font-semibold text-slate-900">{influencerData.name || "Your profile"}</h4>
                    {influencerData.category && <p className="text-xs text-slate-500">{influencerData.category}</p>}
                  </div>
                </div>
                <button
                  onClick={() => setEditingProfile(true)}
                  className="w-full mt-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition"
                >
                  <Edit2 className="h-3 w-3" />
                  Update profile
                </button>
              </div>
            </>
          )}
        </aside>

        <section className="md:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Campaigns</h2>
              <p className="text-sm text-slate-500 mt-1">Explore and apply to brand opportunities ({total} total)</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditingProfile(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 shadow-sm"
              >
                <Edit2 className="h-4 w-4" /> Edit Profile
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search campaigns..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Campaigns</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {(() => {
            const filteredCampaigns = campaigns.filter(
              (c) => !query || c.title?.toLowerCase().includes(query.toLowerCase())
            );
            return filteredCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign._id}
                    campaign={campaign}
                    onOpenProposal={() => openProposalModal(campaign)}
                    onOpenView={() => openCampaignView(campaign)}
                    onOpenBrandProfile={() => openBrandProfile(campaign)}
                    onChatNow={() => handleChatNow(campaign)}
                    onMarkComplete={() => handleMarkComplete(campaign)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                <p className="text-slate-500">No campaigns found</p>
              </div>
            );
          })()}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= page - 1 && pageNum <= page + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg border ${page === pageNum
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === page - 2 || pageNum === page + 2) {
                    return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="text-center mt-4 text-sm text-gray-500">
            Page {page} of {totalPages} • Showing {(() => {
              const filteredCampaigns = campaigns.filter(
                (c) => !query || c.title?.toLowerCase().includes(query.toLowerCase())
              );
              return filteredCampaigns.length;
            })()} of {total} campaigns
          </div>
        </section>
      </div>

      {isModalOpen && selectedCampaign && (
        <ProposalModal
          isOpen={isModalOpen}
          campaign={selectedCampaign}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCampaign(null);
          }}
        />
      )}

      {showDisconnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-sm font-semibold text-slate-900">Disconnect Stripe?</h3>
            <p className="mt-2 text-xs text-slate-600">You will not receive payouts until you connect again.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelDisconnect}
                className="px-3 py-2 text-xs rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDisconnect}
                disabled={disconnectLoading}
                className="px-3 py-2 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {disconnectLoading ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}