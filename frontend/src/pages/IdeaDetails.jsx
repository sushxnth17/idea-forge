import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import AppLayout from "../components/AppLayout";

function IdeaDetails() {

    const { id } = useParams();

    const [idea, setIdea] = useState(null);
    const [comment, setComment] = useState("");

    useEffect(() => {
        let isActive = true;

        async function loadIdea() {
            try {
                const response = await api.get(`/public/ideas/${id}`);

                if (isActive) {
                    setIdea(response.data);
                }
            } catch(error) {
                console.log(error);
            }
        }

        loadIdea();

        return () => {
            isActive = false;
        };
    }, [id]);

    async function fetchIdea() {

        try {

            const response = await api.get(
                `/public/ideas/${id}`
            );

            setIdea(response.data);

        } catch(error) {
            console.log(error);
        }
    }
    async function handleLike() {

    try {

        await api.post(
            `/ideas/${id}/like`
        );

        fetchIdea();

    } catch(error) {
        console.log(error);
    }
}
    async function handleBookmark() {

    try {

        await api.post(
            `/ideas/${id}/bookmark`
        );

        alert("Idea bookmarked!");

    } catch(error) {
        console.log(error);
    }
}
    async function handleRemix() {

    try {

        await api.post(
            `/ideas/${id}/remix`
        );

        alert("Idea remixed successfully!");

    } catch(error) {
        console.log(error);
    }
}

    async function handleComment(e) {

    e.preventDefault();

    try {

        await api.post(
            `/ideas/${id}/comments`,
            {
                content: comment
            }
        );

        setComment("");

        fetchIdea();

    } catch(error) {
        console.log(error);
    }
}

    if (!idea) {
        return (
            <AppLayout>
                <div className="loading-state">
                    <h2>Loading idea...</h2>
                    <p className="muted">Fetching the latest details from the backend.</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <article className="details-hero">
                <div className="details-hero__copy">
                    <p className="page__eyebrow">Idea details</p>
                    <h1 className="details-title">{idea.title}</h1>
                    <p className="details-description">{idea.description}</p>
                </div>

                <div className="details-hero__panel">
                    <div className="details-actions">
                        <button
                            type="button"
                            onClick={handleLike}
                            className="button button--primary"
                        >
                            ❤️ Like idea
                        </button>
                    <button
                        type="button"
                        onClick={handleRemix}
                        className="button"
                    >
                        🔁 Remix
                    </button>
                        <button
                            type="button"
                            onClick={handleBookmark}
                            className="button"
                        >
                            ⭐ Bookmark
                        </button>

                        <span className="badge">
                            Likes: {idea.likes_count}
                        </span>
                    </div>

                    <div>
                        <h3>Tags</h3>
                        <div className="details-tags">
                            {idea.tags.map((tag) => (
                                <span key={tag.id} className="tag-pill">
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </article>

            <section className="details-comments">
                <div className="card">
                    <h3>Leave a comment</h3>
                    <form onSubmit={handleComment} className="form">
                        <input
                            type="text"
                            placeholder="Write a thoughtful comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="input"
                        />

                        <div className="search-form__actions">
                            <button type="submit" className="button button--primary">
                                Add Comment
                            </button>
                        </div>
                    </form>
                </div>

                <div className="comments-list">
                    {idea.comments.map((comment) => (
                        <div key={comment.id} className="comment-card">
                            <div className="comment-card__meta">
                                <strong className="comment-card__author">Comment</strong>
                                <span className="badge badge--muted">Community</span>
                            </div>
                            <p className="comment-card__content">{comment.content}</p>
                        </div>
                    ))}
                </div>
            </section>
        </AppLayout>
    );
}

export default IdeaDetails;