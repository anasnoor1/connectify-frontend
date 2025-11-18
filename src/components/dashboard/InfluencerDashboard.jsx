import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../utills/privateIntercept";
import Loader from "../../utills/loader";
import ProposalModal from "./influencerDashboardComponents/proposalModal";


import { NavLink, useNavigate } from "react-router-dom";


function StatusBadge({ status }) {
  const value = status ? status.toLowerCase() : "";
  const map = {
    active: "bg-emerald-100 text-emerald-800",
    pending: "bg-yellow-100 text-yellow-800",
    draft: "bg-gray-100 text-gray-800",
    completed: "bg-slate-100 text-slate-800",
    rejected: "bg-rose-100 text-rose-800",
    cancelled: "bg-rose-100 text-rose-800",
  };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${map[value] || "bg-gray-100 text-gray-800"}`}>
      {status || "Unknown"}
    </span>
  );
}

function CampaignCard({ campaign, onOpenChat, onOpenProposal }) {
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
                // onClick={() => onOpenProposal(campaign)}
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

export default function InfluencerDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openProposal, setOpenProposal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  function openProposalModal(campaign) {
    setSelectedCampaign(campaign);
    setOpenProposal(true);
  }


  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get("/api/campaigns");
        console.log("Compaigns : ",res.data.campaigns);
        setCampaigns(res.data.data.campaigns || []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };   

    fetchCampaigns();
  }, []);

//   useEffect(() => {
//   const fetchCampaigns = async () => {
//     try {
//       setLoading(true);

//       const res = await axiosInstance.get("/api/campaigns");

//       // Map campaigns to include brand name directly
//       const campaignsWithBrand = (res.data.data.campaigns || []).map(c => ({
//         ...c,
//         brand: c.brand_id?.name || "Unknown Brand", // <- brand name
//         brandEmail: c.brand_id?.email || "",        // optional
//       }));

//       setCampaigns(campaignsWithBrand);
//     } catch (error) {
//       console.error("Error fetching campaigns:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchCampaigns();
// }, []);



  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  // const campaigns = useMemo(() => mockCampaigns, []);
  const filteredCampaigns = useMemo(() => {
    return campaigns
      ?.filter((c) => {
        const matchQuery =
          c.title?.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase()) ||
          c.category?.toLowerCase().includes(query.toLowerCase()) ||
          c.brand_id?.name?.toLowerCase().includes(query.toLowerCase());

        const matchStatus =
          status === "All" || c.status?.toLowerCase() === status.toLowerCase();

        return matchQuery && matchStatus;
      })
      ?.sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        return 0;
      });
  }, [campaigns, query, status, sortBy]);


  function openChat(campaignId) {
    // navigate to your chat route (replace with your route)
    navigate(`/chat/${campaignId}`);
  }
  if (loading) return <Loader />;

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
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
                {/* <NavLink to="/influencer/analytics" className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-gray-50">
                  Analytics
                </NavLink>
                <NavLink to="/influencer/messages" className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-gray-50">
                  Messages
                </NavLink>
                <NavLink to="/influencer/payments" className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-gray-50">
                  Earnings
                </NavLink>
                <NavLink to="/influencer/settings" className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-gray-50">
                  Settings
                </NavLink> */}
              </nav>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
              <h5 className="text-xs text-slate-500">Quick Stats</h5>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <div className="text-xs text-slate-500">Active</div>
                  <div className="font-semibold text-slate-900">2</div>
                </div>
                <div className="p-3 bg-violet-50 rounded-lg">
                  <div className="text-xs text-slate-500">Earnings</div>
                  <div className="font-semibold text-slate-900">₨ 240,000</div>
                </div>
              </div>
            </div>

            <div className="hidden md:block text-sm text-slate-500">
              <p className="mb-2">Tips</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Keep profile & media kit updated</li>
                <li>Respond to brands quickly</li>
                <li>Attach past campaign case studies</li>
              </ul>
            </div>
          </aside>

          {/* Main */}
          <section className="md:col-span-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Campaigns</h2>
                <p className="text-sm text-slate-500 mt-1">Explore and apply to brand opportunities</p>
              </div>

              <div className="flex items-center gap-3">
                {/* <button
                  onClick={() => navigate("/influencer/new-proposal")}
                  className="px-4 py-2 text-sm rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                >
                  Create Proposal
                </button> */}
                {/* <button
                  onClick={() => alert("Open filters modal")}
                  className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-sm"
                >
                  Filters
                </button> */}
              </div>
            </div>

            {/* Filters */}
            <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="flex-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search campaigns or brands..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
              >
                <option>All</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Completed</option>
                {/* <option>Draft</option> */}
              </select>

              {/* <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select> */}
            </div>

            {/* Campaign grid */}
            <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-2">
              {/* {filtered.length === 0 ? ( */}
              {filteredCampaigns.length === 0 ? (

                <div className="p-8 bg-white border border-gray-100 rounded-2xl text-center text-slate-500">
                  No campaigns found.
                </div>
              ) : (
                filteredCampaigns.map((c) => (

                  // <CampaignCard key={c.id} campaign={c} onOpenChat={openChat} />

                  <CampaignCard
                    key={c.id}
                    campaign={c}
                    onOpenChat={openChat}
                    onOpenProposal={openProposalModal}
                  />

                ))
              )}
            </div>

            {/* Pagination placeholder */}
            <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
              <div>Showing {filteredCampaigns.length} of {campaigns.length}
              </div>
              <div className="space-x-2">
                {/* <button className="px-3 py-1 rounded-md border border-gray-200">Prev</button>
                <button className="px-3 py-1 rounded-md border border-gray-200">Next</button> */}
              </div>
            </div>
          </section>
        </div>
      </div>
      {openProposal && (
        <ProposalModal
          isOpen={openProposal}
          onClose={() => setOpenProposal(false)}
          campaign={selectedCampaign}
        />
      )}

    </div>
  );
}