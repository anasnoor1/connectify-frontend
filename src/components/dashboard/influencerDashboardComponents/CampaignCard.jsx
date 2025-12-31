import StatusBadge from "./StatusBadge";
import { AlertCircle } from "lucide-react";

export default function CampaignCard({ campaign, onOpenProposal, onOpenView, onOpenBrandProfile, onChatNow, onMarkComplete }) {
  const brandName = campaign.brand_id?.name || campaign.brand || "Unknown Brand";
  let budgetDisplay = "-";
  if (campaign.budget) {
    budgetDisplay = `$ ${campaign.budget.toLocaleString()}`;
  } else if (campaign.budgetMin !== undefined && campaign.budgetMax !== undefined) {
    budgetDisplay = `$ ${campaign.budgetMin.toLocaleString()} - $ ${campaign.budgetMax.toLocaleString()}`;
  }
  const brandInitial = brandName?.charAt(0)?.toUpperCase() || "B";
  const deadlineText = (() => {
    const deadline = campaign.requirements?.deadline || campaign.deadline;
    if (deadline) {
      const deadlineDate = new Date(deadline);

      if (!Number.isNaN(deadlineDate.getTime())) {
        const today = new Date();
        deadlineDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return "Deadline passed";
        if (diffDays === 0) return "Due today";
        return `${diffDays} day${diffDays === 1 ? "" : "s"} left`;
      }
    }
    return campaign.duration || campaign.timeline || "Not specified";
  })();

  const statusValue = campaign.status ? String(campaign.status).toLowerCase() : "";
  const isClosed = ["completed", "cancelled", "disputed"].includes(statusValue);
  const isFull = !!campaign.isFull;
  const canSubmitProposal = statusValue === "active" && !isClosed && !isFull;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
      {/* Header with Status Badge */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4 flex justify-between items-center">

        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
          <span className="text-sm font-medium text-indigo-900">{campaign.category || 'Campaign'}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={campaign.status} />
          {campaign.status?.toLowerCase() === "disputed" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 text-[11px] px-2 py-0.5 border border-rose-100">
              <AlertCircle className="w-3 h-3" />
              Dispute open
            </span>
          )}
        </div>
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

          {/* Deadline / Duration */}
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium text-blue-700">Deadline</span>
            </div>
            <p className="text-base font-bold text-blue-900">
              {deadlineText}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {campaign.proposal_status === 'accepted' ? (
            // Accepted proposal → primary Chat Now
            <button
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onChatNow && onChatNow(campaign);
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chat Now
            </button>
          ) : campaign.proposal_status === 'pending' ? (
            // Proposal already sent → show Pending
            <button
              className="flex-1 px-4 py-2.5 bg-yellow-500 text-white rounded-xl text-sm font-semibold cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              Pending
            </button>
          ) : (
            // No proposal yet → allow both Open Chat and Submit Proposal
            <>
              <button
                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onChatNow && onChatNow(campaign);
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Open Chat
              </button>

              <button
                disabled={!canSubmitProposal}
                className={`flex-1 px-4 py-2.5 border-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  canSubmitProposal
                    ? "border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                    : "border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!canSubmitProposal) return;
                  onOpenProposal(campaign);
                }}
              >
                {isFull ? "Campaign Full" : isClosed || statusValue !== "active" ? "Campaign Closed" : "Submit Proposal"}
              </button>
            </>
          )}

          {onOpenView && ["active", "completed", "disputed"].includes(campaign.status?.toLowerCase()) && (
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

          {onMarkComplete && campaign.status?.toLowerCase() === "active" && !campaign.influencerCompleted && (
            <button
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onMarkComplete(campaign);
              }}
            >
              Mark Complete
            </button>
          )}

          {campaign.influencerCompleted && (
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              You marked this complete
            </span>
          )}
        </div>
      </div>
    </div>
  );
}