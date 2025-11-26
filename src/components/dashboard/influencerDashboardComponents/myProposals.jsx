import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utills/privateIntercept";
import Loader from "../../../utills/loader";

export default function MyProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await axiosInstance.get("/api/proposals/my");
        setProposals(res.data.data.proposals || []);
      } catch (err) {
        console.error("Error fetching proposals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/influencer/dashboard");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          className="inline-flex items-center px-4 py-2 text-sm rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <h2 className="text-2xl font-bold text-slate-900">My Proposals</h2>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center text-slate-500 mt-10">No proposals found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {proposals.map((p) => (
            <div key={p._id} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">{p.campaignId?.title || 'Unknown Campaign'}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                  ${p.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    p.status === "accepted" ? "bg-emerald-100 text-emerald-800" :
                      "bg-rose-100 text-rose-800"
                  }`}>
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </span>
              </div>
              {p.campaignId?.brand_id && (
                <div className="mb-2 text-sm text-indigo-600">
                  <span className="text-gray-500">By: </span>
                  <a href={`/profile/brand/id/${p.campaignId.brand_id._id || p.campaignId.brand_id}`} className="hover:underline font-medium">
                    {p.campaignId.brand_id.company_name || p.campaignId.brand_id.name || 'Brand'}
                  </a>
                </div>
              )}
              <p className="text-sm text-slate-500 mb-2 line-clamp-2">{p.message}</p>
              <div className="text-sm text-slate-600 space-y-1">
                <div><strong>Amount:</strong> $ {p.amount}</div>
                <div><strong>Delivery:</strong> {p.deliveryTime}</div>
                <div><strong>Submitted:</strong> {new Date(p.createdAt).toLocaleDateString()}</div>
              </div>

              {/* Open Chat Button - Only for Accepted Proposals */}
              {p.status === 'accepted' && (
                <button
                  onClick={() => navigate(`/chats/${p.campaignId._id}`)}
                  className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Open Chat
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}