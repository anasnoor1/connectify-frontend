import { useEffect, useState } from "react";
import axiosInstance from "../../../utills/privateIntercept";
import Loader from "../../../utills/loader";

export default function MyProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Loader />;

  if (proposals.length === 0)
    return <div className="text-center text-slate-500 mt-10">No proposals found.</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">My Proposals</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {proposals.map((p) => (
          <div key={p._id} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">{p.campaignName}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium 
                ${p.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                  p.status === "accepted" ? "bg-emerald-100 text-emerald-800" :
                  "bg-rose-100 text-rose-800"
                }`}>
                {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-2">{p.description}</p>
            <div className="text-sm text-slate-600">
              <div><strong>Amount:</strong> ₨ {p.amount}</div>
              <div><strong>Delivery:</strong> {p.deliveryTime}</div>
              <div><strong>Submitted:</strong> {new Date(p.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
