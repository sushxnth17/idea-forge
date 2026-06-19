import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function TreeNode({ node, isLast, level, prefix }) {
  const isRoot = level === 0;

  // Calculate branch connectors and the prefix passed to children
  const connector = isRoot ? "" : isLast ? "└── " : "├── ";
  const nextPrefix = isRoot ? "" : prefix + (isLast ? "    " : "│   ");

  return (
    <div style={{ display: "flex", flexDirection: "column", fontFamily: "var(--font-mono), monospace", fontSize: "0.95rem" }}>
      
      {/* Node Row */}
      <div 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          minHeight: "40px", 
          whiteSpace: "pre",
          color: "#000000"
        }}
      >
        {/* Branch Lines Prefix */}
        <span style={{ color: "var(--text-muted)", fontWeight: "bold" }}>
          {prefix}{connector}
        </span>

        {/* Clickable Title */}
        <Link 
          to={`/ideas/${node.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "6px 14px",
            border: isRoot ? "2px solid #000000" : "1.5px solid #000000",
            borderRadius: "8px",
            background: isRoot ? "#ff7a00" : "#ffffff",
            color: "#000000",
            fontWeight: "800",
            textDecoration: "none",
            transform: "translate(0, 0)",
            transition: "transform 100ms ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(-2px, -2px)";
            e.currentTarget.style.boxShadow = "2px 2px 0px #000000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translate(0, 0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {isRoot ? "🌟 " : "🔁 "}
          {node.title}
        </Link>
      </div>

      {/* Recursive rendering of children */}
      {node.children && node.children.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {node.children.map((child, index) => (
            <TreeNode 
              key={child.id}
              node={child}
              isLast={index === node.children.length - 1}
              level={level + 1}
              prefix={nextPrefix}
            />
          ))}
        </div>
      )}

    </div>
  );
}

function RemixTree({ ideaId }) {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function fetchTree() {
      setLoading(true);
      setError(false);
      try {
        const response = await api.get(`/ideas/${ideaId}/remix-tree`);
        if (isActive) {
          setTreeData(response.data);
        }
      } catch (err) {
        console.error("Error fetching remix tree:", err);
        if (isActive) {
          setError(true);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchTree();

    return () => {
      isActive = false;
    };
  }, [ideaId]);

  if (loading) {
    return (
      <div className="card" style={{ padding: "28px" }}>
        <h3 style={{ marginBottom: "12px" }}>Remix Tree</h3>
        <p className="muted">Loading remix tree...</p>
      </div>
    );
  }

  if (error || !treeData) {
    return (
      <div className="card" style={{ padding: "28px" }}>
        <h3 style={{ marginBottom: "12px" }}>Remix Tree</h3>
        <p className="muted">Unable to load remix tree visualization.</p>
      </div>
    );
  }

  const hasChildren = treeData.children && treeData.children.length > 0;

  return (
    <div className="card" style={{ padding: "28px" }}>
      <h3 style={{ marginBottom: "20px" }}>Remix Tree</h3>
      
      {hasChildren ? (
        <div style={{ display: "flex", flexDirection: "column", overflowX: "auto", padding: "8px 0" }}>
          <TreeNode 
            node={treeData}
            isLast={true}
            level={0}
            prefix=""
          />
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <p className="muted" style={{ fontWeight: "800", fontSize: "1.1rem" }}>No remixes yet.</p>
          <p className="muted" style={{ fontSize: "0.9rem", marginTop: "4px" }}>Be the first to remix this idea and start a new branch!</p>
        </div>
      )}
    </div>
  );
}

export default RemixTree;
