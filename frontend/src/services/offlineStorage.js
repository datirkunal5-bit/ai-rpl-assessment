/**
 * Client-Side Offline Storage & Synchronization Queue
 * Uses localStorage & IndexedDB compatible key-value storage
 */

const DRAFT_KEY_PREFIX = "rpl_draft_";
const SYNC_QUEUE_KEY = "rpl_offline_sync_queue";

export const offlineStorage = {
  // Save an assessment draft locally
  saveDraft(assessmentId, data) {
    try {
      localStorage.setItem(`${DRAFT_KEY_PREFIX}${assessmentId}`, JSON.stringify({
        ...data,
        savedAt: new Date().toISOString()
      }));
      return true;
    } catch (e) {
      console.error("Local storage error:", e);
      return false;
    }
  },

  // Get local assessment draft
  getDraft(assessmentId) {
    try {
      const item = localStorage.getItem(`${DRAFT_KEY_PREFIX}${assessmentId}`);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  },

  // Clear local draft
  clearDraft(assessmentId) {
    localStorage.removeItem(`${DRAFT_KEY_PREFIX}${assessmentId}`);
  },

  // Add an item to the sync queue
  enqueueSync(action, payload) {
    try {
      const queue = this.getSyncQueue();
      const item = {
        clientTxId: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        action,
        payload,
        enqueuedAt: new Date().toISOString()
      };
      queue.push(item);
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
      return item;
    } catch (e) {
      console.error("Enqueue error:", e);
      return null;
    }
  },

  // Get all pending sync items
  getSyncQueue() {
    try {
      const queue = localStorage.getItem(SYNC_QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (e) {
      return [];
    }
  },

  // Clear sync queue after successful synchronization
  clearSyncQueue() {
    localStorage.removeItem(SYNC_QUEUE_KEY);
  },

  // Remove specific items from queue
  removeSyncedItems(clientTxIds = []) {
    const queue = this.getSyncQueue();
    const remaining = queue.filter(item => !clientTxIds.includes(item.clientTxId));
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(remaining));
  }
};
