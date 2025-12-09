import React, { useState } from "react";
import axiosInstance from "../../utills/privateIntercept";
import { toast } from "react-toastify";

export default function ReviewModal({
  isOpen,
  onClose,
  campaignId,
  toUserId,
  targetName,
  campaignTitle,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!campaignId || !toUserId) return;

    try {
      setSubmitting(true);
      await axiosInstance.post("/api/reviews", {
        campaignId,
        toUserId,
        rating: Number(rating),
        comment,
      });
      toast.success("Review submitted successfully");
      onClose(true);
    } catch (err) {
      console.error("Submit review error:", err?.response || err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        "Failed to submit review";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const closeWithoutRefresh = () => onClose(false);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Leave a review</h2>
        {campaignTitle && (
          <p className="text-xs text-slate-500 mb-1">Campaign: {campaignTitle}</p>
        )}
        {targetName && (
          <p className="text-xs text-slate-500 mb-3">For: {targetName}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating (15)
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
           >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Share your experience..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-3">
            <button
              type="button"
              onClick={closeWithoutRefresh}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
