import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utills/privateIntercept";
import CampaignCard from "./CampaignCard";
import ProposalModal from "./proposalModal";

export default function InfluencerSuggestedCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const navigate = useNavigate();

  const openCampaignView = (campaign) => {
    if (!campaign) return;
    const campaignId = campaign._id || campaign.id;
    if (!campaignId) return;
    navigate(`/campaigns/${campaignId}`, { state: { campaign } });
  };

  const openProposal = (campaign) => {
    setSelectedCampaign(campaign);
    setIsProposalOpen(true);
  };

  const closeProposal = () => {
    setSelectedCampaign(null);
    setIsProposalOpen(false);
  };

  const handleViewBrandProfile = (campaign) => {
    if (!campaign) return;

    const brandId = typeof campaign.brand_id === 'object' ? campaign.brand_id._id : campaign.brand_id;

    if (brandId) {
      navigate(`/profile/brand/id/${brandId}`);
      return;
    }

    // Fallback to slug if ID is somehow missing
    const rawName =
      campaign.brand_id?.name ||
      campaign.brand ||
      campaign.brandName ||
      campaign.brand_name;

    if (!rawName || typeof rawName !== "string") return;

    const slug = rawName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_]+/g, "-");

    if (!slug) return;

    navigate(`/profile/brand/${slug}`);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/influencer/dashboard");
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axiosInstance.get("/api/campaigns/suggestions");
        setCampaigns(res.data.suggestions || []);
      } catch (error) {
        console.error("Error fetching suggested campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 text-sm rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <h2 className="text-2xl font-bold text-slate-900">
            Suggested Campaigns
          </h2>
        </div>

        {campaigns.length === 0 ? (
          <div className="p-8 bg-white border border-gray-100 rounded-2xl text-center text-slate-500">
            No suggested campaigns.
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {campaigns.map((c) => (
              <CampaignCard
                key={c._id}
                campaign={c}
                onOpenChat={(id) => {
                  console.log("Open chat for campaign:", id);
                  // navigate(`/chat/${id}`) if needed
                }}
                onOpenProposal={() => openProposal(c)}
                onOpenView={openCampaignView}
                onOpenBrandProfile={() => handleViewBrandProfile(c)}
              />
            ))}
          </div>
        )}

        {isProposalOpen && selectedCampaign && (
          <ProposalModal
            isOpen={isProposalOpen}
            onClose={closeProposal}
            campaign={selectedCampaign}
          />
        )}
      </div>
    </div>
  );
}