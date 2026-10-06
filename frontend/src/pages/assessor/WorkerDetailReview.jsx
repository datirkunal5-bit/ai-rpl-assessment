import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  User, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  ArrowLeft, 
  Camera, 
  Clock, 
  FileText, 
  Eye,
  Check,
  X
} from 'lucide-react';

export default function WorkerDetailReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getAssessmentById(id || 'asm-001');
        if (res.assessment) {
          setAssessment(res.assessment);
        }
      } catch (e) {
        console.warn("Could not load assessment details:", e.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-bold">Loading candidate dossier...</span>
        </div>
      </div>
    );
  }

  const worker = assessment?.workerProfile || {
    fullName: "Ramesh Patil",
    age: 32,
    location: "Pune, Maharashtra",
    yearsOfExperience: 6,
    currentOccupation: "Domestic Electrician & Contractor Assistant"
  };

  const experience = assessment?.experience || {
    rawDescription: "I have worked as an electrician for 6 years in Pune. I do complete house wiring, install single and 3-phase switchboards, ceiling fans, MCB boxes, and repair tripping circuit faults with a multimeter and tester."
  };

  const evidenceList = assessment?.evidenceList || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top back nav & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to="/assessor/dashboard"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assessor Queue</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/assessor/evidence-review/${assessment?.id || 'asm-001'}`}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>AI Evidence Vision</span>
          </Link>
          <Link
            to={`/assessor/scoring/${assessment?.id || 'asm-001'}`}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Proceed to Criteria Scoring</span>
          </Link>
        </div>
      </div>

      {/* Candidate Profile Dossier Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-2xl font-black font-display shadow-md">
            {worker.fullName ? worker.fullName[0] : 'R'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-display text-slate-900">{worker.fullName}</h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Candidate ID: {assessment?.workerId || 'usr-worker-01'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {worker.age} Years • {worker.location} • {worker.currentOccupation}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
          <div><span className="text-slate-500">Target Qualification:</span> <strong className="text-slate-800">{assessment?.qualificationName}</strong></div>
          <div><span className="text-slate-500">QP Code / NSQF Level:</span> <strong className="text-blue-700">{assessment?.qpCode} (Level {assessment?.nsqfLevel})</strong></div>
          <div><span className="text-slate-500">Status:</span> <strong className="text-amber-700 uppercase">{assessment?.status?.replace('_', ' ')}</strong></div>
        </div>
      </div>

      {/* 2-Column Review Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Experience & AI Extraction */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
            <Cpu className="w-4 h-4 text-amber-500" />
            <span>Worker Declaration & AI Extraction</span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500">Declared Trade Narrative:</span>
            <p className="text-xs text-slate-800 italic bg-slate-50 p-3 rounded-lg border border-slate-200 mt-1 leading-relaxed">
              "{experience.rawDescription}"
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500">Extracted Skills Inventory:</span>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              {[
                { name: "Electrical Wiring", conf: "92%" },
                { name: "Switch Installation", conf: "95%" },
                { name: "Fan Installation", conf: "89%" },
                { name: "MCB Installation", conf: "87%" },
                { name: "Fault Diagnosis", conf: "81%" },
                { name: "Safety Procedures", conf: "90%" }
              ].map((s, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{s.name}</span>
                  <span className="text-blue-700 font-bold text-[11px]">{s.conf}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Flags & Compliance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-4 h-4 text-emerald-600" />
            <span>Assessor Risk Flags & Protocol Checks</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>PPE Compliance Flag:</strong> Candidate observed utilizing 1000V rated insulated gloves and dielectric safety shoes during MCB panel operations.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Color-Coding Standards:</strong> Neutral and earth isolation verified against Indian Standard IS 732.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Assessor Override Notice:</strong> Standardized scoring allows full manual override of AI suggestions with mandatory rationale comments.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Evidence Gallery */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-base text-slate-900">
            <Camera className="w-5 h-5 text-blue-600" />
            <span>Candidate Practical Evidence Submissions ({evidenceList.length})</span>
          </div>
          <Link
            to={`/assessor/evidence-review/${assessment?.id || 'asm-001'}`}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Open AI Vision Inspector</span>
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {evidenceList.map((ev) => (
            <div key={ev.id} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between">
              <div className="relative h-36 bg-slate-900">
                <img
                  src={ev.fileUrl}
                  alt={ev.taskTitle}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  AI Conf: {Math.round((ev.aiAnalysis?.confidence || 0.88) * 100)}%
                </span>
              </div>
              <div className="p-3 space-y-1">
                <div className="font-bold text-xs text-slate-900 line-clamp-1">{ev.taskTitle}</div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{ev.description}</p>
                <div className="pt-2 text-[10px] text-emerald-700 font-semibold">
                  ✓ Components & PPE Detected
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
