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
                    <div className="profile-row profile-row--header" style={{alignItems:'center',gap:16}}>
                        <div className="profile-avatar" style={{width:96,height:96,fontSize:36}}>{profile.username?.[0]?.toUpperCase()}</div>
                        <div style={{flex:1}}>
                            <div style={{display:'flex',alignItems:'center',gap:12}}>
                                <h2 style={{margin:0}}>{profile.username}</h2>
                                {profile.is_verified && <span className="badge">Verified</span>}
                            </div>
                            <p className="muted" style={{marginTop:6}}>{profile.bio || 'No bio provided.'}</p>
                        </div>
                        <div className="profile-actions" style={{display:'flex',flexDirection:'column',gap:8}}>
                            <Link to={`/users/${profile.id}/ideas`} className="button button--primary">📄 My Ideas</Link>
                            <button className="button" type="button">✏️ Edit Profile</button>
                        </div>
                    </div>

                    <div className="profile-row" style={{marginTop:18,justifyContent:'space-between',alignItems:'center'}}>
                        <div style={{display:'flex',gap:12,alignItems:'center'}}>
                            <div className="badge">👥 {followersCount} Followers</div>
                            <div className="badge">👣 {followingCount} Following</div>
                            <div className="badge">💡 {profile.ideas_count ?? 0} Ideas</div>
                        </div>
                        <div className="muted">Member since {profile.created_at ? new Date(profile.created_at).getFullYear() : '—'}</div>
                    </div>

                    <div className="profile-section" style={{marginTop:16}}>
                        <div className="profile-row">
                            <div>
                                <span className="muted">Email</span>
                                <div><strong>{profile.email}</strong></div>
                            </div>

                            <div>
                                <span className="muted">Location</span>
                                <div><strong>{profile.location || '—'}</strong></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}

export default Profile;