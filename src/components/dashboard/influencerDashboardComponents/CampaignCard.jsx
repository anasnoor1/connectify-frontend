// import StatusBadge from "./StatusBadge";

// // export default function CampaignCard({ campaign, onOpenChat, onOpenProposal, onView }) {
// //   const brandName = campaign.brand_id?.name || campaign.brand || "Unknown Brand";
// //   const budgetDisplay = campaign.budget ? `$ ${campaign.budget.toLocaleString()}` : "-";

// //   return (
// //     <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
// //       <div className="md:flex">
// //         <div className="md:w-40 w-full h-36 md:h-auto overflow-hidden">
// //           {/* image placeholder */}
// //           <div className="w-full h-full bg-gradient-to-r from-indigo-50 to-violet-50 flex items-center justify-center">
// //             <img
// //               src={campaign.image}
// //               alt={campaign.name}
// //               className="object-cover w-full h-full"
// //               onError={(e) => {
// //                 e.currentTarget.src = "https://via.placeholder.com/400x300?text=Campaign";
// //               }}
// //             />
// //           </div>
// //         </div>

// //         <div className="p-4 flex-1">
// //           <div className="flex items-start justify-between gap-3">
// //             <div>
// //               <h3 className="text-lg font-semibold text-slate-900">{campaign.title || campaign.name}</h3>
// //               <p className="text-sm text-slate-500">{brandName}</p>

// //               <p className="text-xs text-indigo-600 font-medium mt-1">
// //                 {campaign.category}
// //               </p>

// //             </div>
// //             <div className="flex flex-col items-end gap-2">
// //               <StatusBadge status={campaign.status} />
// //               <div className="text-right">
// //                 <div className="text-xs text-slate-500">Budget</div>
// //                 <div className="text-sm font-semibold">{budgetDisplay}</div>

// //               </div>
// //             </div>
// //           </div>

// //           <p className="mt-3 text-sm text-slate-600 line-clamp-2">{campaign.description}</p>

// //           <div className="mt-4 flex items-center justify-between gap-3">
// //             <div className="flex items-center gap-4 text-xs text-slate-500">
// //               {/* <div>Start: <span className="text-slate-700 ml-1">{campaign.start}</span></div>
// //               <div>End: <span className="text-slate-700 ml-1">{campaign.end}</span></div> */}
// //             </div>

// //             <div className="flex items-center gap-2">
// //               <button
// //                 onClick={() => onOpenChat(campaign.id)}
// //                 className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm shadow-sm hover:scale-[1.01] transition"
// //               >
// //                 Open Chat
// //               </button>

// //               {onView && (
// //                 <button
// //                   className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition"
// //                   onClick={() => onView(campaign)}
// //                 >
// //                   View
// //                 </button>
// //               )}

// //               <button
// //                 className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition"
// //                 onClick={() => {
// //                   console.log("SELECTED CAMPAIGN:", campaign);
// //                   onOpenProposal(campaign);
// //                 }}
// //               >
// //                 Propose
// //               </button>

// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// export default function CampaignCard({ campaign, onOpenChat, onOpenProposal, onOpenView, onOpenBrandProfile }) {
//   const brandName = campaign.brand_id?.name || campaign.brand || "Unknown Brand";
//   const budgetDisplay = campaign.budget ? `₨ ${campaign.budget.toLocaleString()}` : "-";

//   return (
//     <div
//       className="bg-white/90 rounded-2xl overflow-hidden border border-slate-100 shadow-sm backdrop-blur cursor-pointer hover:shadow-md transition-shadow"
//       onClick={() => {
//         if (onOpenBrandProfile) {
//           onOpenBrandProfile(campaign);
//         }
//       }}
//     >
//       <div className="md:flex">
//         <div className="md:w-40 w-full h-36 md:h-auto overflow-hidden">
//           <div className="w-full h-full bg-gradient-to-r from-indigo-50 to-violet-50 flex items-center justify-center">
//             {campaign.brand_avatar_url ? (
//               <img
//                 src={campaign.brand_avatar_url}
//                 alt={brandName}
//                 className="h-16 w-16 rounded-full object-cover border border-white shadow-sm"
//                 onError={(e) => {
//                   e.currentTarget.style.display = "none";
//                 }}
//               />
//             ) : (
//               <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600">
//                 {brandName?.charAt(0)?.toUpperCase() || "B"}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="p-4 flex-1">
//           <div className="flex items-start justify-between gap-3">
//             <div>
//               <h3 className="text-lg font-semibold text-slate-900">{campaign.title || campaign.name}</h3>
//               <p className="text-sm text-slate-500">{brandName}</p>

//               <p className="text-xs text-indigo-600 font-medium mt-1">
//                 {campaign.category}
//               </p>

//             </div>
//             <div className="flex flex-col items-end gap-2">
//               <StatusBadge status={campaign.status} />
//               <div className="text-right">
//                 <div className="text-xs text-slate-500">Budget</div>
//                 <div className="text-sm font-semibold">{budgetDisplay}</div>

//               </div>
//             </div>
//           </div>

//           <p className="mt-3 text-sm text-slate-600 line-clamp-2">{campaign.description}</p>

//           <div className="mt-4 flex items-center justify-between gap-3">
//             <div className="flex items-center gap-4 text-xs text-slate-500">
//               {/* <div>Start: <span className="text-slate-700 ml-1">{campaign.start}</span></div>
//               <div>End: <span className="text-slate-700 ml-1">{campaign.end}</span></div> */}
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onOpenChat(campaign._id);
//                 }}

//                 className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm shadow-sm hover:scale-[1.01] transition"
//               >
//                 Open Chat
//               </button>

//               <button
//                 className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   console.log("SELECTED CAMPAIGN:", campaign);
//                   onOpenProposal(campaign);
//                 }}
//               >
//                 Propose
//               </button>

//               {onOpenView && (campaign.status?.toLowerCase() === "active" || campaign.status?.toLowerCase() === "completed") && (
//                 <button
//                   className="px-3 py-2 rounded-lg text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onOpenView(campaign);
//                   }}
//                 >
//                   View
//                 </button>
//               )}

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//////////////////////////////////
import StatusBadge from "./StatusBadge";

export default function CampaignCard({ campaign, onOpenChat, onOpenProposal, onOpenView, onOpenBrandProfile }) {
  const brandName = campaign.brand_id?.name || campaign.brand || "Unknown Brand";
  const budgetDisplay = campaign.budget ? `₨ ${campaign.budget.toLocaleString()}` : "-";

  return (
    <div
      className="bg-white/90 rounded-2xl overflow-hidden border border-slate-100 shadow-sm backdrop-blur cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onOpenBrandProfile && onOpenBrandProfile(campaign)}
    >
      <div className="md:flex">
        {/* Brand Avatar / Image */}
        <div className="md:w-40 w-full h-36 md:h-auto overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-indigo-50 to-violet-50 flex items-center justify-center">
            {campaign.brand_avatar_url ? (
              <img
                src={campaign.brand_avatar_url}
                alt={brandName}
                className="h-16 w-16 rounded-full object-cover border border-white shadow-sm"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600">
                {brandName?.charAt(0)?.toUpperCase() || "B"}
              </div>
            )}
          </div>
        </div>

        {/* Campaign Details */}
        <div className="p-4 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{campaign.title || campaign.name}</h3>
              <p className="text-sm text-slate-500">{brandName}</p>
              <p className="text-xs text-indigo-600 font-medium mt-1">{campaign.category}</p>
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

          {/* Action Buttons */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenChat(campaign._id);
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm shadow-sm hover:scale-[1.01] transition"
              >
                Open Chat
              </button>

              <button
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProposal(campaign);
                }}
              >
                Propose
              </button>

              {onOpenView && (campaign.status?.toLowerCase() === "active" || campaign.status?.toLowerCase() === "completed") && (
                <button
                  className="px-3 py-2 rounded-lg text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenView(campaign);
                  }}
                >
                  View
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
