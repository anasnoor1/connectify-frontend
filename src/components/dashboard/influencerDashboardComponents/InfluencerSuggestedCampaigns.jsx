import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utills/privateIntercept";
import CampaignCard from "./CampaignCard";
import ProposalModal from "./proposalModal";



export default function InfluencerSuggestedCampaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isProposalOpen, setIsProposalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    const navigate = useNavigate();

    const openDetail = (campaign) => {
        setSelectedCampaign(campaign);
        setIsDetailOpen(true);
    };

    const closeDetail = () => {
        setIsDetailOpen(false);
        setSelectedCampaign(null);
    };

    const openProposal = (campaign) => {
        setSelectedCampaign(campaign);
        setIsProposalOpen(true);
    };

    const closeProposal = () => {
        setSelectedCampaign(null);
        setIsProposalOpen(false);
    };

    const handleViewBrandProfile = () => {
        if (!selectedCampaign) return;

        const rawName =
            selectedCampaign.brand_id?.name ||
            selectedCampaign.brand ||
            selectedCampaign.brandName ||
            selectedCampaign.brand_name;

        if (!rawName || typeof rawName !== "string") {
            return;
        }

        const slug = rawName
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/[\s_]+/g, "-");

        if (!slug) {
            return;
        }

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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={handleBack}
                    className="inline-flex items-center px-4 py-2 text-sm rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                    Back
                </button>
                <h2 className="text-xl font-semibold">Suggested Campaigns</h2>
            </div>

            {campaigns.length === 0 ? (
                <div className="text-gray-500">No suggested campaigns.</div>
            ) : (

                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    {campaigns.map((c) => (
                        <CampaignCard
                            key={c._id}
                            campaign={c}
                            // onOpenProposal={() => console.log("Open proposal for:", c)}
                            onOpenProposal={() => openProposal(c)}
                            onView={() => openDetail(c)}
                        />
                    ))}
                </div>

            )}

            {isDetailOpen && selectedCampaign && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
                    <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-xl max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold text-slate-900">
                            {selectedCampaign.title || selectedCampaign.name}
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            {selectedCampaign.description}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-3">
                            <div className="text-sm text-slate-600">
                                {selectedCampaign.category && (
                                    <span className="text-indigo-600 font-medium">
                                        {selectedCampaign.category}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-500">Budget:</span>
                                <span className="font-semibold">
                                    {selectedCampaign.budget
                                        ? `$ ${selectedCampaign.budget.toLocaleString()}`
                                        : "-"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleViewBrandProfile}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                            >
                                View Brand Profile
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    openProposal(selectedCampaign);
                                    setIsDetailOpen(false);
                                }}
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm"
                            >
                                Propose
                            </button>
                            <button
                                type="button"
                                onClick={closeDetail}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
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
    );
}
