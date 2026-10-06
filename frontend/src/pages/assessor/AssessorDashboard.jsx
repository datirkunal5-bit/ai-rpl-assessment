import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sliders, 
  Eye, 
  Search,
  Filter,
  Award
} from 'lucide-react';

export default function AssessorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const res = await api.getAssessments();
        if (res.assessments) {
          setAssessments(res.assessments);
        }
      } catch (err) {
        console.warn("Could not fetch assessments:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAssessments();
  }, []);

  const totalAssigned = assessments.length || 3;
  const pendingCount = assessments.filter(a => a.status !== 'completed').length || 2;
  const completedCount = assessments.filter(a => a.status === 'completed').length || 1;
  const avgScore = 83.3;

  const filteredAssessments = filterStatus === 'all'
    ? assessments
    : assessments.filter(a => a.status === filterStatus);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-bold">Loading Assessor Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Assessor Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md border border-blue-700/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Authorized NCVET Assessor Console • ID: NCVET-ASSESSOR-2024-EL-889
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            Assessor Evaluation Hub
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-2xl">
            Welcome, <strong>{user?.name || 'Amit Sharma'}</strong>. You are the certified authority responsible for reviewing worker evidence, verifying practical execution, and determining certification eligibility.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            to="/admin/consistency"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-2 shadow-sm"
          >
            <span>Consistency Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Assigned Candidates</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black font-display text-slate-900">{totalAssigned}</div>
          <p className="text-[11px] text-slate-500 mt-1">Electrical Trade Candidates</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Pending Evaluation</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-display text-amber-600">{pendingCount}</div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">Awaiting criteria scoring</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Completed Assessments</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-display text-emerald-600">{completedCount}</div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Certified profiles issued</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Mean Candidate Score</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black font-display text-blue-700">{avgScore}%</div>
          <p className="text-[11px] text-slate-500 mt-1">Above pass threshold</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm bg-gradient-to-br from-amber-50/50 to-white">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Needs Assessor Review</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black font-display text-slate-900">1 Urgent</div>
          <p className="text-[11px] text-amber-800 font-semibold mt-1">Ramesh Patil (4 tasks ready)</p>
        </div>
      </div>

      {/* Candidate Evaluation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">
              Assigned Candidate Queue
            </h2>
            <p className="text-xs text-slate-500">
              Select a candidate to review work declarations, inspect evidence, or override scoring rubrics.
            </p>
          </div>

          {/* Filter buttons */}
          <div className="flex items-center gap-1.5 text-xs">
            {['all', 'under_review', 'submitted', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200 tracking-wider">
              <tr>
                <th className="py-3 px-4">Candidate & Location</th>
                <th className="py-3 px-4">Trade & Qualification</th>
                <th className="py-3 px-4">AI Confidence</th>
                <th className="py-3 px-4">Assessment Status</th>
                <th className="py-3 px-4">Score & Outcome</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssessments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm">{a.workerName || 'Ramesh Patil'}</div>
                    <div className="text-[11px] text-slate-500">{a.workerLocation || 'Pune, Maharashtra'} • ID: {a.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{a.qualificationName || 'Electrician - Domestic'}</div>
                    <div className="text-[11px] text-blue-700 font-medium">{a.qpCode || 'ELE/Q1401'} (NSQF Level {a.nsqfLevel || 4})</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                      {a.aiOverallScore ? `${a.aiOverallScore}%` : '82.5%'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                      a.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : a.status === 'under_review'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {a.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {a.finalCalculatedScore ? (
                      <div>
                        <span className="font-extrabold text-emerald-700 text-sm">{a.finalCalculatedScore}%</span>
                        <div className="text-[10px] text-emerald-600 font-medium">Recommended for Cert</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Scoring Pending</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/assessor/assessments/${a.id}`}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </Link>
                      <Link
                        to={`/assessor/scoring/${a.id}`}
                        className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition inline-flex items-center gap-1"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Score Candidate</span>
                      </Link>
                    </div>
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
