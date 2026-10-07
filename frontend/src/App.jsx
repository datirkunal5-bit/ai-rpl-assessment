import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import DemoBar from './components/common/DemoBar';
import OfflineBanner from './components/common/OfflineBanner';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

// Worker Pages
import WorkerDashboard from './pages/worker/WorkerDashboard';
import WorkerProfilePage from './pages/worker/WorkerProfilePage';
import SelfDeclarationPage from './pages/worker/SelfDeclarationPage';
import SkillAnalysisPage from './pages/worker/SkillAnalysisPage';
import QualificationMatchPage from './pages/worker/QualificationMatchPage';
import AssessmentTasksPage from './pages/worker/AssessmentTasksPage';
import EvidenceUploadPage from './pages/worker/EvidenceUploadPage';
import CompetencyProfileView from './pages/worker/CompetencyProfileView';

// Assessor Pages
import AssessorDashboard from './pages/assessor/AssessorDashboard';
import WorkerDetailReview from './pages/assessor/WorkerDetailReview';
import EvidenceReviewPage from './pages/assessor/EvidenceReviewPage';
import ScoringPage from './pages/assessor/ScoringPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ConsistencyAnalyticsPage from './pages/admin/ConsistencyAnalyticsPage';
import QpNosLibraryPage from './pages/admin/QpNosLibraryPage';
import AuditLogPage from './pages/admin/AuditLogPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OfflineProvider>
          <LanguageProvider>
            <NotificationProvider>
              <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
                {/* Persistent Workflow Quick-Jump Navigator Bar */}
                <DemoBar />

                {/* Offline Mode Banner */}
                <OfflineBanner />

                {/* Main Navigation Header */}
                <Navbar />

                {/* Main Application Body */}
                <main className="flex-grow">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Candidate / Worker Routes */}
                    <Route path="/worker/dashboard" element={<WorkerDashboard />} />
                    <Route path="/worker/profile" element={<WorkerProfilePage />} />
                    <Route path="/worker/self-declaration" element={<SelfDeclarationPage />} />
                    <Route path="/worker/skill-analysis" element={<SkillAnalysisPage />} />
                    <Route path="/worker/qualification-match" element={<QualificationMatchPage />} />
                    <Route path="/worker/assessment" element={<AssessmentTasksPage />} />
                    <Route path="/worker/evidence" element={<EvidenceUploadPage />} />
                    <Route path="/worker/competency-profile" element={<CompetencyProfileView />} />

                    {/* Assessor Console Routes */}
                    <Route path="/assessor/dashboard" element={<AssessorDashboard />} />
                    <Route path="/assessor/assessments/:id" element={<WorkerDetailReview />} />
                    <Route path="/assessor/evidence-review/:id" element={<EvidenceReviewPage />} />
                    <Route path="/assessor/scoring/:id" element={<ScoringPage />} />

                    {/* Admin Directorate Routes */}
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/consistency" element={<ConsistencyAnalyticsPage />} />
                    <Route path="/admin/qp-library" element={<QpNosLibraryPage />} />
                    <Route path="/admin/audit-logs" element={<AuditLogPage />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                {/* Footer with NCVET attribution and disclaimers */}
                <Footer />
              </div>
            </NotificationProvider>
          </LanguageProvider>
        </OfflineProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
