import React from "react";

function SkeletonCard({ type = "feed" }) {
  if (type === "profile") {
    return (
      <div className="skeleton-card skeleton-card--profile">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start" }}>
          
          {/* Avatar circle placeholder */}
          <div className="skeleton-element skeleton-avatar skeleton-avatar--profile skeleton-shimmer" style={{ borderRadius: "50% !important" }} />
          
          {/* Identity/Bio block */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, minWidth: "200px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <div className="skeleton-element skeleton-title skeleton-shimmer" style={{ width: "150px", height: "32px" }} />
              <div className="skeleton-element skeleton-badge skeleton-shimmer" style={{ width: "100px" }} />
            </div>
            <div className="skeleton-element skeleton-line skeleton-shimmer" style={{ width: "90%" }} />
            <div className="skeleton-element skeleton-line skeleton-shimmer" style={{ width: "70%" }} />
          </div>
          
          {/* Actions */}
          <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
            <div className="skeleton-element skeleton-btn skeleton-shimmer" style={{ width: "120px" }} />
            <div className="skeleton-element skeleton-btn skeleton-shimmer" style={{ width: "100px" }} />
          </div>

        </div>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px", borderTop: "2px solid #000000", paddingTop: "16px" }}>
          <div className="skeleton-element skeleton-badge skeleton-shimmer" style={{ width: "110px", height: "36px" }} />
          <div className="skeleton-element skeleton-badge skeleton-shimmer" style={{ width: "110px", height: "36px" }} />
          <div className="skeleton-element skeleton-badge skeleton-shimmer" style={{ width: "110px", height: "36px" }} />
        </div>
      </div>
    );
  }

  if (type === "notification") {
    return (
      <div className="skeleton-card" style={{ flexDirection: "row", alignItems: "center", gap: "16px", padding: "16px" }}>
        
        {/* Circle avatar placeholder */}
        <div className="skeleton-element skeleton-avatar skeleton-shimmer" style={{ width: "40px", height: "40px", borderRadius: "50% !important" }} />
        
        {/* Message body */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          <div className="skeleton-element skeleton-line skeleton-shimmer" style={{ width: "75%" }} />
          <div className="skeleton-element skeleton-line skeleton-shimmer" style={{ width: "25%", height: "12px" }} />
        </div>
        
        {/* Status Badge */}
        <div className="skeleton-element skeleton-badge skeleton-shimmer" style={{ width: "60px", height: "24px" }} />

      </div>
    );
  }

  if (type === "bookmark" || type === "search-result" || type === "idea") {
    return (
      <div className="skeleton-card">
        {/* Title */}
        <div className="skeleton-element skeleton-title skeleton-shimmer" style={{ width: "50%" }} />
        
        {/* Description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
          <div className="skeleton-element skeleton-line skeleton-shimmer" />
          <div className="skeleton-element skeleton-line skeleton-shimmer" style={{ width: "75%" }} />
        </div>
        
        {/* Footer actions badge */}
        <div className="skeleton-element skeleton-badge skeleton-shimmer" style={{ width: "60px", marginTop: "12px" }} />
      </div>
    );
  }

  // Default type: "feed"
  return (
    <div className="skeleton-card">
      
      {/* Header (Avatar and meta) */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div className="skeleton-element skeleton-avatar skeleton-shimmer" />
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          <div className="skeleton-element skeleton-line skeleton-shimmer" style={{ width: "35%" }} />
          <div className="skeleton-element skeleton-line skeleton-shimmer" style={{ width: "15%" }} />
        </div>
        
        <div className="skeleton-element skeleton-badge skeleton-shimmer" style={{ width: "70px" }} />
      </div>

      {/* Title */}
      <div className="skeleton-element skeleton-title skeleton-shimmer" style={{ width: "65%", height: "28px", marginTop: "8px" }} />

      {/* Description */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="skeleton-element skeleton-line skeleton-shimmer" />
        <div className="skeleton-element skeleton-line skeleton-shimmer" style={{ width: "85%" }} />
      </div>

      {/* Tags */}
      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <div className="skeleton-element skeleton-badge skeleton-shimmer" />
        <div className="skeleton-element skeleton-badge skeleton-shimmer" />
      </div>

      {/* Actions Footer */}
      <div 
        style={{ 
          display: "flex", 
          gap: "10px", 
          marginTop: "12px", 
          borderTop: "1px solid rgba(0,0,0,0.08)", 
          paddingTop: "12px",
          alignItems: "center"
        }}
      >
        <div className="skeleton-element skeleton-btn skeleton-shimmer" style={{ width: "46px", height: "40px" }} />
        <div className="skeleton-element skeleton-btn skeleton-shimmer" style={{ width: "46px", height: "40px" }} />
        <div className="skeleton-element skeleton-btn skeleton-shimmer" style={{ width: "80px", height: "40px" }} />
        <div className="skeleton-element skeleton-btn skeleton-shimmer" style={{ width: "70px", height: "40px" }} />
      </div>

    </div>
  );
}

export default SkeletonCard;
