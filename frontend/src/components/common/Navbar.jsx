import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import LanguageSelector from './LanguageSelector';
import { 
  Zap, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Shield, 
  CheckCircle, 
  FileText, 
  Award, 
  BarChart3, 
  BookOpen, 
  Camera, 
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isWorker, isAssessor, isAdmin } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-[33px] z-40 shadow-sm no-print">
      {/* Top Government Platform Header Strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-400">NCVET Aligned</span>
            <span className="text-slate-600">|</span>
            <span className="hidden sm:inline">Recognition of Prior Learning (RPL) Evaluation Framework</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-blue-400 font-medium">Trade: Electrician (ELE/Q1401)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-slate-400">Smart India Hackathon 2026 Prototype</span>
            <LanguageSelector compact={true} />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl text-slate-900 tracking-tight">RPL Assist</span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-blue-200">
                  AI + Human Assessor
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                Prior Learning Assessment Platform
              </p>
            </div>
          </Link>

          {/* Desktop Role-Based Navigation */}
          {user && (
            <nav className="hidden lg:flex items-center space-x-1">
              {/* WORKER NAV */}
              {isWorker && (
                <>
                  <Link
                    to="/worker/dashboard"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      isActive('/worker/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/worker/profile"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      isActive('/worker/profile') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/worker/self-declaration"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      isActive('/worker/self-declaration') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Self-Declaration
                  </Link>
                  <Link
                    to="/worker/skill-analysis"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      isActive('/worker/skill-analysis') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Skill Analysis
                  </Link>
                  <Link
                    to="/worker/qualification-match"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      isActive('/worker/qualification-match') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    QP Match
                  </Link>
                  <Link
                    to="/worker/assessment"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      isActive('/worker/assessment') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Practical Tasks
                  </Link>
                  <Link
                    to="/worker/evidence"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      isActive('/worker/evidence') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Evidence
                  </Link>
                  <Link
                    to="/worker/competency-profile"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      isActive('/worker/competency-profile') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Competency Profile
                  </Link>
                </>
              )}

              {/* ASSESSOR NAV */}
              {isAssessor && (
                <>
                  <Link
                    to="/assessor/dashboard"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      isActive('/assessor/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/assessor/assessments/asm-001"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      location.pathname.includes('/assessor/assessments') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Worker Detail & Review
                  </Link>
                  <Link
                    to="/assessor/evidence-review/asm-001"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      location.pathname.includes('/assessor/evidence-review') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    AI Evidence Vision
                  </Link>
                  <Link
                    to="/assessor/scoring/asm-001"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      location.pathname.includes('/assessor/scoring') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Standardized Scoring
                  </Link>
                  <Link
                    to="/admin/consistency"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      isActive('/admin/consistency') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Consistency Analytics
                  </Link>
                </>
              )}

              {/* ADMIN NAV */}
              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      isActive('/admin/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/consistency"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      isActive('/admin/consistency') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Assessor Consistency
                  </Link>
                  <Link
                    to="/admin/qp-library"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      isActive('/admin/qp-library') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    QP/NOS Library
                  </Link>
                  <Link
                    to="/admin/audit-logs"
                    className={`px-3 py-2 rounded-md text-xs font-semibold transition ${
                      isActive('/admin/audit-logs') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Audit Logs
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* Right Action Icons (Notifications + Profile/Login) */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 relative transition"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Popover */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 p-3 z-50">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="font-bold text-xs text-slate-800">Notifications ({notifications.length})</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-[11px] text-blue-600 hover:underline font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 my-1">
                        {notifications.length === 0 ? (
                          <div className="py-4 text-center text-xs text-slate-400">No notifications</div>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markRead(n.id);
                                if (n.link) {
                                  navigate(n.link);
                                  setShowNotifications(false);
                                }
                              }}
                              className={`p-2 text-xs rounded cursor-pointer transition hover:bg-slate-50 ${
                                !n.read ? 'bg-blue-50/50 font-medium' : 'text-slate-600'
                              }`}
                            >
                              <div className="font-semibold text-slate-800">{n.title}</div>
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Capsule */}
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm">
                    {user.name ? user.name[0] : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 leading-none">{user.name}</p>
                    <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-2 p-1.5 text-slate-400 hover:text-red-600 rounded transition"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-md shadow-sm transition"
                >
                  Portal Login
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-2 pb-4 space-y-1">
          {user ? (
            <>
              <div className="p-3 bg-slate-50 rounded-lg mb-2 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900">{user.name}</div>
                  <div className="text-xs text-blue-700 uppercase font-semibold">{user.role} Portal</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-600 font-semibold px-2 py-1 bg-red-50 rounded"
                >
                  Logout
                </button>
              </div>

              {isWorker && (
                <>
                  <Link onClick={() => setMobileMenuOpen(false)} to="/worker/dashboard" className="block px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">Worker Dashboard</Link>
                  <Link onClick={() => setMobileMenuOpen(false)} to="/worker/self-declaration" className="block px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">Self-Declaration</Link>
                  <Link onClick={() => setMobileMenuOpen(false)} to="/worker/skill-analysis" className="block px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">AI Skill Analysis</Link>
                  <Link onClick={() => setMobileMenuOpen(false)} to="/worker/qualification-match" className="block px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">QP/NOS Match</Link>
                  <Link onClick={() => setMobileMenuOpen(false)} to="/worker/assessment" className="block px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">Assessment Tasks</Link>
                  <Link onClick={() => setMobileMenuOpen(false)} to="/worker/evidence" className="block px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">Evidence Upload</Link>
                  <Link onClick={() => setMobileMenuOpen(false)} to="/worker/competency-profile" className="block px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">Competency Profile</Link>
                </>
              )}

              {isAssessor && (
                <>
                  <Link onClick={() => setMobileMenuOpen(false)} to="/assessor/dashboard" className="block px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">Assessor Dashboard</Link>
                  <Link onClick={() => setMobileMenuOpen(false)} to="/assessor/assessments/asm-001" className="block px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">Candidate Evaluation</Link>
                  <Link onClick={() => setMobileMenuOpen(false)} to="/assessor/scoring/asm-001" className="block px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">Standardized Scoring</Link>
                  <Link onClick={() => setMobileMenuOpen(false)} to="/admin/consistency" className="block px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">Consistency Analytics</Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link onClick={() => setMobileMenuOpen(false)} to="/admin/dashboard" className="block px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">Admin Dashboard</Link>
                  <Link onClick={() => setMobileMenuOpen(false)} to="/admin/consistency" className="block px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">Assessor Consistency</Link>
                  <Link onClick={() => setMobileMenuOpen(false)} to="/admin/qp-library" className="block px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">QP/NOS Library</Link>
                  <Link onClick={() => setMobileMenuOpen(false)} to="/admin/audit-logs" className="block px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-100">Audit Logs</Link>
                </>
              )}
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                onClick={() => setMobileMenuOpen(false)}
                to="/login"
                className="block text-center bg-blue-600 text-white font-bold py-2 rounded-md"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
