import { useEffect, useState } from "react";
import api from "../services/api";

function Notifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    async function fetchNotifications() {
        try {
            const response = await api.get(
                "/users/notifications"
            );

            setNotifications(response.data);

        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>🔔 Notifications</h1>

            {notifications.map((notification)=>(
                <div
                    key={notification.id}
                    style={{
                        border:"1px solid gray",
                        margin:"10px",
                        padding:"10px"
                    }}
                >
                    <p>
                        {notification.message}
                    </p>

                    <small>
                        Read:
                        {" "}
                        {notification.is_read
                            ? "✅"
                            : "❌"}
                    </small>

                </div>
            ))}
        </div>
    );
}

export default Notifications;