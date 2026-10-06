import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Layers, 
  Check, 
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function QpNosLibraryPage() {
  const [qualifications, setQualifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState('qp-ele-001');

  useEffect(() => {
    async function loadQps() {
      try {
        const res = await api.getQualifications();
        if (res.qualifications) {
          setQualifications(res.qualifications);
        }
      } catch (err) {
        console.warn("Could not load qualifications:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadQps();
  }, []);

  const filteredQps = qualifications.filter(q => {
    const matchesSearch = (q.qualificationName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (q.qpCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (q.sector || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || String(q.nsqfLevel) === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-bold">Loading NCVET QP/NOS Knowledge Repository...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            NCVET / NSDC Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-2">
            QP/NOS Knowledge Base
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Official Qualification Packs, National Occupational Standards, and performance criteria blueprints.
          </p>
        </div>

        <button
          onClick={() => alert("Prototype demonstration: In production, administrators can upload official NCVET Excel/JSON qualification packs.")}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Import Qualification Pack</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by QP code, job role, or sector..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Filter Level:</span>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All NSQF Levels</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
            <option value="5">Level 5</option>
          </select>
        </div>
      </div>

      {/* Qualification Cards Accordion */}
      <div className="space-y-4">
        {filteredQps.map((qp) => {
          const isExpanded = expandedId === qp.id;

          return (
            <div
              key={qp.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition"
            >
              {/* Accordion Bar */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : qp.id)}
                className="p-6 cursor-pointer hover:bg-slate-50/70 transition flex items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-blue-700 text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded">
                      {qp.qpCode}
                    </span>
                    <span className="bg-slate-100 text-slate-700 font-bold text-xs px-2 py-0.5 rounded border border-slate-200">
                      NSQF Level {qp.nsqfLevel}
                    </span>
                    <span className="text-xs text-slate-500">
                      {qp.sector} • {qp.subSector}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {qp.qualificationName}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 max-w-3xl">
                    {qp.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                    {qp.nosList?.length || 0} NOS Standards
                  </span>
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details Panel */}
              {isExpanded && (
                <div className="p-6 bg-slate-50/50 border-t border-slate-200 space-y-6">
                  {/* Core Skills Required */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Core Trade Competencies Required
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(qp.coreSkills || []).map((sk, sidx) => (
                        <span key={sidx} className="bg-white text-slate-800 border border-slate-200 text-xs px-3 py-1 rounded-lg font-medium shadow-2xs">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* National Occupational Standards (NOS) list */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                      National Occupational Standards (NOS List)
                    </h4>
                    <div className="space-y-3">
                      {(qp.nosList || []).map((nos, nidx) => (
                        <div key={nidx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-blue-700 font-mono">
                              {nos.nosCode}: {nos.nosName}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              Weightage: {nos.weightage}%
                            </span>
                          </div>

                          <div className="space-y-1 pl-2 border-l-2 border-blue-200">
                            {(nos.performanceCriteria || []).map((pc, pcidx) => (
                              <p key={pcidx} className="text-[11px] text-slate-600">
                                • {pc}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
