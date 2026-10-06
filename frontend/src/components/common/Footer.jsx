import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Info, CheckCircle2, Award, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto no-print">
      {/* Upper Legal & Human-in-the-Loop Statement */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-900/30 border border-blue-700/40 text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-200 font-semibold text-xs sm:text-sm">
                Human-in-the-Loop Certification Safeguard
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                The AI system supports assessors with skill extraction and evidence cues. The AI does <strong>NOT</strong> independently certify candidates. The final assessment authority rests exclusively with authorized human assessors.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              NCVET NSQF Aligned
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-medium">
              <Info className="w-3.5 h-3.5" />
              Prototype Demo Data
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold font-display text-base mb-2">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            RPL Assist
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            AI-Assisted Recognition of Prior Learning platform designed to formally certify India's informally trained trade workforce across national qualification standards.
          </p>
          <div className="mt-3 text-[10px] text-slate-500">
            Smart India Hackathon 2026 Prototype
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2.5 text-xs uppercase tracking-wider">Candidate Pathways</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li><Link to="/worker/self-declaration" className="hover:text-white transition">Self-Declaration & Experience</Link></li>
            <li><Link to="/worker/skill-analysis" className="hover:text-white transition">AI Skill Extraction</Link></li>
            <li><Link to="/worker/qualification-match" className="hover:text-white transition">QP/NOS Qualification Matching</Link></li>
            <li><Link to="/worker/assessment" className="hover:text-white transition">Practical Assessment Rubric</Link></li>
            <li><Link to="/worker/competency-profile" className="hover:text-white transition">Competency Profile & Report</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2.5 text-xs uppercase tracking-wider">Assessment Authority</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li><Link to="/assessor/dashboard" className="hover:text-white transition">Assessor Console</Link></li>
            <li><Link to="/assessor/assessments/asm-001" className="hover:text-white transition">Candidate Review</Link></li>
            <li><Link to="/assessor/scoring/asm-001" className="hover:text-white transition">Standardized Scoring & Overrides</Link></li>
            <li><Link to="/admin/consistency" className="hover:text-white transition">Consistency Variance Analytics</Link></li>
            <li><Link to="/admin/qp-library" className="hover:text-white transition">NCVET QP/NOS Knowledge Base</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2.5 text-xs uppercase tracking-wider">Official Prototype Notice</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            This platform is an academic & hackathon demonstration prototype. It does not replace official national assessment agencies or the National Council for Vocational Education and Training (NCVET).
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-slate-500">
            Modular Trade Design: Initial trade <strong className="text-amber-400">ELECTRICIAN (ELE/Q1401)</strong>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-[10px] text-slate-500">
        © 2026 RPL Assist • Built for Recognition of Prior Learning (RPL) Assessment • All rights reserved
      </div>
    </footer>
  );
}
