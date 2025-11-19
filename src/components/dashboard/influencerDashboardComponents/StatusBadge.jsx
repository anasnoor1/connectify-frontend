export default function StatusBadge({ status }) {
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
