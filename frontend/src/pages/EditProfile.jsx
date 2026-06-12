import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import api from "../services/api";

function EditProfile() {
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get("/users/profile");

        setBio(response.data.bio || "");
        setProfilePicture(response.data.profile_picture || "");
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.put("/users/profile", {
        bio,
        profile_picture: profilePicture,
      });

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.log(error);
      alert("Failed to update profile");
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <h2>Loading...</h2>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <section className="page__header">
        <p className="page__eyebrow">Account</p>
        <h1>Edit Profile</h1>
        <p className="page__lead muted">
          Update your public profile information.
        </p>
      </section>

      <div className="card" style={{ maxWidth: "700px" }}>
        <form onSubmit={handleSubmit}>
          <div className="form__field">
            <label className="form__label">
              Profile Picture URL
            </label>

            <input
              type="text"
              className="input"
              value={profilePicture}
              onChange={(e) =>
                setProfilePicture(e.target.value)
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div
            className="form__field"
            style={{ marginTop: "1rem" }}
          >
            <label className="form__label">
              Bio
            </label>

            <textarea
              className="input"
              rows="5"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people about yourself..."
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "1.5rem",
            }}
          >
            <button
              type="submit"
              className="button button--primary"
            >
              Save Changes
            </button>

            <button
              type="button"
              className="button button--secondary"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

export default EditProfile;