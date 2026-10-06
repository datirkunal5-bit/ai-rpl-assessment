import { db } from "../services/storage/database.js";
import { logAuditEvent } from "../services/auditService.js";

export function processOfflineSync(req, res) {
  try {
    const { queueItems = [] } = req.body;
    const syncedResults = [];

    for (const item of queueItems) {
      const { clientTxId, action, payload } = item;

      if (action === "SYNC_EXPERIENCE") {
        if (payload.workerId) {
          const exp = {
            id: `exp-sync-${Date.now()}`,
            workerId: payload.workerId,
            ...payload,
            syncedAt: new Date().toISOString()
          };
          db.experiences.push(exp);
        }
      } else if (action === "SYNC_TASK_PROGRESS") {
        const assessment = db.assessments.find(a => a.id === payload.assessmentId);
        if (assessment) {
          const task = assessment.tasks.find(t => t.id === payload.taskId);
          if (task) {
            task.status = payload.status || "completed";
            task.timeSpentMinutes = payload.timeSpentMinutes || 25;
          }
        }
      } else if (action === "SYNC_EVIDENCE") {
        const evidenceItem = {
          id: `ev-sync-${Date.now()}`,
          ...payload,
          syncedAt: new Date().toISOString()
        };
        db.evidence.push(evidenceItem);
      }

      syncedResults.push({
        clientTxId,
        action,
        status: "synced",
        syncedAt: new Date().toISOString()
      });

      db.syncQueue.push({
        clientTxId,
        userId: req.user ? req.user.id : "offline-user",
        action,
        status: "synced",
        syncedAt: new Date().toISOString()
      });
    }

    if (queueItems.length > 0) {
      logAuditEvent({
        userId: req.user ? req.user.id : "offline-worker",
        userName: req.user ? req.user.name : "Offline Worker Client",
        role: req.user ? req.user.role : "worker",
        action: "OFFLINE_DATA_SYNCHRONIZED",
        entity: "SyncQueue",
        newValue: `Synchronized ${queueItems.length} offline batch operations`
      });
    }

    return res.json({
      success: true,
      message: `Successfully synchronized ${queueItems.length} items from offline queue`,
      syncedResults
    });
  } catch (err) {
    console.error("Sync processing error:", err);
    return res.status(500).json({ success: false, message: "Synchronization failed" });
  }
}
