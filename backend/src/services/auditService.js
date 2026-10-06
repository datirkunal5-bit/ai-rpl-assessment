import { db } from "./storage/database.js";

export function logAuditEvent({
  userId,
  userName = "System",
  role = "system",
  action,
  entity,
  entityId = null,
  oldValue = null,
  newValue = null
}) {
  const logEntry = {
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    userName,
    role,
    action,
    entity,
    entityId,
    oldValue: typeof oldValue === "object" && oldValue !== null ? JSON.stringify(oldValue) : String(oldValue ?? ""),
    newValue: typeof newValue === "object" && newValue !== null ? JSON.stringify(newValue) : String(newValue ?? ""),
    timestamp: new Date().toISOString()
  };

  db.auditLogs.unshift(logEntry);
  // Keep audit log reasonable size in memory
  if (db.auditLogs.length > 500) {
    db.auditLogs.pop();
  }
  return logEntry;
}

export function createNotification({
  userId,
  role = "worker",
  title,
  message,
  link = "/"
}) {
  const notif = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    role,
    title,
    message,
    read: false,
    link,
    createdAt: new Date().toISOString()
  };

  db.notifications.unshift(notif);
  if (db.notifications.length > 200) {
    db.notifications.pop();
  }
  return notif;
}
