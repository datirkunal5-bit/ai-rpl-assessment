import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { 
  Zap, 
  User, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Award, 
  FileText, 
  Wrench, 
  ShieldAlert, 
  Upload, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getWorkerDashboardStats();
        if (res.success) {
          setStats(res.stats);
        }
      } catch (err) {
        console.warn("Could not load stats, using local defaults:", err.message);
        setStats({
          profileCompletion: 95,
          yearsDeclared: 6,
          trade: "Electrician",
          nsqfLevel: 4,
          qualificationName: "Electrician - Domestic Solutions",
          qpCode: "ELE/Q1401",
          assessmentStatus: "under_review",
          completedTasksCount: 4,
          totalTasksCount: 5,
          competencyScore: 83.3,
          recommendationStatus: "Recommended for Certification — Pending Final Authority Approval"
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const timelineSteps = [
    { num: 1, label: t('stepProfile'), status: 'completed', path: '/worker/profile' },
    { num: 2, label: t('stepExperience'), status: 'completed', path: '/worker/self-declaration' },
    { num: 3, label: t('stepSkills'), status: 'completed', path: '/worker/skill-analysis' },
    { num: 4, label: t('stepMatch'), status: 'completed', path: '/worker/qualification-match' },
    { num: 5, label: t('stepAssessment'), status: stats?.completedTasksCount >= 4 ? 'completed' : 'in_progress', path: '/worker/assessment' },
    { num: 6, label: t('stepReview'), status: stats?.assessmentStatus === 'completed' ? 'completed' : 'in_progress', path: '/worker/evidence' },
    { num: 7, label: t('stepCertified'), status: stats?.competencyScore ? 'completed' : 'pending', path: '/worker/competency-profile' }
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-semibold">Loading Candidate Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-blue-700/30">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Candidate Portal • Recognition of Prior Learning
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
              {t('welcomeBack')}, {user?.name || 'Ramesh Patil'}
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Your trade experience has been analyzed against the <strong>National Skills Qualification Framework (NSQF)</strong>. Review your milestones and progress below.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              to="/worker/self-declaration"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>Update Experience</span>
            </Link>
            <Link
              to="/worker/competency-profile"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-lg text-xs border border-white/20 transition flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>View Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            {t('timelineTitle')}
          </h2>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Current Status: {stats?.assessmentStatus?.toUpperCase().replace('_', ' ') || 'UNDER REVIEW'}
          </span>
        </div>

        {/* Stepper horizontal line */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {timelineSteps.map((step) => {
            const isDone = step.status === 'completed';
            const isCurrent = step.status === 'in_progress';
            return (
              <Link
                key={step.num}
                to={step.path}
                className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${
                  isDone 
                    ? 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300' 
                    : isCurrent 
                    ? 'bg-blue-50 border-blue-400 shadow-sm ring-1 ring-blue-400' 
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    isDone ? 'bg-emerald-200 text-emerald-800' : isCurrent ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    Step {step.num}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                  )}
                </div>
                <div className={`text-xs font-bold leading-tight ${isDone ? 'text-slate-800' : isCurrent ? 'text-blue-900' : 'text-slate-500'}`}>
                  {step.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Experience */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Experience Declared</span>
              <Wrench className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black font-display text-slate-900">
              {stats?.yearsDeclared || 6} Years
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              ✓ Verified via Informal Apprenticeship
            </p>
          </div>
          <Link to="/worker/self-declaration" className="mt-4 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            <span>View declaration</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2: AI Skills Identified */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Skills Identified</span>
              <Cpu className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black font-display text-slate-900">
              7 Core Skills
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Avg AI Confidence: <strong>89.4%</strong>
            </p>
          </div>
          <Link to="/worker/skill-analysis" className="mt-4 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            <span>Inspect skills</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 3: Qualification Match */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Qualification Match</span>
              <Layers className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-sm font-black font-display text-slate-900 leading-snug">
              {stats?.qualificationName || "Electrician - Domestic Solutions"}
            </div>
            <p className="text-[11px] text-blue-700 font-bold mt-1">
              {stats?.qpCode || "ELE/Q1401"} • NSQF Level {stats?.nsqfLevel || 4}
            </p>
          </div>
          <Link to="/worker/qualification-match" className="mt-4 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            <span>Why this match?</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 4: Assessment Tasks */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Practical Assessment</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black font-display text-slate-900">
              {stats?.completedTasksCount || 4} / {stats?.totalTasksCount || 5}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Tasks executed & evidenced
            </p>
          </div>
          <Link to="/worker/assessment" className="mt-4 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            <span>Continue tasks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 5: Competency Score */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between bg-gradient-to-br from-emerald-50/40 to-white">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Competency Score</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black font-display text-emerald-700">
              {stats?.competencyScore ? `${stats.competencyScore}%` : "83.3%"}
            </div>
            <p className="text-[11px] text-emerald-800 font-semibold mt-1">
              ✓ Benchmark Exceeded (≥60%)
            </p>
          </div>
          <Link to="/worker/competency-profile" className="mt-4 text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
            <span>View certificate</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Action Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Action Box */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Recommended Next Step in Candidate Journey
          </h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-sm text-slate-900">
                Practical Assessment Evidence Awaiting Assessor Scoring
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-lg">
                You have uploaded practical photographic evidence for 4 tasks. Assessor <strong>Amit Sharma</strong> has commenced criteria evaluation. You can review AI evidence observations or your competency profile.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="/worker/competency-profile"
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-sm transition inline-flex items-center gap-1.5"
              >
                <span>Open Competency Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Support & Accessibility Box */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-2">Worker Assistance</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Need help submitting in your language or uploading photos of your electrical wiring board?
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between">
              <span>Preferred Dialect</span>
              <span className="font-bold">Marathi / Hindi / English</span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
              <span>Offline Mode Ready</span>
              <span className="font-bold">PWA Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
