import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  Terminal,
} from "lucide-react";

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../data/notifications";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    loadNotifications();

    const handleNotificationsUpdated = () => {
      loadNotifications();
    };

    window.addEventListener(
      "igbese-notifications-updated",
      handleNotificationsUpdated
    );

    window.addEventListener("storage", handleNotificationsUpdated);

    return () => {
      window.removeEventListener(
        "igbese-notifications-updated",
        handleNotificationsUpdated
      );

      window.removeEventListener("storage", handleNotificationsUpdated);
    };
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const handleMarkRead = (id) => {
    const updated = markNotificationAsRead(id);

    setNotifications(updated);

    window.dispatchEvent(new Event("igbese-notifications-updated"));
  };

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsAsRead();

    setNotifications(updated);

    window.dispatchEvent(new Event("igbese-notifications-updated"));
  };

  return (
    <div className="min-h-screen bg-[#050907] text-white cyber-grid">
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mono mb-2 text-[9px] uppercase tracking-[0.2em] text-[#8cff72]/50">
              notification.center
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Notifications
            </h1>

            <p className="mt-2 text-sm text-[#607166]">
              Account activity, payment reminders and security updates.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 self-start rounded-xl border border-white/8 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-[#8EA394] transition hover:border-[#8cff72]/20 hover:text-[#8cff72]"
            >
              <CheckCheck size={15} />
              Mark all as read
            </button>
          )}
        </div>

        {/* STATUS */}
        <div className="mb-6 rounded-2xl border border-[#8cff72]/10 bg-[#8cff72]/[0.03] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8cff72]/10 text-[#8cff72]">
              <Bell size={17} />
            </div>

            <div className="flex-1">
              <div className="text-xs font-semibold">Notification status</div>

              <div className="mt-1 text-[11px] text-[#607166]">
                {unreadCount === 0
                  ? "All notifications have been read."
                  : `${unreadCount} unread notification${
                      unreadCount === 1 ? "" : "s"
                    }.`}
              </div>
            </div>

            <span className="mono text-[8px] uppercase tracking-[0.12em] text-[#8cff72]">
              live
            </span>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <section className="overflow-hidden rounded-2xl border border-white/8 bg-[#07100b]">
          {notifications.length === 0 ? (
            <div className="p-10 text-center">
              <Bell size={24} className="mx-auto text-[#607166]" />

              <p className="mt-4 text-sm text-[#607166]">No notifications.</p>

              <p className="mt-2 text-[10px] text-[#526158]">
                New account activity will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={handleMarkRead}
              />
            ))
          )}
        </section>

        {/* FOOTER */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[#526158]">
          <Terminal size={13} />

          <span className="mono text-[8px] uppercase tracking-[0.15em]">
            igbese.notification.system
          </span>
        </div>
      </main>
    </div>
  );
};

const NotificationItem = ({ notification, onRead }) => {
  const getIcon = () => {
    if (notification.type === "payment") {
      return <CreditCard size={17} />;
    }

    if (notification.type === "purchase") {
      return <ShoppingBag size={17} />;
    }

    if (notification.type === "security") {
      return <ShieldCheck size={17} />;
    }

    return <Bell size={17} />;
  };

  return (
    <div
      className={`flex gap-4 border-b border-white/5 p-5 transition last:border-b-0 ${
        notification.read ? "bg-transparent" : "bg-[#8cff72]/[0.025]"
      }`}
    >
      {/* ICON */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          notification.read
            ? "bg-white/[0.03] text-[#607166]"
            : "bg-[#8cff72]/10 text-[#8cff72]"
        }`}
      >
        {getIcon()}
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3
                className={`text-sm ${
                  notification.read
                    ? "font-medium text-[#C9D5CC]"
                    : "font-bold text-white"
                }`}
              >
                {notification.title}
              </h3>

              {!notification.read && (
                <span className="status-pulse h-1.5 w-1.5 rounded-full bg-[#8cff72]" />
              )}
            </div>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-[#607166]">
              {notification.message}
            </p>
          </div>

          <span className="mono shrink-0 text-[8px] uppercase tracking-[0.1em] text-[#526158]">
            {notification.time}
          </span>
        </div>

        {!notification.read && (
          <button
            onClick={() => onRead(notification.id)}
            className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-[#8cff72] transition hover:text-white"
          >
            <Check size={13} />
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
};

export default Notifications;
