import StatusBadge from "./StatusBadge";

export default function CampaignCard({ campaign, onOpenChat, onOpenProposal }) {
  const brandName = campaign.brand_id?.name || campaign.brand || "Unknown Brand";
  const budgetDisplay = campaign.budget ? `₨ ${campaign.budget.toLocaleString()}` : "-";

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
      <div className="md:flex">
        <div className="md:w-40 w-full h-36 md:h-auto overflow-hidden">
          {/* image placeholder */}
          <div className="w-full h-full bg-gradient-to-r from-indigo-50 to-violet-50 flex items-center justify-center">
            <img
              src={campaign.image}
              alt={campaign.name}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/400x300?text=Campaign";
              }}
            />
          </div>
        </div>

        <div className="p-4 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{campaign.title || campaign.name}</h3>
              <p className="text-sm text-slate-500">{brandName}</p>

              <p className="text-xs text-indigo-600 font-medium mt-1">
                {campaign.category}
              </p>

            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={campaign.status} />
              <div className="text-right">
                <div className="text-xs text-slate-500">Budget</div>
                <div className="text-sm font-semibold">{budgetDisplay}</div>

              </div>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-600 line-clamp-2">{campaign.description}</p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              {/* <div>Start: <span className="text-slate-700 ml-1">{campaign.start}</span></div>
              <div>End: <span className="text-slate-700 ml-1">{campaign.end}</span></div> */}
            </div>

            <div className="flex items-center gap-2">
              {/* <button
                onClick={() => onOpenChat(campaign.id)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm shadow-sm hover:scale-[1.01] transition"
              >
                Open Chat
              </button> */}

              <button
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition"
                onClick={() => {
                  console.log("SELECTED CAMPAIGN:", campaign);
                  onOpenProposal(campaign);
                }}

              >
                Propose
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}