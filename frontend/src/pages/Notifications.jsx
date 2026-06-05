import { useEffect, useState } from "react";
import api from "../services/api";
import AppLayout from "../components/AppLayout";

function Notifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        let isActive = true;

        async function loadNotifications() {
            try {
                const response = await api.get("/users/notifications");

                if (isActive) {
                    setNotifications(response.data);
                }
            } catch(error) {
                console.log(error);
            }
        }

        loadNotifications();

        return () => {
            isActive = false;
        };
    }, []);

    return (
        <AppLayout>
            <section className="page__header">
                <p className="page__eyebrow">Inbox</p>
                <h1>Notifications</h1>
                <p className="page__lead muted">Track read and unread activity in one place.</p>
            </section>
            <div className="notifications-list">
                {notifications.length === 0 ? (
                    <div className="card">
                        <h3>No notifications</h3>
                        <p className="muted">You're all caught up — there are no new notifications at this time.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`notification-card card ${notification.is_read ? "" : "notification-card--unread"}`.trim()}
                        >
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                <div>
                                    <p className="notification-card__message">{notification.message}</p>
                                    <div className="muted" style={{fontSize:12}}>{notification.created_at ? new Date(notification.created_at).toLocaleString() : null}</div>
                                </div>

                                <div className="notification-card__status">
                                    <span className={notification.is_read ? "badge badge--success" : "badge badge--warning"}>
                                        {notification.is_read ? "Read" : "Unread"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AppLayout>
    );
}

export default Notifications;