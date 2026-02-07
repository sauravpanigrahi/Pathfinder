import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaBell,
  FaCheck,
  FaCheckDouble,
  FaTrash,
  FaCalendarAlt,
  FaBriefcase,
  FaCheckCircle,
  FaVideo,
  FaMapMarkerAlt,
  FaTimes,
  FaClock,
} from "react-icons/fa";
import { timeAgo } from "../js/Time";

const NotificationsPanel = ({
  isOpen,
  onClose,
  userUID,
  onUnreadCountChange,
}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isOpen && userUID) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [isOpen, userUID]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `https://pathfinder-maob.onrender.com/notifications/${userUID}`,
        { withCredentials: true },
      );
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(
        `https://pathfinder-maob.onrender.com/notifications/${userUID}/unread-count`,
        { withCredentials: true },
      );
      const count = response.data.unread_count || 0;
      setUnreadCount(count);
      if (onUnreadCountChange) onUnreadCountChange(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `https://pathfinder-maob.onrender.com/notifications/${notificationId}/read`,
        {},
        { withCredentials: true },
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif,
        ),
      );
      setUnreadCount((prev) => {
        const newCount = Math.max(0, prev - 1);
        if (onUnreadCountChange) onUnreadCountChange(newCount);
        return newCount;
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(
        `https://pathfinder-maob.onrender.com/notifications/${userUID}/read-all`,
        {},
        { withCredentials: true },
      );
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true })),
      );
      setUnreadCount(0);
      if (onUnreadCountChange) onUnreadCountChange(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `https://pathfinder-maob.onrender.com/notifications/${notificationId}`,
        { withCredentials: true },
      );
      const deletedNotif = notifications.find((n) => n.id === notificationId);
      if (deletedNotif && !deletedNotif.is_read) {
        setUnreadCount((prev) => {
          const newCount = Math.max(0, prev - 1);
          if (onUnreadCountChange) onUnreadCountChange(newCount);
          return newCount;
        });
      }
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId),
      );
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "application_accepted":
        return <FaCheckCircle className="w-5 h-5 text-green-500" />;
      case "interview_scheduled":
        return <FaCalendarAlt className="w-5 h-5 text-blue-500" />;
      case "new_job":
        return <FaBriefcase className="w-5 h-5 text-purple-500" />;
      default:
        return <FaBell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "application_accepted":
        return "bg-green-50 border-green-200 hover:bg-green-100";
      case "interview_scheduled":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100";
      case "new_job":
        return "bg-purple-50 border-purple-200 hover:bg-purple-100";
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };

  const formatInterviewDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-16 right-4 w-full max-w-md h-[calc(100vh-5rem)] bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <FaBell className="w-5 h-5" />
            <h2 className="text-xl font-bold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-white text-indigo-600 text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Mark all as read"
              >
                <FaCheckDouble className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading notifications...</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaBell className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-600">
                You'll see updates about your applications, interviews, and new
                job opportunities here.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => {
                const interviewDateTime =
                  notification.type === "interview_scheduled"
                    ? formatInterviewDateTime(notification.interview_datetime)
                    : null;

                return (
                  <div
                    key={notification.id}
                    className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                      notification.is_read
                        ? "bg-white border-gray-200"
                        : `${getNotificationColor(notification.type)} border-l-4`
                    }`}
                  >
                    {/* Unread indicator */}
                    {!notification.is_read && (
                      <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 rounded-full"></div>
                    )}

                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {notification.title}
                          </h4>

                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {timeAgo(notification.created_at)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 mb-2">
                          {notification.message}
                        </p>

                        {/* Additional Info */}
                        {notification.company_name && (
                          <div className="text-xs text-gray-600 mb-1">
                            <span className="font-medium">Company:</span>{" "}
                            {notification.company_name}
                            {notification.job_role && (
                              <>
                                {" "}
                                • <span className="font-medium">
                                  Role:
                                </span>{" "}
                                {notification.job_role}
                              </>
                            )}
                          </div>
                        )}

                        {/* Interview Details */}
                        {interviewDateTime && (
                          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                              <FaClock className="w-4 h-4 text-blue-500" />
                              <span className="font-medium">
                                {interviewDateTime.date} at{" "}
                                {interviewDateTime.time}
                              </span>
                            </div>
                            {notification.meeting_link && (
                              <a
                                href={notification.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                              >
                                <FaVideo className="w-3 h-3" />
                                Join Meeting
                              </a>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                          {!notification.is_read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              <FaCheck className="w-3 h-3" />
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors ml-auto"
                          >
                            <FaTrash className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
            <p className="text-xs text-gray-600 text-center">
              {notifications.length} notification
              {notifications.length !== 1 ? "s" : ""}
              {unreadCount > 0 && ` • ${unreadCount} unread`}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationsPanel;
