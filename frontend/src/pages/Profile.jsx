import { useEffect, useState } from "react";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import { Link } from "react-router-dom";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    useEffect(() => {
        let isActive = true;

        async function loadProfile() {
            try {
                const response = await api.get("/users/profile");

                if (isActive) {
                    setProfile(response.data);

                    const followersResponse = await api.get(
                        `/users/followers/${response.data.id}`
                    );

                    const followingResponse = await api.get(
                        `/users/following/${response.data.id}`
                    );

                    setFollowersCount(followersResponse.data.length);
                    setFollowingCount(followingResponse.data.length);
                }
            } catch(error) {
                console.log(error);
            }
        }

        loadProfile();

        return () => {
            isActive = false;
        };
    }, []);

    if (!profile) {
        return (
            <AppLayout>
                <div className="loading-state">
                    <h2>Loading profile...</h2>
                    <p className="muted">Fetching the current account details.</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <section className="page__header">
                <p className="page__eyebrow">Account</p>
                <h1>My Profile</h1>
                <p className="page__lead muted">Review your identity and public information.</p>
            </section>

            <div className="profile-layout">
                <div className="profile-card card">
                    <div className="profile-row profile-row--header">
                        <div className="profile-avatar">{profile.username?.[0]?.toUpperCase()}</div>
                        <div>
                            <h3>{profile.username}</h3>
                            <p className="muted">IdeaForge creator</p>
                        </div>
                    </div>
                    <div className="profile-row">
                        <strong>Followers: {followersCount}</strong>
                    </div>

                    <div className="profile-row">
                        <strong>Following: {followingCount}</strong>
                    </div>
                    <div className="profile-section">
                        <div className="profile-row">
                            <span className="muted">Username</span>
                            <strong>{profile.username}</strong>
                        </div>

                        <div className="profile-row">
                            <span className="muted">Email</span>
                            <strong>{profile.email}</strong>
                        </div>

                        <div className="profile-row">
                            <span className="muted">Bio</span>
                            <strong>{profile.bio || "No bio"}</strong>
                        </div>
                    </div>
                    <div className="profile-actions">
                        <Link
                            to={`/users/${profile.id}/ideas`}
                            className="btn btn-primary"
                        >
                            📄 View My Ideas
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default Profile;