import React from "react";

function EmptyState({ icon, title, description }) {
  return (
    <div 
      className="card" 
      style={{ 
        textAlign: "center", 
        padding: "48px 24px", 
        background: "#fef9c3", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        gap: "12px",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <span 
        style={{ 
          fontSize: "3.5rem", 
          lineHeight: "1",
          userSelect: "none"
        }} 
        role="img" 
        aria-label="empty state icon"
      >
        {icon}
      </span>
      <h3 style={{ margin: 0, fontWeight: "900", fontSize: "1.5rem" }}>
        {title}
      </h3>
      <p 
        className="muted" 
        style={{ 
          margin: 0, 
          maxWidth: "44ch", 
          fontSize: "1.05rem",
          lineHeight: "1.5"
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default EmptyState;
