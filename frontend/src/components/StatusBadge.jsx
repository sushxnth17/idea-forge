import React from "react";

const statusConfig = {
  concept: { label: "💡 Concept" },
  building: { label: "🛠 Building" },
  launched: { label: "🚀 Launched" },
  growing: { label: "📈 Growing" },
  archived: { label: "📦 Archived" },
};

function StatusBadge({ status }) {
  const normalized = status ? status.toLowerCase() : "concept";
  const config = statusConfig[normalized] || statusConfig.concept;

  return (
    <span
      className={`badge status-badge--${normalized}`}
      style={{
        marginLeft: "8px",
        verticalAlign: "middle",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      {config.label}
    </span>
  );
}

export default StatusBadge;
