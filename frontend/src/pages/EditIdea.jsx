import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import SkeletonCard from "../components/SkeletonCard";

function EditIdea() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [status, setStatus] = useState("concept");
    const [isPublic, setIsPublic] = useState(true);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let isActive = true;

        async function fetchIdeaDetails() {
            try {
                // Fetch using authenticated /ideas/{id} endpoint
                const response = await api.get(`/ideas/${id}`);
                if (isActive) {
                    const idea = response.data;
                    setTitle(idea.title);
                    setDescription(idea.description);
                    setStatus(idea.status || "concept");
                    setIsPublic(idea.is_public);
                    
                    if (idea.tags && Array.isArray(idea.tags)) {
                        setTagsInput(idea.tags.map((t) => t.name).join(", "));
                    }
                }
            } catch (error) {
                console.error("Error loading idea for editing:", error);
                alert("Unauthorized or unable to load idea for editing.");
                navigate("/dashboard");
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        }

        fetchIdeaDetails();

        return () => {
            isActive = false;
        };
    }, [id, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);

        try {
            const tagsArray = tagsInput
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag !== "");

            await api.put(`/ideas/${id}`, {
                title,
                description,
                is_public: isPublic,
                tags: tagsArray,
                status: status
            });

            alert("Idea updated successfully!");
            navigate(`/ideas/${id}`);
        } catch (error) {
            console.error("Error updating idea:", error);
            alert("Failed to update idea. Please check your inputs.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <AppLayout>
                <section className="page__header">
                    <p className="page__eyebrow">Editor</p>
                    <h1>Edit Idea</h1>
                    <p className="page__lead muted">Loading existing details...</p>
                </section>
                <div style={{ marginTop: 20 }}>
                    <SkeletonCard type="feed" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <section className="page__header">
                <p className="page__eyebrow">Editor</p>
                <h1>Edit Idea</h1>
                <p className="page__lead muted">Modify and publish updates to your idea entry.</p>
            </section>

            <div className="card">
                <form onSubmit={handleSubmit} className="form">
                    
                    {/* Title */}
                    <div className="form__field">
                        <label className="form__label" htmlFor="idea-title">
                            Title
                        </label>
                        <input
                            id="idea-title"
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form__field">
                        <label className="form__label" htmlFor="idea-description">
                            Description
                        </label>
                        <textarea
                            id="idea-description"
                            placeholder="Describe your idea..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="textarea"
                            required
                        />
                    </div>

                    {/* Tags */}
                    <div className="form__field">
                        <label className="form__label" htmlFor="idea-tags">
                            Tags (comma separated)
                        </label>
                        <input
                            id="idea-tags"
                            type="text"
                            placeholder="AI, Startup, Education"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            className="input"
                        />
                    </div>

                    {/* Status */}
                    <div className="form__field">
                        <label className="form__label" htmlFor="idea-status">
                            Status
                        </label>
                        <select
                            id="idea-status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="input"
                            style={{ background: "#ffffff", cursor: "pointer" }}
                        >
                            <option value="concept">💡 Concept</option>
                            <option value="building">🛠 Building</option>
                            <option value="launched">🚀 Launched</option>
                            <option value="growing">📈 Growing</option>
                            <option value="archived">📦 Archived</option>
                        </select>
                    </div>

                    {/* Visibility */}
                    <div className="form__field">
                        <label className="form__label" htmlFor="idea-visibility">
                            Visibility
                        </label>
                        <select
                            id="idea-visibility"
                            value={isPublic ? "public" : "private"}
                            onChange={(e) => setIsPublic(e.target.value === "public")}
                            className="input"
                            style={{ background: "#ffffff", cursor: "pointer" }}
                        >
                            <option value="public">🌐 Public (Visible in Feed)</option>
                            <option value="private">🔒 Private (Only Visible to Me)</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                        <button 
                            type="submit" 
                            className="button button--primary" 
                            disabled={saving}
                        >
                            {saving ? "Saving Changes..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/ideas/${id}`)}
                            className="button button--ghost"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}

export default EditIdea;
