import { useEffect, useState } from "react";
import api from "../services/api";
import AppLayout from "../components/AppLayout";
import EmptyState from "../components/EmptyState";
import SkeletonCard from "../components/SkeletonCard";
import "../styles/notifications.css";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            const response = await api.get("/users/notifications");
            setNotifications(response.data);
        } catch (error) {
            console.log("Error loading notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const getNotificationCategory = (message) => {
        const msg = message.toLowerCase();
        if (msg.includes("liked your idea")) return "likes";
        if (msg.includes("commented on your idea")) return "comments";
        if (msg.includes("started following you") || msg.includes("followed")) return "follows";
        if (msg.includes("remixed")) return "remixes";
        return "other";
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "likes":
                return { icon: "❤️", className: "notification-card__icon-wrapper--like" };
            case "comments":
                return { icon: "💬", className: "notification-card__icon-wrapper--comment" };
            case "follows":
                return { icon: "👥", className: "notification-card__icon-wrapper--follow" };
            case "remixes":
                return { icon: "🔁", className: "notification-card__icon-wrapper--remix" };
            default:
                return { icon: "🔔", className: "" };
        }
    };

    const handleMarkAsRead = async (notificationId, e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await api.put(`/users/notifications/${notificationId}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
            );
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        const unreadNotifications = notifications.filter(n => !n.is_read);
        if (unreadNotifications.length === 0) return;
        try {
            await Promise.all(
                unreadNotifications.map(n => api.put(`/users/notifications/${n.id}/read`))
            );
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error("Error marking all as read:", error);
            alert("Failed to mark some notifications as read.");
        }
    };

    const renderMessageContent = (message) => {
        const parts = message.split(" ");
        if (parts.length > 1) {
            const username = parts[0];
            const rest = parts.slice(1).join(" ");
            return (
                <>
                    <span className="notification-card__username">{username}</span> {rest}
                </>
            );
        }
        return message;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Filter logic
    const filteredNotifications = notifications.filter(notification => {
        if (activeTab === "all") return true;
        const category = getNotificationCategory(notification.message);
        return category === activeTab;
    });

    // Count unread helper
    const getUnreadCount = (tabName) => {
        return notifications.filter(n => {
            if (n.is_read) return false;
            if (tabName === "all") return true;
            return getNotificationCategory(n.message) === tabName;
        }).length;
    };

    const totalUnread = getUnreadCount("all");

    if (loading) {
        return (
            <AppLayout>
                <div className="notifications-shell">
                    <section className="page__header" style={{ margin: 0, marginBottom: 26 }}>
                        <p className="page__eyebrow">Inbox</p>
                        <h1>Notifications</h1>
                        <p className="page__lead muted">
                            Track read and unread activity in one place.
                        </p>
                    </section>
                    <div className="notifications-list">
                        <SkeletonCard type="notification" />
                        <SkeletonCard type="notification" />
                        <SkeletonCard type="notification" />
                        <SkeletonCard type="notification" />
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="notifications-shell">
                {/* Header Action Row */}
                <div className="notifications-header-row">
                    <section className="page__header" style={{ margin: 0 }}>
                        <p className="page__eyebrow">Inbox</p>
                        <h1>Notifications</h1>
                        <p className="page__lead muted">
                            Track read and unread activity in one place.
                        </p>
                    </section>
                    
                    {totalUnread > 0 && (
                        <button 
                            type="button" 
                            onClick={handleMarkAllAsRead} 
                            className="button button--secondary"
                            style={{ marginBottom: 26 }}
                        >
                            ✓ Mark all read
                        </button>
                    )}
                </div>

                {/* Tabs filter bar */}
                <div className="notifications-tabs">
                    <button 
                        type="button"
                        onClick={() => setActiveTab("all")}
                        className={`notifications-tab-btn ${activeTab === "all" ? "notifications-tab-btn--active" : ""}`}
                    >
                        All {getUnreadCount("all") > 0 && <span className="notifications-tab-btn__count">{getUnreadCount("all")}</span>}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => setActiveTab("likes")}
                        className={`notifications-tab-btn ${activeTab === "likes" ? "notifications-tab-btn--active" : ""}`}
                    >
                        Likes ❤️ {getUnreadCount("likes") > 0 && <span className="notifications-tab-btn__count">{getUnreadCount("likes")}</span>}
                    </button>

                    <button 
                        type="button"
                        onClick={() => setActiveTab("comments")}
                        className={`notifications-tab-btn ${activeTab === "comments" ? "notifications-tab-btn--active" : ""}`}
                    >
                        Comments 💬 {getUnreadCount("comments") > 0 && <span className="notifications-tab-btn__count">{getUnreadCount("comments")}</span>}
                    </button>

                    <button 
                        type="button"
                        onClick={() => setActiveTab("follows")}
                        className={`notifications-tab-btn ${activeTab === "follows" ? "notifications-tab-btn--active" : ""}`}
                    >
                        Follows 👥 {getUnreadCount("follows") > 0 && <span className="notifications-tab-btn__count">{getUnreadCount("follows")}</span>}
                    </button>
                </div>

                {/* List container */}
                <div className="notifications-list">
                    {filteredNotifications.length === 0 ? (
                        <EmptyState
                            icon="🔔"
                            title="No notifications."
                            description="You're all caught up."
                        />
                    ) : (
                        filteredNotifications.map((notification) => {
                            const category = getNotificationCategory(notification.message);
                            const { icon, className } = getCategoryIcon(category);

                            return (
                                <div
                                    key={notification.id}
                                    className={`notification-card card ${notification.is_read ? "" : "notification-card--unread"}`}
                                >
                                    {/* Icon Column */}
                                    <div className={`notification-card__icon-wrapper ${className}`}>
                                        {icon}
                                    </div>

                                    {/* Body Column */}
                                    <div className="notification-card__body">
                                        <p className="notification-card__message">
                                            {renderMessageContent(notification.message)}
                                        </p>
                                        <time className="notification-card__date" dateTime={notification.created_at}>
                                            {formatDate(notification.created_at)}
                                        </time>
                                    </div>

                                    {/* Actions Column */}
                                    <div className="notification-card__actions">
                                        {!notification.is_read ? (
                                            <>
                                                <div className="notification-card__dot" title="Unread" />
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                    className="notification-card__read-btn"
                                                    title="Mark as read"
                                                >
                                                    Read
                                                </button>
                                            </>
                                        ) : (
                                            <span className="badge badge--muted" style={{ border: "1px solid #ddd" }}>Read</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

export default Notifications;