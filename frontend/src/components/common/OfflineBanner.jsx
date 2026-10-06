import React from 'react';
import { useOffline } from '../../context/OfflineContext';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function OfflineBanner() {
  const { isOnline, isSimulatingOffline, pendingCount, isSyncing, triggerSync, toggleSimulatedOffline } = useOffline();

  if (isOnline && pendingCount === 0) return null;

  return (
    <div className="bg-amber-600 text-white px-4 py-2 text-sm shadow-md transition-all duration-300 no-print">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <WifiOff className="w-5 h-5 flex-shrink-0 animate-pulse text-amber-200" />
          <div>
            <span className="font-bold">
              {!isOnline ? "Offline Mode Active" : "Pending Synchronization"}
            </span>
            <span className="mx-1.5 opacity-75">—</span>
            <span className="opacity-95">
              {!isOnline 
                ? "You can continue filling self-declarations and assessment tasks. Data is safely queued locally." 
                : `${pendingCount} item(s) in local queue waiting to sync with central database.`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="bg-black/25 px-2.5 py-0.5 rounded-full text-xs font-semibold text-amber-100">
              {pendingCount} item{pendingCount > 1 ? 's' : ''} in queue
            </span>
          )}

          {isOnline ? (
            <button
              onClick={triggerSync}
              disabled={isSyncing}
              className="bg-white text-amber-900 hover:bg-amber-50 px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          ) : (
            <button
              onClick={toggleSimulatedOffline}
              className="bg-amber-800 hover:bg-amber-900 text-white px-3 py-1 rounded text-xs font-medium transition"
            >
              Simulate Online
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
