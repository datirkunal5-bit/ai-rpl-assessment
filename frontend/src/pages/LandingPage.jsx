import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Users, 
  WifiOff, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  FileText, 
  Wrench, 
  BarChart, 
  ChevronRight,
  Sparkles,
  Search,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function LandingPage() {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoStart = async (role = 'worker') => {
    await demoLogin(role);
    if (role === 'worker') navigate('/worker/dashboard');
    else if (role === 'assessor') navigate('/assessor/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  const steps = [
    { num: "01", title: "Informal Experience", desc: "Worker declares on-the-job apprenticeship history via simple voice/text interface.", icon: Wrench },
    { num: "02", title: "AI Skill Extraction", desc: "Natural language engine parses practical tasks, tools, and competency keywords.", icon: Cpu },
    { num: "03", title: "QP/NOS Matching", desc: "Deterministic matching algorithm aligns worker skills to official NCVET qualification packs.", icon: Layers },
    { num: "04", title: "Practical Assessment", desc: "Candidate performs guided practical tasks with timer and structured rubrics.", icon: CheckCircle2 },
    { num: "05", title: "Evidence & AI Vision", desc: "Worker uploads photo/video proofs; AI highlights safety gear & component verification.", icon: Sparkles },
    { num: "06", title: "Human Assessor Scoring", desc: "Authorized assessor reviews evidence, overrides AI suggestions, and scores criteria.", icon: ShieldCheck },
    { num: "07", title: "Competency Profile", desc: "System generates verified competency passport and formal certification recommendation.", icon: Award }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-16 pb-24 border-b border-blue-900/50">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* National Initiative Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Smart India Hackathon • Problem Statement: AI-Assisted RPL Assessment Tool
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
              Recognize Skills. Validate Experience. <br/>
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 bg-clip-text text-transparent">
                Empower Workers.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
              AI-assisted Recognition of Prior Learning (RPL) for India’s informal workforce. Bridging undocumented apprenticeship experience to formal NCVET NSQF certifications through human-in-the-loop intelligence.
            </p>

            {/* Call to Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleDemoStart('worker')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-amber-500/25 transition flex items-center gap-2 text-sm"
              >
                <span>Get Started (Candidate Demo)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDemoStart('assessor')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg border border-blue-400/40 shadow-lg transition flex items-center gap-2 text-sm"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Assessor Portal</span>
              </button>

              <button
                onClick={() => handleDemoStart('admin')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-3 rounded-lg border border-slate-700 transition flex items-center gap-2 text-sm"
              >
                <BarChart className="w-4 h-4 text-emerald-400" />
                <span>Admin & Analytics</span>
              </button>
            </div>

            {/* Quick Demo Info Pill */}
            <div className="mt-8 text-xs text-slate-400 flex items-center justify-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Initial Trade: <strong>Electrician (NSQF Level 4)</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Human Assessor Remains Final Authority
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Offline-First PWA Synchronization
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual End-to-End Workflow Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">Process Architecture</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
              The 7-Step AI-Assisted RPL Assessment Flow
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Transforming undocumented informal experience into standardized NCVET certification recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div key={st.num} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black font-display text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        {st.num}
                      </span>
                      <Icon className="w-4 h-4 text-slate-600" />
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 mb-1 leading-snug">{st.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-normal">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problem & Solution Contrast */}
      <section className="py-16 bg-slate-100/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* The Problem */}
            <div className="bg-white rounded-2xl p-8 border border-red-200/80 shadow-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-4">
                Current RPL Bottlenecks in India
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900 mb-4">
                Why Traditional RPL Assessment Struggles to Scale
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">✕</span>
                  <span><strong>Subjective Evaluation:</strong> Significant score variance across different human assessors and geographic locations.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">✕</span>
                  <span><strong>Scheduling Barriers:</strong> Informal daily-wage workers cannot easily sacrifice days of wages to travel to assessment centers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">✕</span>
                  <span><strong>Undocumented Skill Mapping:</strong> Lack of standardized digital extraction from colloquial descriptions of informal work.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">✕</span>
                  <span><strong>Assessor Fatigue:</strong> High administrative burden on limited pool of certified assessors.</span>
                </li>
              </ul>
            </div>

            {/* The RPL Assist Solution */}
            <div className="bg-white rounded-2xl p-8 border border-emerald-200/80 shadow-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-4">
                The RPL Assist Solution
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900 mb-4">
                Standardized, Scalable, AI-Assisted Assessment
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>AI Skill Extraction:</strong> Natural language analysis translates informal trade speech into formal NCVET competencies.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Explainable QP/NOS Matching:</strong> Recommends suitable qualification pack with transparent "Why this match?" breakdown.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Standardized 5-Criteria Rubric:</strong> Consistent weighting (Technical, Practical, Safety, Quality, Completion) reduces variance.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Human Assessor Authority:</strong> Assessors can override any AI suggestion; full audit log maintained.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Technology Pillars */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">Architectural Highlights</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
              Engineered for Real-World Field Conditions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">Human-in-the-Loop Safeguard</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The AI does <strong>never</strong> independently certify a worker. It surfaces skill cues, PPE observations, and suggested criteria scores. The authorized human assessor retains total veto and override power.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <WifiOff className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">Offline-First PWA Architecture</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Field test centers with intermittent 2G/3G connectivity can operate smoothly. Assessment drafts and evidence are queued securely in local storage and synced when connection returns.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">Assessor Consistency Analytics</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Empowers administrative directorates to monitor scoring variance and inter-assessor agreement (Cohen's Kappa / ICC), directly targeting the problem statement's consistency goal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trade Section: Initial Trade Electrician */}
      <section className="py-14 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900/60 to-slate-800 rounded-2xl p-8 border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="bg-amber-400 text-slate-950 text-xs font-bold px-2.5 py-1 rounded">
                Prototype Focus Trade
              </span>
              <h3 className="text-2xl font-bold font-display mt-3">
                Electrician — Domestic Solutions (ELE/Q1401)
              </h3>
              <p className="text-sm text-slate-300 mt-2 max-w-xl">
                Configured with 5 practical tasks: Conduit Wiring, Modular Switchboard, MCB Installation, Fault Diagnosis, and Electrical Safety & Earthing. Modular schema enables adding Plumbing, Welding, and Carpentry trades with zero structural changes.
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => handleDemoStart('worker')}
                className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-3 rounded-lg text-sm shadow transition"
              >
                Experience Live Electrician Flow
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
