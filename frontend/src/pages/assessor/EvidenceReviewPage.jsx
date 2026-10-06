import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  AlertTriangle, 
  ArrowLeft, 
  Save, 
  Check, 
  Sliders
} from 'lucide-react';

export default function EvidenceReviewPage() {
  const { id } = useParams();
  const [evidenceList, setEvidenceList] = useState([]);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState(null);
  const [assessorNotes, setAssessorNotes] = useState('');
  const [status, setStatus] = useState('accepted');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getAssessmentById(id || 'asm-001');
        if (res.assessment && res.assessment.evidenceList) {
          setEvidenceList(res.assessment.evidenceList);
          if (res.assessment.evidenceList.length > 0) {
            const first = res.assessment.evidenceList[0];
            setSelectedEvidenceId(first.id);
            setStatus(first.aiAnalysis?.assessorStatus || 'accepted');
            setAssessorNotes(first.aiAnalysis?.assessorObservations || first.aiAnalysis?.observations || '');
          }
        }
      } catch (e) {
        console.warn("Could not load evidence:", e.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const activeEvidence = evidenceList.find(e => e.id === selectedEvidenceId) || evidenceList[0];

  const handleSaveAssessorDecision = async () => {
    if (!activeEvidence) return;
    try {
      await api.reviewEvidence(activeEvidence.id, {
        status,
        assessorObservations: assessorNotes
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert("Failed to save evidence decision: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-bold">Loading Evidence Inspection console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header & Back */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to={`/assessor/assessments/${id || 'asm-001'}`}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Candidate Detail</span>
        </Link>

        <Link
          to={`/assessor/scoring/${id || 'asm-001'}`}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Go to Standardized Scoring</span>
        </Link>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Core Step 7 • Assessor Evidence Verification & AI Vision
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-2">
          Practical Evidence Inspection Console
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Review candidate photographs and video proof. Validate AI computer-vision observations and apply your official human verdict.
        </p>
      </div>

      {/* Prominent Mandatory Human-in-the-Loop Protocol */}
      <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-amber-900 shadow-sm flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-sm">
            AI Assistance Only — Human Assessor Has Final Decision
          </h3>
          <p className="text-xs text-amber-800 mt-0.5">
            AI bounding boxes and component detection cues are advisory suggestions designed to speed up verification. You possess complete authority to accept, modify, or reject any observation.
          </p>
        </div>
      </div>

      {/* Evidence Carousel / Selector tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {evidenceList.map((ev, idx) => (
          <button
            key={ev.id}
            onClick={() => {
              setSelectedEvidenceId(ev.id);
              setStatus(ev.aiAnalysis?.assessorStatus || 'accepted');
              setAssessorNotes(ev.aiAnalysis?.assessorObservations || ev.aiAnalysis?.observations || '');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedEvidenceId === ev.id
                ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Proof {idx + 1}: {ev.taskTitle?.split(':')[1] || ev.taskTitle}
          </button>
        ))}
      </div>

      {/* Active Evidence Side-by-Side Review Grid */}
      {activeEvidence && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Canvas & Metadata */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-sm text-slate-900">{activeEvidence.taskTitle}</h2>
              <span className="text-[11px] text-slate-500 font-mono">
                {new Date(activeEvidence.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-200 min-h-[340px] flex items-center justify-center">
              <img
                src={activeEvidence.fileUrl}
                alt={activeEvidence.taskTitle}
                className="w-full h-auto max-h-[460px] object-contain"
              />
              {/* Simulated Computer Vision Overlays */}
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>AI Vision: Component & PPE Detection Active</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900">Candidate Submission Note: </span>
              {activeEvidence.description}
            </p>
          </div>

          {/* Right Column: AI Suggestions & Assessor Verdict */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Computer Vision Suggestions</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Confidence: {Math.round((activeEvidence.aiAnalysis?.confidence || 0.88) * 100)}%
              </span>
            </div>

            {/* Checklist items */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                <span>✓ Required component appears visible</span>
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                <span>✓ Safety equipment / PPE appears visible</span>
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                <span>✓ Task work area detected</span>
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* AI Detected Components */}
            <div>
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Identified Elements
              </span>
              <div className="flex flex-wrap gap-1">
                {(activeEvidence.aiAnalysis?.detectedComponents || []).map((c, i) => (
                  <span key={i} className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Assessor Action Controls (Accept / Reject / Modify) */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Assessor Determination:
              </h3>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('accepted')}
                  className={`p-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 border ${
                    status === 'accepted'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Accept AI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('modified')}
                  className={`p-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 border ${
                    status === 'modified'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modify</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('rejected')}
                  className={`p-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 border ${
                    status === 'rejected'
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assessor Evaluation Note & Observations
                </label>
                <textarea
                  rows="3"
                  value={assessorNotes}
                  onChange={(e) => setAssessorNotes(e.target.value)}
                  placeholder="Record your observations or reasoning for override..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {savedSuccess && (
                <div className="p-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
                  ✓ Assessor verdict saved to permanent audit log!
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveAssessorDecision}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Assessor Determination</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
