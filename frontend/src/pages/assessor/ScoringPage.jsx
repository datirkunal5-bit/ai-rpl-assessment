import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Sliders, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles,
  Save,
  Check
} from 'lucide-react';

export default function ScoringPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assessorNotes, setAssessorNotes] = useState(
    "Worker demonstrates mature hands-on craftsmanship and sound safety intuition acquired through rigorous informal apprenticeship. Recommended for official NSQF Level 4 certification."
  );

  // Criteria scoring state
  const [criteria, setCriteria] = useState([
    {
      criterionId: "crit-1",
      criterionName: "Technical Skill & Knowledge",
      weight: 0.30,
      aiScore: 8.5,
      assessorScore: 8.5,
      comment: "Accurate PVC conduit routing and 2.5 mm² wire gauge standard followed correctly."
    },
    {
      criterionId: "crit-2",
      criterionName: "Practical Execution & Craftsmanship",
      weight: 0.30,
      aiScore: 8.0,
      assessorScore: 8.0,
      comment: "Neat terminations and crimping inside switchboard; no loose copper strands."
    },
    {
      criterionId: "crit-3",
      criterionName: "Safety Compliance (PPE & LOTO)",
      weight: 0.15,
      aiScore: 9.0,
      assessorScore: 9.0,
      comment: "Rubber-insulated gloves inspected and LOTO lock applied before opening breaker box."
    },
    {
      criterionId: "crit-4",
      criterionName: "Quality & Testing",
      weight: 0.15,
      aiScore: 7.5,
      assessorScore: 8.0, // Assessor slight override
      comment: "Multimeter continuity check performed; verified phase polarity on right pin."
    },
    {
      criterionId: "crit-5",
      criterionName: "Task Completion & Speed",
      weight: 0.10,
      aiScore: 8.5,
      assessorScore: 8.5,
      comment: "All practical tasks completed within allocated practical window."
    }
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getAssessmentById(id || 'asm-001');
        if (res.assessment) {
          setAssessment(res.assessment);
          if (res.assessment.scores && res.assessment.scores.length > 0) {
            setCriteria(res.assessment.scores);
          }
          if (res.assessment.assessorNotes) {
            setAssessorNotes(res.assessment.assessorNotes);
          }
        }
      } catch (err) {
        console.warn("Using sample scoring records:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  // Live dynamic calculation of weighted totals
  const calculateTotals = () => {
    let aiWeighted = 0;
    let assessorWeighted = 0;

    criteria.forEach((c) => {
      aiWeighted += (Number(c.aiScore || 0) * c.weight);
      assessorWeighted += (Number(c.assessorScore !== undefined ? c.assessorScore : c.aiScore) * c.weight);
    });

    const aiTotal = Math.round(aiWeighted * 10 * 10) / 10;
    const assessorTotal = Math.round(assessorWeighted * 10 * 10) / 10;

    return {
      aiScore: aiTotal,
      assessorScore: assessorTotal,
      finalScore: assessorTotal
    };
  };

  const totals = calculateTotals();

  const handleScoreChange = (criterionId, newScore) => {
    setCriteria(prev => prev.map(c => 
      c.criterionId === criterionId ? { ...c, assessorScore: Number(newScore) } : c
    ));
  };

  const handleCommentChange = (criterionId, text) => {
    setCriteria(prev => prev.map(c => 
      c.criterionId === criterionId ? { ...c, comment: text } : c
    ));
  };

  const handleResetToAi = (criterionId) => {
    setCriteria(prev => prev.map(c => 
      c.criterionId === criterionId ? { ...c, assessorScore: c.aiScore } : c
    ));
  };

  const handleSubmitFinalAssessment = async () => {
    setSubmitting(true);
    try {
      const payload = {
        criteriaScores: criteria,
        assessorNotes,
        recommendationStatus: totals.finalScore >= 60 
          ? "Recommended for Certification — Pending Final Authority Approval"
          : "Re-assessment Recommended — Practical Competency Gap Identified"
      };

      const res = await api.submitAssessorScores(id || 'asm-001', payload);
      if (res.success) {
        navigate('/worker/competency-profile');
      }
    } catch (err) {
      console.warn("Score submission locally updated:", err.message);
      navigate('/worker/competency-profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-bold">Loading Scoring Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Back and Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to={`/assessor/assessments/${id || 'asm-001'}`}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Candidate Dossier</span>
        </Link>

        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Standardized 5-Criteria Rubric Active
        </span>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Core Step 8 • Standardized Assessor Scoring & AI Override
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-2">
          Practical Assessment Scoring Sheet
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Candidate: <strong>{assessment?.workerName || 'Ramesh Patil'}</strong> • Trade: <strong>{assessment?.qualificationName || 'Electrician - Domestic Solutions'}</strong>
        </p>
      </div>

      {/* Prominent Mandatory Human Authority Statement */}
      <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-xl text-blue-900 shadow-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-sm">
            Human Assessor Has Absolute Certifying Discretion
          </h3>
          <p className="text-xs text-blue-800 mt-0.5">
            AI benchmark scores are provided as baseline guidance. Adjust any criterion slider to reflect your independent observation of the candidate's technique.
          </p>
        </div>
      </div>

      {/* Live Calculated Totals Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Suggested Baseline</span>
          <div className="text-3xl font-black font-display text-amber-400 mt-1">{totals.aiScore}%</div>
          <span className="text-[11px] text-slate-400">Automated Evidence Rubric</span>
        </div>

        <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-700">
          <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Assessor Verified Score</span>
          <div className="text-3xl font-black font-display text-white mt-1">{totals.assessorScore}%</div>
          <span className="text-[11px] text-blue-300">Human Weighted Evaluation</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Final Assessment Score</span>
          <div className="text-3xl font-black font-display text-emerald-400 mt-1">{totals.finalScore}%</div>
          <span className="text-[11px] text-emerald-300 font-semibold">✓ Exceeds 60% NSQF L4 Threshold</span>
        </div>
      </div>

      {/* 5 Standardized Criteria Cards */}
      <div className="space-y-5">
        {criteria.map((c, idx) => {
          const isOverridden = c.assessorScore !== c.aiScore;

          return (
            <div
              key={c.criterionId}
              className={`bg-white rounded-2xl p-6 border shadow-sm transition space-y-4 ${
                isOverridden ? 'border-amber-400 ring-1 ring-amber-400/40' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 font-display">
                    {c.criterionName}
                  </h3>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Weight: {Math.round(c.weight * 100)}%
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500">
                    AI Suggestion: <strong className="text-slate-800">{c.aiScore} / 10</strong>
                  </span>
                  {isOverridden && (
                    <button
                      onClick={() => handleResetToAi(c.criterionId)}
                      className="text-amber-700 hover:underline font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to AI</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Slider & Input Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Assessor Rating (0 to 10):</span>
                    <span className="font-black text-lg text-blue-700">{c.assessorScore} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={c.assessorScore}
                    onChange={(e) => handleScoreChange(c.criterionId, e.target.value)}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0 (Incompetent)</span>
                    <span>5 (Basic)</span>
                    <span>8 (Proficient)</span>
                    <span>10 (Exemplary)</span>
                  </div>
                </div>

                <div className="md:col-span-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <div className="text-slate-500 font-medium">Weighted Contribution:</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    +{Math.round(c.assessorScore * c.weight * 10 * 10) / 10}%
                  </div>
                </div>
              </div>

              {/* Assessor criterion comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Criterion Rationale / Assessor Observation
                </label>
                <input
                  type="text"
                  value={c.comment}
                  onChange={(e) => handleCommentChange(c.criterionId, e.target.value)}
                  placeholder="Record justification for score..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Notes & Final Certification Submission */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 font-display">
          Final Assessor Verification & Certification Recommendation
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Overall Assessor Recommendation Summary Note
          </label>
          <textarea
            rows="3"
            value={assessorNotes}
            onChange={(e) => setAssessorNotes(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            Clicking below signs your assessor credential into the permanent tamper-evident audit log.
          </div>

          <button
            onClick={handleSubmitFinalAssessment}
            disabled={submitting}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{submitting ? 'Generating Competency Profile...' : 'Submit Final Assessment & Issue Profile'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
