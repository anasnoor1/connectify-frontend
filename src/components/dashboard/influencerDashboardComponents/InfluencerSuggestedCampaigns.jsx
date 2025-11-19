import { useEffect, useState } from "react";
import axiosInstance from "../../../utills/privateIntercept";
import CampaignCard from "./CampaignCard";

export default function InfluencerSuggestedCampaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

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
            <h2 className="text-xl font-semibold mb-4">Suggested Campaigns</h2>

            {campaigns.length === 0 ? (
                <div className="text-gray-500">No suggested campaigns.</div>
            ) : (
                // <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                //   {campaigns.map((c) => (
                //     <CampaignCard key={c._id} campaign={c} />
                //   ))}
                // </div>
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    {campaigns.map((c) => (
                        <CampaignCard
                            key={c._id}
                            campaign={c}
                            onOpenProposal={() => console.log("Open proposal for:", c)}
                        />
                    ))}
                </div>

            )}
        </div>
    );
}
