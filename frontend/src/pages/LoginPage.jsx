import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, ShieldCheck, User, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password, role);
      if (res.success) {
        if (res.user.role === 'worker') navigate('/worker/dashboard');
        else if (res.user.role === 'assessor') navigate('/assessor/dashboard');
        else if (res.user.role === 'admin') navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (selectedRole) => {
    setError('');
    setLoading(true);
    try {
      const res = await demoLogin(selectedRole);
      if (res.success) {
        if (selectedRole === 'worker') navigate('/worker/dashboard');
        else if (selectedRole === 'assessor') navigate('/assessor/dashboard');
        else if (selectedRole === 'admin') navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-3">
          <img src="/logo.png" alt="MargVedha Logo" className="h-16 w-auto object-contain" />
        </div>
        <h2 className="text-2xl font-black font-display text-slate-900 tracking-tight">
          MargVedha Access Portal
        </h2>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Recognition of Prior Learning (RPL) Assessment & Certification Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Quick 1-Click Demo Accounts Card */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-xl p-5 mb-5 text-white shadow-lg border border-blue-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              One-Click Demo & Evaluation Login
            </h3>
          </div>
          <p className="text-[11px] text-slate-300 mb-3">
            Click any demo profile to bypass manual typing and start testing immediately:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('worker')}
              disabled={loading}
              className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 p-2.5 rounded-lg text-left transition flex flex-col justify-between"
            >
              <span className="text-[10px] text-amber-400 font-bold uppercase">Candidate</span>
              <span className="text-xs font-bold text-white mt-1">Ramesh Patil</span>
              <span className="text-[10px] text-slate-300">6y Electrician</span>
            </button>

            <button
              onClick={() => handleDemoLogin('assessor')}
              disabled={loading}
              className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-blue-200 p-2.5 rounded-lg text-left transition flex flex-col justify-between"
            >
              <span className="text-[10px] text-blue-300 font-bold uppercase">Assessor</span>
              <span className="text-xs font-bold text-white mt-1">Amit Sharma</span>
              <span className="text-[10px] text-slate-300">Lead Assessor</span>
            </button>

            <button
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 p-2.5 rounded-lg text-left transition flex flex-col justify-between"
            >
              <span className="text-[10px] text-emerald-300 font-bold uppercase">Directorate</span>
              <span className="text-xs font-bold text-white mt-1">Admin User</span>
              <span className="text-[10px] text-slate-300">Audits & Stats</span>
            </button>
          </div>
        </div>

        {/* Regular Credentials Login Form */}
        <div className="bg-white py-8 px-6 shadow-md rounded-xl sm:px-10 border border-slate-200">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Role Radio Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Your Access Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'worker', label: 'Worker' },
                  { id: 'assessor', label: 'Assessor' },
                  { id: 'admin', label: 'Admin' }
                ].map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition ${
                      role === r.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === 'worker' ? 'worker@rplassist.gov.in' :
                    role === 'assessor' ? 'assessor@rplassist.gov.in' :
                    'admin@rplassist.gov.in'
                  }
                  required
                  className="w-full pl-3 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-3 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <span className="text-xs text-slate-500">Need a new worker profile? </span>
            <button
              type="button"
              onClick={() => {
                setEmail('new.worker@example.com');
                setPassword('worker123');
                setRole('worker');
              }}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              Pre-fill registration form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
