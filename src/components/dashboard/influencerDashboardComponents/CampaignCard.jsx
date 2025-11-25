
import StatusBadge from "./StatusBadge";

export default function CampaignCard({ campaign, onOpenProposal, onOpenView, onOpenBrandProfile }) {
  const brandName = campaign.brand_id?.name || campaign.brand || "Unknown Brand";
  let budgetDisplay = "-";
  if (campaign.budget) {
    budgetDisplay = `$ ${campaign.budget.toLocaleString()}`;
  } else if (campaign.budgetMin !== undefined && campaign.budgetMax !== undefined) {
    budgetDisplay = `$ ${campaign.budgetMin.toLocaleString()} - $ ${campaign.budgetMax.toLocaleString()}`;
  }
  const brandInitial = brandName?.charAt(0)?.toUpperCase() || "B";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
      {/* Header with Status Badge */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
          <span className="text-sm font-medium text-indigo-900">{campaign.category || 'Campaign'}</span>
        </div>
        <StatusBadge status={campaign.status} />
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Campaign Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2">
          {campaign.title || campaign.name}
        </h3>

        {/* Brand Info with Profile Picture */}
        <div
          className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onOpenBrandProfile && onOpenBrandProfile(campaign);
          }}
        >
          {/* Brand Avatar */}
          <div className="flex-shrink-0">
            {campaign.brand_avatar_url ? (
              <img
                src={campaign.brand_avatar_url}
                alt={brandName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-md ${campaign.brand_avatar_url ? 'hidden' : 'flex'}`}
            >
              {brandInitial}
            </div>
          </div>

          {/* Brand Name */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Brand</p>
            <p className="text-sm font-semibold text-slate-900 truncate">{brandName}</p>
          </div>
        </div>

        {/* Campaign Description */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {campaign.description}
        </p>

        {/* Important Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Budget */}
          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium text-emerald-700">Budget</span>
            </div>
            <p className="text-base font-bold text-emerald-900">{budgetDisplay}</p>
          </div>

          {/* Duration */}
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium text-blue-700">Duration</span>
            </div>
            <p className="text-base font-bold text-blue-900">
              {campaign.duration || campaign.timeline || '30 days'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {campaign.proposal_status === 'accepted' ? (
            <button
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              Accepted
            </button>
          ) : campaign.proposal_status === 'pending' ? (
            <button
              className="flex-1 px-4 py-2.5 bg-yellow-500 text-white rounded-xl text-sm font-semibold cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              Pending
            </button>
          ) : (
            <button
              className="flex-1 px-4 py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-xl text-sm font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onOpenProposal(campaign);
              }}
            >
              Submit Proposal
            </button>
          )}

          {onOpenView && (campaign.status?.toLowerCase() === "active" || campaign.status?.toLowerCase() === "completed") && (
            <button
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onOpenView(campaign);
              }}
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}