import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

/**
 * Influencer Dashboard
 * - Tailwind-based
 * - Replace `mockCampaigns` with real API data (fetch in useEffect)
 * - Theme: indigo -> violet accents (from your provided screenshots)
 */

const mockCampaigns = [
  {
    id: "c1",
    name: "Summer Splash 2024",
    brand: "NexGen Apparel",
    start: "2024-07-25",
    end: "2024-08-31",
    budget: "₨ 500,000",
    status: "Active",
    image: "/images/campaign-hero-1.jpg", // replace or use remote url
    reach: "1.2M",
    conversions: "12%",
    description: "Short brief about the campaign & deliverables.",
  },
  {
    id: "c2",
    name: "New Product Launch - Q4",
    brand: "GlowTech",
    start: "2024-10-15",
    end: "2024-11-20",
    budget: "₨ 5,00,000",
    status: "Pending",
    image: "/images/campaign-hero-2.jpg",
    reach: "500k",
    conversions: "3.5%",
    description: "Unboxing + 60s reel + 2 posts.",
  },
  {
    id: "c3",
    name: "Winter Collection Drive",
    brand: "UrbanStreet",
    start: "2023-12-01",
    end: "2023-12-31",
    budget: "₨ 3,50,000",
    status: "Completed",
    image: "/images/campaign-hero-3.jpg",
    reach: "800k",
    conversions: "7%",
    description: "High-visibility campaign for winter collection.",
  },
];

function StatusBadge({ status }) {
  const map = {
    Active: "bg-emerald-100 text-emerald-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Draft: "bg-gray-100 text-gray-800",
    Completed: "bg-slate-100 text-slate-800",
    Rejected: "bg-rose-100 text-rose-800",
  };
  return <span className={`text-xs font-medium px-2 py-1 rounded-full ${map[status] || "bg-gray-100 text-gray-800"}`}>{status}</span>;
}

function CampaignCard({ campaign, onOpenChat }) {
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
              <h3 className="text-lg font-semibold text-slate-900">{campaign.name}</h3>
              <p className="text-sm text-slate-500">{campaign.brand}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={campaign.status} />
              <div className="text-right">
                <div className="text-xs text-slate-500">Budget</div>
                <div className="text-sm font-semibold">{campaign.budget}</div>
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-600 line-clamp-2">{campaign.description}</p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div>Start: <span className="text-slate-700 ml-1">{campaign.start}</span></div>
              <div>End: <span className="text-slate-700 ml-1">{campaign.end}</span></div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenChat(campaign.id)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm shadow-sm hover:scale-[1.01] transition"
              >
                Open Chat
              </button>

              <button
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition"
                onClick={() => alert("Open proposal composer (example)")}>
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
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const campaigns = useMemo(() => mockCampaigns, []);

  const filtered = useMemo(() => {
    return campaigns
      .filter((c) => {
        if (status !== "All" && c.status !== status) return false;
        if (!query) return true;
        return (
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.brand.toLowerCase().includes(query.toLowerCase())
        );
      })
      .sort((a, b) => {
        if (sortBy === "latest") return new Date(b.start) - new Date(a.start);
        if (sortBy === "oldest") return new Date(a.start) - new Date(b.start);
        return 0;
      });
  }, [campaigns, query, status, sortBy]);

  function openChat(campaignId) {
    // navigate to your chat route (replace with your route)
    navigate(`/chat/${campaignId}`);
  }

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
                <NavLink to="/influencer/analytics" className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-gray-50">
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
                </NavLink>
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
                <button
                  onClick={() => navigate("/influencer/new-proposal")}
                  className="px-4 py-2 text-sm rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                >
                  Create Proposal
                </button>
                <button
                  onClick={() => alert("Open filters modal")}
                  className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-sm"
                >
                  Filters
                </button>
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
                <option>Draft</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            {/* Campaign grid */}
            <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-2">
              {filtered.length === 0 ? (
                <div className="p-8 bg-white border border-gray-100 rounded-2xl text-center text-slate-500">
                  No campaigns found.
                </div>
              ) : (
                filtered.map((c) => (
                  <CampaignCard key={c.id} campaign={c} onOpenChat={openChat} />
                ))
              )}
            </div>

            {/* Pagination placeholder */}
            <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
              <div>Showing {filtered.length} of {campaigns.length}</div>
              <div className="space-x-2">
                <button className="px-3 py-1 rounded-md border border-gray-200">Prev</button>
                <button className="px-3 py-1 rounded-md border border-gray-200">Next</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
