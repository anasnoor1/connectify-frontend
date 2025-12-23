import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utills/privateIntercept";
import Loader from "../../../utills/loader";
import { toast } from "react-toastify";
import ReviewModal from "../../reviews/ReviewModal";

export default function MyProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState(null); // { proposal, campaignId, toUserId }
  const [disputesByCampaign, setDisputesByCampaign] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await axiosInstance.get("/api/proposals/my");
        setProposals(res.data.data.proposals || []);
      } catch (err) {
        console.error("Error fetching proposals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await axiosInstance.get("/api/disputes");
        const list = res.data?.data || [];
        const map = {};
        list.forEach((d) => {
          const cid = d.campaignId?._id || d.campaignId;
          if (!cid) return;
          if (["pending", "needs_info", "escalated"].includes(d.status)) {
            // single open dispute per campaign is enforced backend; if multiple, keep latest
            if (!map[cid] || new Date(d.createdAt) > new Date(map[cid].createdAt || 0)) {
              map[cid] = d;
            }
          }
        });
        setDisputesByCampaign(map);
      } catch (err) {
        console.error("Error fetching disputes for proposals:", err);
      }
    };

    fetchDisputes();
  }, []);

  const openReview = (p) => {
    const campaignId = p.campaignId?._id || p.campaignId;
    const brand = p.campaignId?.brand_id;
    const toUserId = brand?._id || brand;
    if (!campaignId || !toUserId) {
      toast.error("Unable to open review form");
      return;
    }
    setReviewTarget({ proposal: p, campaignId, toUserId });
  };

  const closeReview = (shouldRefresh) => {
    setReviewTarget(null);
    if (shouldRefresh) {
      // re-fetch proposals to reflect any review-dependent UI in future
      (async () => {
        try {
          const res = await axiosInstance.get("/api/proposals/my");
          setProposals(res.data.data.proposals || []);
        } catch (err) {
          console.error("Error refreshing proposals after review:", err);
        }
      })();
    }
  };

  const handleOpenDispute = (p) => {
    const campaignId = p.campaignId?._id || p.campaignId;
    if (!campaignId) return;
    const dispute = disputesByCampaign[campaignId];
    if (!dispute) return;
    navigate(`/disputes/${dispute._id}`);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/influencer/dashboard");
    }
  };

  const handleOpenChat = async (p) => {
    if (!p?.campaignId?._id && !p?.campaignId) return;
    const campaignId = p.campaignId._id || p.campaignId;
    try {
      const res = await axiosInstance.post('/api/chat/open', { campaignId });
      if (res.data?.success && res.data.room?._id) {
        navigate(`/chats/${res.data.room._id}`);
      }
    } catch (err) {
      console.error('Failed to open chat from proposal:', err?.response || err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          className="inline-flex items-center px-4 py-2 text-sm rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <h2 className="text-2xl font-bold text-slate-900">My Proposals</h2>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center text-slate-500 mt-10">No proposals found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {proposals.map((p) => (
            <div key={p._id} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition">
              {(() => {
                const campaignId = p.campaignId?._id || p.campaignId;
                const dispute = campaignId ? disputesByCampaign[campaignId] : null;
                const hasOpenDispute = !!dispute;
                return (
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{p.campaignId?.title || 'Unknown Campaign'}</h3>
                      {hasOpenDispute && (
                        <p className="mt-1 text-[11px] inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 px-2 py-0.5 border border-rose-100">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Dispute open on this campaign
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${p.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        p.status === "accepted" ? "bg-emerald-100 text-emerald-800" :
                          "bg-rose-100 text-rose-800"
                      }`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </div>
                );
              })()}
              {p.campaignId?.brand_id && (
                <div className="mb-2 text-sm text-indigo-600">
                  <span className="text-gray-500">By: </span>
                  <a href={`/profile/brand/id/${p.campaignId.brand_id._id || p.campaignId.brand_id}`} className="hover:underline font-medium">
                    {p.campaignId.brand_id.company_name || p.campaignId.brand_id.name || 'Brand'}
                  </a>
                </div>
              )}
              <p className="text-sm text-slate-500 mb-2 line-clamp-2">{p.message}</p>
              <div className="text-sm text-slate-600 space-y-1">
                <div><strong>Amount:</strong> $ {p.amount}</div>
                <div><strong>Delivery:</strong> {p.deliveryTime}</div>
                <div><strong>Submitted:</strong> {new Date(p.createdAt).toLocaleDateString()}</div>
              </div>

              {/* Open Chat Button - Only for Accepted Proposals */}
              {p.status === 'accepted' && (
                <button
                  onClick={() => handleOpenChat(p)}
                  className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Open Chat
                </button>
              )}

              {/* View Dispute Button - when there is an open dispute on this campaign */}
              {(() => {
                const campaignId = p.campaignId?._id || p.campaignId;
                const dispute = campaignId ? disputesByCampaign[campaignId] : null;
                if (!dispute) return null;
                return (
                  <button
                    onClick={() => handleOpenDispute(p)}
                    className="mt-2 w-full px-4 py-2 border border-rose-200 text-rose-700 rounded-lg hover:bg-rose-50 transition-colors font-medium text-sm"
                  >
                    View dispute conversation
                  </button>
                );
              })()}

              {/* Leave Review button: only when campaign completed and reviewEnabled */}
              {p.status === 'accepted' &&
                p.campaignId?.status === 'completed' &&
                p.campaignId?.reviewEnabled && (
                  <button
                    onClick={() => openReview(p)}
                    className="mt-2 w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm"
                  >
                    Leave Review
                  </button>
              )}
            </div>
          ))}
        </div>
      )}

      {reviewTarget && (
        <ReviewModal
          isOpen={true}
          onClose={closeReview}
          campaignId={reviewTarget.campaignId}
          toUserId={reviewTarget.toUserId}
          campaignTitle={reviewTarget.proposal?.campaignId?.title}
          targetName={reviewTarget.proposal?.campaignId?.brand_id?.company_name || reviewTarget.proposal?.campaignId?.brand_id?.name}
        />
      )}
    </div>
  );
}