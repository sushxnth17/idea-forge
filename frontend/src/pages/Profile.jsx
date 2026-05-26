import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const response = await api.get("/users/profile");
            setProfile(response.data);

        } catch(error) {
            console.log(error);
        }
    }

    if (!profile) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>
            <h1>My Profile 👤</h1>

            <p>
                <strong>Username:</strong>{" "}
                {profile.username}
            </p>

            <p>
                <strong>Email:</strong>{" "}
                {profile.email}
            </p>

            <p>
                <strong>Bio:</strong>{" "}
                {profile.bio || "No bio"}
            </p>
        </div>
    );
}

export default Profile;