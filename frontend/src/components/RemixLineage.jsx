import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function RemixLineage({ parentIdeaId, currentIdea }) {
  const [parentIdea, setParentIdea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!parentIdeaId) {
      setParentIdea(null);
      return;
    }

    let isActive = true;

    async function fetchParent() {
      setLoading(true);
      setError(false);
      try {
        const response = await api.get(`/public/ideas/${parentIdeaId}`);
        if (isActive) {
          setParentIdea(response.data);
        }
      } catch (err) {
        console.error("Error fetching parent idea for lineage:", err);
        if (isActive) {
          setError(true);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchParent();

    return () => {
      isActive = false;
    };
  }, [parentIdeaId]);

  // If this idea is not a remix, hide the section entirely
  if (!parentIdeaId) {
    return null;
  }

  if (loading) {
    return (
      <div className="card panel" style={{ marginTop: "16px" }}>
        <h3 style={{ marginBottom: "8px" }}>Remix Lineage</h3>
        <p className="muted">Loading lineage details...</p>
      </div>
    );
  }

  if (error || !parentIdea) {
    return (
      <div className="card panel" style={{ marginTop: "16px" }}>
        <h3 style={{ marginBottom: "8px" }}>Remix Lineage</h3>
        <p className="muted">Parent idea details are private or unavailable.</p>
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <span className="badge badge--danger" style={{ alignSelf: "center" }}>⚠️ Unavailable</span>
          <div style={{ fontSize: "20px", textAlign: "center", fontWeight: "900" }}>↑</div>
          <Link
            to={`/ideas/${currentIdea.id}`}
            className="card card--interactive"
            style={{
              textAlign: "center",
              display: "block",
              textDecoration: "none",
              padding: "16px",
              background: "#ff7a00"
            }}
          >
            <div className="page__eyebrow" style={{ fontSize: "0.75rem", marginBottom: "4px", color: "#000000" }}>
              Current Idea
            </div>
            <strong style={{ fontSize: "1.05rem" }}>{currentIdea.title}</strong>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card panel" style={{ marginTop: "16px" }}>
      <h3 style={{ marginBottom: "16px" }}>Remix Lineage</h3>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        
        {/* Parent Idea (Original) */}
        <Link
          to={`/ideas/${parentIdea.id}`}
          className="card card--interactive"
          style={{
            width: "100%",
            textAlign: "center",
            textDecoration: "none",
            display: "block",
            padding: "16px",
            background: "#ffffff"
          }}
        >
          <div className="page__eyebrow" style={{ fontSize: "0.75rem", marginBottom: "4px" }}>
            Original Idea
          </div>
          <strong style={{ fontSize: "1.05rem", color: "#000000" }}>{parentIdea.title}</strong>
        </Link>

        {/* Up Arrow symbol indicating lineage */}
        <div
          style={{
            fontSize: "24px",
            fontWeight: "900",
            color: "#000000",
            lineHeight: "1",
            margin: "4px 0"
          }}
        >
          ↑
        </div>

        {/* Current Idea */}
        <Link
          to={`/ideas/${currentIdea.id}`}
          className="card card--interactive"
          style={{
            width: "100%",
            textAlign: "center",
            textDecoration: "none",
            display: "block",
            padding: "16px",
            background: "#ff7a00"
          }}
        >
          <div className="page__eyebrow" style={{ fontSize: "0.75rem", marginBottom: "4px", color: "#000000" }}>
            Current Idea
          </div>
          <strong style={{ fontSize: "1.05rem", color: "#000000" }}>{currentIdea.title}</strong>
        </Link>

      </div>
    </div>
  );
}

export default RemixLineage;
