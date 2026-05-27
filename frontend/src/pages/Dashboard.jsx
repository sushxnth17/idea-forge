import { Link } from "react-router-dom";

function Dashboard() {

    function handleLogout() {
        localStorage.removeItem("token");
        window.location.href = "/";
    }

    return (
        <div>
            <h1>Dashboard Page</h1>

            <Link to="/feed">
                Feed
            </Link>

            <br/><br/>

            <Link to="/profile">
                Profile
            </Link>

            <br/><br/>

            <Link to="/notifications">
                Notifications
            </Link>

            <br/><br/>

            <Link to="/trending">
                Trending
            </Link>

            <br/><br/>

            <Link to="/create">
                Create Idea
            </Link>

            <br/><br/>

            <button onClick={handleLogout}>
                Logout
            </button>

        </div>
    );
}

export default Dashboard;