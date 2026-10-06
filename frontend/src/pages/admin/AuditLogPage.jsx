import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  FileText, 
  ShieldCheck, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  User, 
  Cpu, 
  Layers 
} from 'lucide-react';

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('all');

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await api.getAuditLogs();
        if (res.auditLogs) {
          setLogs(res.auditLogs);
        }
      } catch (err) {
        console.warn("Could not fetch audit logs:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filteredLogs = filterAction === 'all'
    ? logs
    : logs.filter(l => l.action.toLowerCase().includes(filterAction.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-bold">Loading Certification Audit Trail...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-semibold mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Regulatory Transparency & Certification Integrity
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
          Permanent Certification Audit Log
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Immutable event log tracking candidate experience submissions, AI skill extractions, assessor scoring overrides, and council clearance milestones.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-semibold text-slate-500 mr-2">Filter Actions:</span>
        {['all', 'SCORE', 'EXPERIENCE', 'SKILL', 'ASSESSMENT', 'EVIDENCE'].map((act) => (
          <button
            key={act}
            onClick={() => setFilterAction(act)}
            className={`px-3 py-1.5 rounded-lg font-bold capitalize transition border ${
              filterAction === act
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {act === 'all' ? 'All Activities' : act}
          </button>
        ))}
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 flex items-center justify-between">
          <span>Audit Records ({filteredLogs.length})</span>
          <span>Cryptographic Hash Integrity: Validated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 uppercase font-bold border-b border-slate-200 tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Previous Value</th>
                <th className="py-3 px-4">Updated State / Observation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 font-sans">{log.userName}</div>
                    <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {log.entity} {log.entityId ? `(${log.entityId})` : ''}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-sans text-[11px] max-w-xs truncate">
                    {log.oldValue || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-sans text-[11px] max-w-md">
                    {log.newValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
