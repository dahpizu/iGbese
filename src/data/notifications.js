const getStorageKey = () => {
  const savedCustomer = localStorage.getItem("igbese_customer");

  if (!savedCustomer) {
    return "igbese_notifications";
  }

  try {
    const customer = JSON.parse(savedCustomer);

    const email = customer.email || "guest";

    return `igbese_notifications_${email.toLowerCase()}`;
  } catch {
    return "igbese_notifications";
  }
};

const notifyUpdate = () => {
  window.dispatchEvent(new Event("igbese-notifications-updated"));
};

export const getNotifications = () => {
  const storageKey = getStorageKey();
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    return [];
  }

  try {
    const notifications = JSON.parse(saved);

    if (!Array.isArray(notifications)) {
      return [];
    }

    return notifications;
  } catch {
    localStorage.removeItem(storageKey);
    return [];
  }
};

export const saveNotifications = (notifications) => {
  const storageKey = getStorageKey();

  localStorage.setItem(storageKey, JSON.stringify(notifications));

  notifyUpdate();
};

export const getUnreadCount = () => {
  return getNotifications().filter((notification) => !notification.read).length;
};

export const markNotificationAsRead = (id) => {
  const notifications = getNotifications();

  const updated = notifications.map((notification) =>
    notification.id === id
      ? {
          ...notification,
          read: true,
        }
      : notification
  );

  saveNotifications(updated);

  return updated;
};

export const markAllNotificationsAsRead = () => {
  const notifications = getNotifications();

  const updated = notifications.map((notification) => ({
    ...notification,
    read: true,
  }));

  saveNotifications(updated);

  return updated;
};

export const addNotification = (notification) => {
  const notifications = getNotifications();

  const newNotification = {
    id: notification.id || `N-${Date.now()}`,
    title: notification.title || "iGbese update",
    message: notification.message || "",
    type: notification.type || "system",
    time: notification.time || "Just now",
    read: notification.read === undefined ? false : notification.read,
  };

  const updated = [
    newNotification,
    ...notifications.filter((item) => item.id !== newNotification.id),
  ];

  saveNotifications(updated);

  return newNotification;
};

export const addPurchaseNotification = (purchase) => {
  return addNotification({
    id: `PURCHASE-${purchase.id}`,
    title: "Purchase approved",
    message: `Your ${purchase.product} purchase with ${purchase.merchant} was approved.`,
    type: "purchase",
    time: "Just now",
    read: false,
  });
};

export const addPaymentNotification = (purchase, amount) => {
  return addNotification({
    id: `PAYMENT-${purchase.id}-${Date.now()}`,
    title: "Payment successful",
    message: `Your ₦${Number(amount || 0).toLocaleString(
      "en-NG"
    )} payment for ${purchase.product} was successfully processed.`,
    type: "payment",
    time: "Just now",
    read: false,
  });
};

export const addKycNotification = () => {
  return addNotification({
    id: `KYC-${Date.now()}`,
    title: "KYC verification complete",
    message: "Your identity verification has been successfully completed.",
    type: "security",
    time: "Just now",
    read: false,
  });
};

export const addWelcomeNotification = (customer) => {
  return addNotification({
    id: `WELCOME-${Date.now()}`,
    title: "Welcome to iGbese",
    message: `Your iGbese customer account is ready, ${
      customer.firstName || "Customer"
    }.`,
    type: "system",
    time: "Just now",
    read: false,
  });
};
