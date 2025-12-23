import React, { useState } from "react";
import axios from "../../utills/privateIntercept";
import { toast } from "react-toastify";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const unsignedPreset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;

export default function DisputeModal({ open, onClose, campaignId, onCreated }) {
  const [reason, setReason] = useState("quality");
  const [description, setDescription] = useState("");
  const [evidenceItems, setEvidenceItems] = useState([{ type: "link", url: "", caption: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  if (!open) return null;

  const updateEvidence = (idx, field, value) => {
    setEvidenceItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const addEvidenceRow = () => {
    setEvidenceItems((prev) => [...prev, { type: "link", url: "", caption: "" }]);
  };

  const removeEvidenceRow = (idx) => {
    setEvidenceItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleEvidenceFileUpload = async (idx, file, kind) => {
    if (!file) return;
    if (!cloudName || !unsignedPreset) {
      toast.error("Evidence upload is not configured");
      return;
    }

    try {
      setUploadingIndex(idx);
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", unsignedPreset);

      const resourceType = kind === "video" ? "video" : "image";
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: "POST",
        body: form,
      });

      const json = await res.json();
      if (!res.ok || !json.secure_url) {
        throw new Error(json.error?.message || "Upload failed");
      }

      setEvidenceItems((prev) => {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          type: kind,
          url: json.secure_url,
        };
        return copy;
      });

      toast.success(kind === "video" ? "Video uploaded" : "Image uploaded");
    } catch (err) {
      console.error("Evidence upload error:", err);
      toast.error(err.message || "Failed to upload evidence");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!campaignId) return;
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    const filteredEvidence = evidenceItems
      .filter((e) => (e.url && e.url.trim()) || (e.text && e.text.trim()))
      .map((e) => ({
        type: e.type || (e.url ? "link" : "text"),
        url: e.url?.trim(),
        text: e.text?.trim(),
        caption: e.caption?.trim(),
      }));

    try {
      setSubmitting(true);
      const res = await axios.post("/api/disputes", {
        campaignId,
        reason,
        description,
        evidence: filteredEvidence,
      });
      toast.success("Dispute submitted");
      onCreated && onCreated(res.data?.data);
      onClose();
      setDescription("");
      setEvidenceItems([{ type: "link", url: "", caption: "" }]);
    } catch (err) {
      console.error("Failed to submit dispute:", err?.response || err);
      const msg = err?.response?.data?.message || "Failed to submit dispute";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Raise a Dispute</h3>
            <p className="text-sm text-gray-500">Describe the issue and attach evidence.</p>
          </div>
          <button
            className="text-gray-500 hover:text-gray-800 rounded-full p-2"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Reason</label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="quality">Quality issue</option>
              <option value="delay">Delay</option>
              <option value="payment">Payment</option>
              <option value="fraud">Fraud / Not delivered</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Description</label>
            <textarea
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]"
              placeholder="Explain what happened, expected outcome, and key details."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Evidence (screenshots, files, links)</p>
                <p className="text-xs text-gray-500">
                  You can paste links or text notes, and upload photos/videos via Cloudinary.
                </p>
              </div>
              <button
                type="button"
                onClick={addEvidenceRow}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {evidenceItems.map((ev, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 p-3 bg-slate-50/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <select
                      className="w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      value={ev.type}
                      onChange={(e) => updateEvidence(idx, "type", e.target.value)}
                    >
                      <option value="link">Link</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="text">Text</option>
                    </select>
                    <input
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder={ev.type === "text" ? "Text note" : "https://example.com/proof or uploaded URL"}
                      value={ev.type === "text" ? ev.text || "" : ev.url || ""}
                      onChange={(e) => updateEvidence(idx, ev.type === "text" ? "text" : "url", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeEvidenceRow(idx)}
                      className="text-xs text-rose-600 hover:text-rose-700 px-2"
                    >
                      Remove
                    </button>
                  </div>
                  {(ev.type === "image" || ev.type === "video") && (
                    <div className="flex items-center gap-2 text-[11px] text-slate-600">
                      <label className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                        <span>Upload {ev.type === "video" ? "video" : "image"}</span>
                        <input
                          type="file"
                          accept={ev.type === "video" ? "video/*" : "image/*"}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file) {
                              handleEvidenceFileUpload(idx, file, ev.type);
                            }
                            e.target.value = "";
                          }}
                        />
                      </label>
                      {uploadingIndex === idx && (
                        <span className="text-[11px] text-slate-500">Uploading...</span>
                      )}
                    </div>
                  )}
                  <input
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Caption (optional)"
                    value={ev.caption || ""}
                    onChange={(e) => updateEvidence(idx, "caption", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-gray-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Dispute"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
