import React, { createContext, useContext, useState, useEffect } from 'react';
import { offlineStorage } from '../services/offlineStorage';
import { api } from '../services/api';

const OfflineContext = createContext(null);

export function OfflineProvider({ children }) {
  const [isBrowserOnline, setIsBrowserOnline] = useState(navigator.onLine);
  const [isSimulatingOffline, setIsSimulatingOffline] = useState(false);
  const [pendingQueue, setPendingQueue] = useState(() => offlineStorage.getSyncQueue());
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Effective online status (considers simulated toggle)
  const isOnline = isBrowserOnline && !isSimulatingOffline;

  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOnline(true);
      triggerSync();
    };
    const handleOffline = () => {
      setIsBrowserOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshQueue = () => {
    setPendingQueue(offlineStorage.getSyncQueue());
  };

  const toggleSimulatedOffline = () => {
    setIsSimulatingOffline(prev => {
      const next = !prev;
      if (!next) {
        // Returned to online: trigger sync
        setTimeout(() => triggerSync(), 200);
      }
      return next;
    });
  };

  const enqueueAction = (action, payload) => {
    const item = offlineStorage.enqueueSync(action, payload);
    refreshQueue();
    return item;
  };

  const triggerSync = async () => {
    const queue = offlineStorage.getSyncQueue();
    if (queue.length === 0) return { success: true, count: 0 };

    setIsSyncing(true);
    try {
      const res = await api.syncQueue(queue);
      if (res.success) {
        const syncedTxIds = res.syncedResults.map(r => r.clientTxId);
        offlineStorage.removeSyncedItems(syncedTxIds);
        refreshQueue();
        setLastSyncTime(new Date().toLocaleTimeString());
        return { success: true, count: syncedTxIds.length };
      }
    } catch (err) {
      console.warn("Background offline sync failed, will retry:", err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        isBrowserOnline,
        isSimulatingOffline,
        toggleSimulatedOffline,
        pendingQueue,
        pendingCount: pendingQueue.length,
        isSyncing,
        lastSyncTime,
        enqueueAction,
        triggerSync,
        refreshQueue
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export const useOffline = () => useContext(OfflineContext);
