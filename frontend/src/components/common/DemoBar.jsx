import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import { 
  Play, 
  UserCheck, 
  CheckCircle, 
  Sliders, 
  Award, 
  BarChart3, 
  Wifi, 
  WifiOff, 
  ChevronDown, 
  ChevronUp,
  FileCheck,
  Zap,
  Sparkles
} from 'lucide-react';

export default function DemoBar() {
  const { demoLogin, user } = useAuth();
  const { isOnline, isSimulatingOffline, toggleSimulatedOffline, pendingCount, triggerSync } = useOffline();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const demoSteps = [
    { num: 1, label: "1. Worker Login", role: "worker", path: "/worker/dashboard" },
    { num: 2, label: "2. Self-Declaration", role: "worker", path: "/worker/self-declaration" },
    { num: 3, label: "3. AI Skills", role: "worker", path: "/worker/skill-analysis" },
    { num: 4, label: "4. QP/NOS Match", role: "worker", path: "/worker/qualification-match" },
    { num: 5, label: "5. Practical Tasks", role: "worker", path: "/worker/assessment" },
    { num: 6, label: "6. Evidence Upload", role: "worker", path: "/worker/evidence" },
    { num: 7, label: "7. Assessor Review", role: "assessor", path: "/assessor/assessments/asm-001" },
    { num: 8, label: "8. Standardized Scoring", role: "assessor", path: "/assessor/scoring/asm-001" },
    { num: 9, label: "9. Competency Profile", role: "worker", path: "/worker/competency-profile" },
    { num: 10, label: "10. Consistency Analytics", role: "admin", path: "/admin/consistency" }
  ];

  const handleStepClick = async (step) => {
    if (!user || user.role !== step.role) {
      await demoLogin(step.role);
    }
    navigate(step.path);
  };

  const handleRoleSwitch = async (role) => {
    await demoLogin(role);
    if (role === 'worker') navigate('/worker/dashboard');
    else if (role === 'assessor') navigate('/assessor/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div className="bg-slate-900 border-b border-blue-500/30 text-white text-xs z-50 sticky top-0 shadow-lg no-print">
      <div className="max-w-7xl mx-auto px-3 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Title & Badge */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-600/40 border border-blue-400/30 text-blue-300 font-semibold uppercase tracking-wider text-[10px]">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Workflow Navigator
          </span>
          <span className="hidden sm:inline text-slate-400">
            Current: <strong className="text-white capitalize">{user?.role || 'Guest'}</strong> ({user?.name || 'Not logged in'})
          </span>
        </div>

        {/* Quick Role Selectors & Offline Simulator */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-800 rounded p-0.5 border border-slate-700">
            <button
              onClick={() => handleRoleSwitch('worker')}
              className={`px-2 py-0.5 rounded transition ${user?.role === 'worker' ? 'bg-amber-600 text-white font-medium' : 'text-slate-300 hover:text-white'}`}
              title="Ramesh Patil (6 yrs experience)"
            >
              Worker (Ramesh)
            </button>
            <button
              onClick={() => handleRoleSwitch('assessor')}
              className={`px-2 py-0.5 rounded transition ${user?.role === 'assessor' ? 'bg-blue-600 text-white font-medium' : 'text-slate-300 hover:text-white'}`}
              title="Amit Sharma (Lead NCVET Assessor)"
            >
              Assessor (Amit)
            </button>
            <button
              onClick={() => handleRoleSwitch('admin')}
              className={`px-2 py-0.5 rounded transition ${user?.role === 'admin' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300 hover:text-white'}`}
              title="Admin User (Analytics & Standards)"
            >
              Admin
            </button>
          </div>

          {/* Offline Toggle Button */}
          <button
            onClick={toggleSimulatedOffline}
            className={`flex items-center gap-1 px-2 py-1 rounded border transition font-medium ${
              isSimulatingOffline
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
            title="Toggle offline mode to test PWA queue & local drafts"
          >
            {isSimulatingOffline ? <WifiOff className="w-3 h-3 text-amber-400" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
            <span>{isSimulatingOffline ? 'Offline (Sim)' : 'Online'}</span>
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-bold px-1 rounded-full text-[10px]">
                {pendingCount}
              </span>
            )}
          </button>

          {/* Toggle Expand/Collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white p-1"
            title="Toggle flow stepper bar"
          >
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Quick-Jump Stepper Bar */}
      {!collapsed && (
        <div className="bg-slate-950/90 border-t border-slate-800 px-3 py-1.5 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-1 min-w-max text-[11px]">
            <span className="text-slate-400 font-semibold mr-1">Workflow Steps:</span>
            {demoSteps.map((s) => (
              <button
                key={s.num}
                onClick={() => handleStepClick(s)}
                className="px-2 py-0.5 rounded hover:bg-blue-600/30 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-white transition flex items-center gap-1"
              >
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
