import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utills/privateIntercept";
import { toast } from "react-toastify";
import { ArrowLeft, ShieldAlert, MessageCircle, Paperclip, Link as LinkIcon, Image as ImageIcon, Video, FileText } from "lucide-react";

const statusConfig = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-800 border-amber-200" },
  needs_info: { label: "Needs info", className: "bg-sky-100 text-sky-800 border-sky-200" },
  escalated: { label: "Escalated", className: "bg-rose-100 text-rose-800 border-rose-200" },
  resolved: { label: "Resolved", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  rejected: { label: "Rejected", className: "bg-gray-100 text-gray-700 border-gray-200" },
};

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const unsignedPreset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;

const decisionLabel = (decision) => {
  switch (decision) {
    case "refund_full":
      return "Refund full amount";
    case "refund_partial":
      return "Refund partial amount";
    case "release_funds":
      return "Release funds";
    case "redo_work":
      return "Redo work";
    case "reject":
      return "Reject dispute";
    default:
      return decision;
  }
};

function EvidenceIcon({ type }) {
  if (type === "image") return <ImageIcon className="w-4 h-4" />;
  if (type === "video") return <Video className="w-4 h-4" />;
  if (type === "text") return <FileText className="w-4 h-4" />;
  return <LinkIcon className="w-4 h-4" />;
}

export default function DisputeThread() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dispute, setDispute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const [evidenceType, setEvidenceType] = useState("link");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [evidenceText, setEvidenceText] = useState("");
  const [evidenceCaption, setEvidenceCaption] = useState("");
  const [addingEvidence, setAddingEvidence] = useState(false);
  const [uploadingEvidence, setUploadingEvidence] = useState(false);

  useEffect(() => {
    const fetchDispute = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/disputes/${id}`);
        setDispute(res.data?.data || null);
        setError("");
      } catch (err) {
        console.error("Failed to load dispute:", err?.response || err);
        const msg = err?.response?.data?.message || "Failed to load dispute";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchDispute();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    try {
      setSendingMessage(true);
      const res = await axios.post(`/api/disputes/${id}/messages`, {
        message: messageText.trim(),
      });
      setDispute(res.data?.data || null);
      setMessageText("");
    } catch (err) {
      console.error("Failed to send message:", err?.response || err);
      const msg = err?.response?.data?.message || "Failed to send message";
      toast.error(msg);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleAddEvidence = async (e) => {
    e.preventDefault();

    const hasUrl = evidenceUrl && evidenceUrl.trim();
    const hasText = evidenceText && evidenceText.trim();
    if (!hasUrl && !hasText) {
      toast.error("Provide a link or text for evidence");
      return;
    }

    try {
      setAddingEvidence(true);
      const payload = {
        type: evidenceType,
        url: hasUrl ? evidenceUrl.trim() : undefined,
        text: hasText ? evidenceText.trim() : undefined,
        caption: evidenceCaption.trim() || undefined,
      };
      const res = await axios.post(`/api/disputes/${id}/evidence`, payload);
      setDispute(res.data?.data || null);
      setEvidenceUrl("");
      setEvidenceText("");
      setEvidenceCaption("");
    } catch (err) {
      console.error("Failed to add evidence:", err?.response || err);
      const msg = err?.response?.data?.message || "Failed to add evidence";
      toast.error(msg);
    } finally {
      setAddingEvidence(false);
    }
  };

  const handleEvidenceFileUpload = async (file) => {
    if (!file) return;
    if (!cloudName || !unsignedPreset) {
      toast.error("Evidence upload is not configured");
      return;
    }

    try {
      setUploadingEvidence(true);
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", unsignedPreset);

      const isVideo = file.type?.startsWith("video/");
      const resourceType = isVideo ? "video" : "image";
      const kind = isVideo ? "video" : "image";

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: "POST",
        body: form,
      });

      const json = await res.json();
      if (!res.ok || !json.secure_url) {
        throw new Error(json.error?.message || "Upload failed");
      }

      setEvidenceType(kind);
      setEvidenceUrl(json.secure_url);
      toast.success(kind === "video" ? "Video uploaded" : "Image uploaded");
    } catch (err) {
      console.error("Evidence upload error:", err);
      toast.error(err.message || "Failed to upload evidence");
    } finally {
      setUploadingEvidence(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error || !dispute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Unable to load dispute</h2>
          </div>
          <p className="text-sm text-gray-600">{error || "This dispute may not exist or you may not have access."}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const statusMeta = statusConfig[dispute.status] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-7 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-rose-500 uppercase">Dispute</p>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                {dispute.campaignId?.title || "Campaign dispute"}
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl">
                Issue raised by {dispute.raisedBy?.name || "user"} against {dispute.against?.name || "counterparty"}.
                Use this thread to discuss and attach evidence. Admin will review everything and make a final decision.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${statusMeta.className}`}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                {statusMeta.label}
              </span>
              <p className="text-[11px] text-slate-400">
                Created {dispute.createdAt ? new Date(dispute.createdAt).toLocaleString() : ""}
              </p>
            </div>
          </div>

          {(dispute.status === "resolved" || dispute.status === "rejected") &&
            dispute.resolution?.decision && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">
                    Admin decision: {decisionLabel(dispute.resolution.decision)}
                  </span>
                  <span className="text-[10px] text-emerald-800/80">
                    {dispute.resolution.decidedAt
                      ? new Date(dispute.resolution.decidedAt).toLocaleString()
                      : ""}
                  </span>
                </div>
                {typeof dispute.resolution.amount === "number" && (
                  <p className="text-[11px]">
                    Amount: <span className="font-semibold">${dispute.resolution.amount.toLocaleString()}</span>
                  </p>
                )}
                {dispute.resolution.notes && (
                  <p className="text-[11px] whitespace-pre-wrap">{dispute.resolution.notes}</p>
                )}
              </div>
            )}

          {/* Layout: left evidence, right messages */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Evidence */}
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">Evidence</h2>
                  <span className="text-[11px] text-slate-500">{dispute.evidence?.length || 0} items</span>
                </div>

                {(!dispute.evidence || dispute.evidence.length === 0) && (
                  <p className="text-xs text-slate-500">No evidence added yet.</p>
                )}

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {dispute.evidence?.map((ev, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                    >
                      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-slate-700">
                        <EvidenceIcon type={ev.type} />
                      </span>
                      <div className="flex-1 space-y-1">
                        {ev.caption && <p className="font-medium text-slate-800">{ev.caption}</p>}
                        {ev.text && <p className="text-slate-700 whitespace-pre-wrap">{ev.text}</p>}
                        {ev.url && (
                          <a
                            href={ev.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 break-all"
                          >
                            <Paperclip className="w-3 h-3" />
                            <span>Open link</span>
                          </a>
                        )}
                        <p className="text-[10px] text-slate-400">
                          Added {ev.createdAt ? new Date(ev.createdAt).toLocaleString() : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add evidence form */}
              {dispute.status !== "resolved" && dispute.status !== "rejected" && (
                <form onSubmit={handleAddEvidence} className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-slate-500" />
                    <h3 className="text-sm font-semibold text-slate-900">Add evidence</h3>
                  </div>
                  <div className="flex gap-2 text-[11px] font-medium text-slate-600">
                    <button
                      type="button"
                      onClick={() => setEvidenceType("link")}
                      className={`px-2 py-1 rounded-full border ${
                        evidenceType === "link"
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      Link / file
                    </button>
                    <button
                      type="button"
                      onClick={() => setEvidenceType("text")}
                      className={`px-2 py-1 rounded-full border ${
                        evidenceType === "text"
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      Text note
                    </button>
                  </div>
                  {evidenceType !== "text" && (
                    <input
                      type="url"
                      value={evidenceUrl}
                      onChange={(e) => setEvidenceUrl(e.target.value)}
                      placeholder="https://example.com/image-or-file"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  )}
                  {evidenceType === "text" && (
                    <textarea
                      value={evidenceText}
                      onChange={(e) => setEvidenceText(e.target.value)}
                      placeholder="Write a short note describing the issue"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs min-h-[70px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  )}
                  <input
                    type="text"
                    value={evidenceCaption}
                    onChange={(e) => setEvidenceCaption(e.target.value)}
                    placeholder="Caption (optional)"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-600">
                    <span>Or upload photo / video evidence</span>
                    <label className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100">
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (file) {
                            handleEvidenceFileUpload(file);
                          }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  {uploadingEvidence && (
                    <p className="text-[11px] text-slate-500">Uploading evidence...</p>
                  )}
                  <button
                    type="submit"
                    disabled={addingEvidence || uploadingEvidence}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-black disabled:opacity-60"
                  >
                    <Paperclip className="w-3 h-3" />
                    {addingEvidence || uploadingEvidence ? "Adding..." : "Add evidence"}
                  </button>
                </form>
              )}
            </div>

            {/* Messages */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white flex flex-col">
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
                <MessageCircle className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-900">Conversation</h2>
              </div>
              <div className="flex-1 min-h-[220px] max-h-[420px] overflow-y-auto px-4 py-3 space-y-3 text-xs">
                {(!dispute.messages || dispute.messages.length === 0) && (
                  <p className="text-slate-400">No messages yet. Start the conversation below.</p>
                )}
                {dispute.messages?.map((m, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
                      <span className="text-[11px] font-medium text-slate-700">
                        {m.senderId === dispute.raisedBy?._id
                          ? dispute.raisedBy?.name || "Raised by"
                          : m.senderId === dispute.against?._id
                          ? dispute.against?.name || "Counterparty"
                          : "Admin"}
                      </span>
                      <span className="text-[9px] text-slate-400">
                        {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                      </span>
                    </div>
                    <div className="ml-4 text-slate-800 bg-slate-50 rounded-2xl px-3 py-2">
                      {m.message}
                    </div>
                  </div>
                ))}
              </div>

              {dispute.status !== "resolved" && dispute.status !== "rejected" && (
                <form onSubmit={handleSendMessage} className="border-t border-slate-100 px-3 py-2 flex items-end gap-2">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Write a message for the other party and admin..."
                    className="flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 max-h-32"
                    rows={2}
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !messageText.trim()}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                  >
                    <MessageCircle className="w-3 h-3" />
                    {sendingMessage ? "Sending..." : "Send"}
                  </button>
                </form>
              )}

              {(dispute.status === "resolved" || dispute.status === "rejected") && (
                <div className="border-t border-slate-100 px-4 py-3 bg-slate-50 text-[11px] text-slate-500">
                  This dispute is closed. You can still read the history, but new messages and evidence are disabled.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
