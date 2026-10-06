import { db } from "../services/storage/database.js";

export function getNotifications(req, res) {
  const userId = req.user.id;
  const userRole = req.user.role;

  const list = db.notifications.filter(n => n.userId === userId || n.role === userRole);
  const unreadCount = list.filter(n => !n.read).length;

  return res.json({
    success: true,
    count: list.length,
    unreadCount,
    notifications: list
  });
}

export function markAsRead(req, res) {
  const { id } = req.params;
  const notif = db.notifications.find(n => n.id === id);

  if (notif) {
    notif.read = true;
  }

  return res.json({ success: true, message: "Notification marked as read", notification: notif });
}

export function markAllAsRead(req, res) {
  const userId = req.user.id;
  const userRole = req.user.role;

  db.notifications.forEach(n => {
    if (n.userId === userId || n.role === userRole) {
      n.read = true;
    }
  });

  return res.json({ success: true, message: "All notifications marked as read" });
}
