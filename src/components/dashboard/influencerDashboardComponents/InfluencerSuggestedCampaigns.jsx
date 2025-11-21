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

    const openProposal = (campaign) => {
        setSelectedCampaign(campaign);
        setIsProposalOpen(true);
    };

    const closeProposal = () => {
        setSelectedCampaign(null);
        setIsProposalOpen(false);
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
    );
}
