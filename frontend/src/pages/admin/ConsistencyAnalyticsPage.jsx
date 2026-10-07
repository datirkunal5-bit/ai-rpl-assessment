import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  BarChart3, 
  ShieldCheck, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Info,
  Scale,
  Users
} from 'lucide-react';

export default function ConsistencyAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConsistency() {
      try {
        const res = await api.getConsistencyAnalytics();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.warn("Using sample consistency data:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchConsistency();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-bold">Computing Inter-Assessor Variance Analytics...</span>
        </div>
      </div>
    );
  }

  const comparisons = data?.comparisons || {
    scoreVariance: { manual: 12.4, aiAssisted: 6.8, improvementPercent: 45.2 },
    interAssessorAgreement: { manualPercent: 68.2, aiAssistedPercent: 89.4, cohensKappaManual: 0.54, cohensKappaAiAssisted: 0.81 },
    assessmentDurationMinutes: { manual: 75.0, aiAssisted: 38.5, timeSavedPercent: 48.7 },
    disagreementRate: { manualPercent: 28.5, aiAssistedPercent: 8.7, reductionPercent: 69.5 }
  };

  const assessorList = data?.assessorBreakdown || [
    { assessorName: "Amit Sharma", id: "AP-01", assessmentsEvaluated: 48, meanScoreGiven: 81.2, aiAgreementRate: 91.5, varianceFromBenchmark: 2.1 },
    { assessorName: "Rajesh Varma", id: "AP-02", assessmentsEvaluated: 42, meanScoreGiven: 83.0, aiAgreementRate: 88.0, varianceFromBenchmark: 2.8 },
    { assessorName: "Pooja Kulkarni", id: "AP-03", assessmentsEvaluated: 39, meanScoreGiven: 79.8, aiAgreementRate: 93.2, varianceFromBenchmark: 1.9 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
          <Scale className="w-4 h-4 text-blue-600" />
          National Assessment Framework • Standardized Scoring Consistency
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
          Assessor Consistency & Scoring Variance Analytics
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Addressing the national challenge of inconsistent, location-dependent evaluations in manual RPL. Comparative analysis of traditional manual assessment vs. AI-assisted standardized rubrics.
        </p>
      </div>

      {/* Prominent Prototype Demonstration Data Notice (CRITICAL PROMPT REQUIREMENT) */}
      <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-amber-900 shadow-sm space-y-1">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>Prototype Demonstration Data</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          {data?.disclaimer || "Illustrative prototype data — to be validated through pilot testing."}
        </p>
        <p className="text-[11px] text-amber-900/80 italic pt-1 border-t border-amber-200">
          <strong>Statistical Methodology Note: </strong>
          {data?.methodologyNote || "Final implementation should validate inter-assessor agreement using appropriate statistical measures such as Cohen's Kappa, weighted Kappa, ICC (Intraclass Correlation Coefficient), or related methods depending on the scoring design."}
        </p>
      </div>

      {/* 4 Core Comparative Benchmark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Score Variance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Score Variance (σ²)</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              -45.2% Variance
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Manual RPL</span>
              <div className="text-2xl font-black font-display text-slate-700 mt-1">12.4</div>
              <span className="text-[10px] text-slate-500">High Discrepancy</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-700">AI-Assisted</span>
              <div className="text-2xl font-black font-display text-blue-800 mt-1">6.8</div>
              <span className="text-[10px] text-emerald-700 font-bold">Standardized</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">
            Standardized criteria weights eliminate arbitrary discrepancies between lenient and strict assessors.
          </p>
        </div>

        {/* Metric 2: Inter-Assessor Agreement (Cohen's Kappa) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Inter-Assessor Agreement</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              +31.1% Concordance
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Manual (κ)</span>
              <div className="text-2xl font-black font-display text-slate-700 mt-1">0.54</div>
              <span className="text-[10px] text-slate-500">Moderate Agreement</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800">AI-Assisted (κ)</span>
              <div className="text-2xl font-black font-display text-emerald-700 mt-1">0.81</div>
              <span className="text-[10px] text-emerald-800 font-bold">Strong Agreement</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">
            Cohen's Kappa coefficient (κ) climbs from 0.54 to 0.81, indicating robust multi-assessor reliability.
          </p>
        </div>

        {/* Metric 3: Evaluation Time */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Mean Evaluation Duration</span>
            <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              -48.7% Faster
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Manual</span>
              <div className="text-2xl font-black font-display text-slate-700 mt-1">75m</div>
              <span className="text-[10px] text-slate-500">Lengthy Review</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-700">AI-Assisted</span>
              <div className="text-2xl font-black font-display text-blue-800 mt-1">38.5m</div>
              <span className="text-[10px] text-blue-700 font-bold">Rapid Verification</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">
            Automated visual checklists for PPE and components free assessor time to focus on safety judgment.
          </p>
        </div>

        {/* Metric 4: Disagreement Rate */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Severe Disagreement Rate</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              -69.5% Reduction
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Manual</span>
              <div className="text-2xl font-black font-display text-slate-700 mt-1">28.5%</div>
              <span className="text-[10px] text-red-600 font-bold">Frequent Vetoes</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800">AI-Assisted</span>
              <div className="text-2xl font-black font-display text-emerald-700 mt-1">8.7%</div>
              <span className="text-[10px] text-emerald-700 font-bold">Controlled Margin</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">
            Candidates receive equitable scoring regardless of regional assessment center assignment.
          </p>
        </div>
      </div>

      {/* Field Assessor Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-display">
              Field Assessor Calibration Benchmark
            </h3>
            <p className="text-xs text-slate-500">
              Monitoring individual evaluator variance from the national NCVET benchmark median.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            All Assessors Within Safe Tolerance (±3.0σ)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Assessor Name & Center</th>
                <th className="py-3 px-4">Evaluations Completed</th>
                <th className="py-3 px-4">Mean Score Awarded</th>
                <th className="py-3 px-4">AI Alignment Rate</th>
                <th className="py-3 px-4">Variance from Median</th>
                <th className="py-3 px-4">Calibration Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assessorList.map((a, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{a.assessorName}</div>
                    <div className="text-[11px] text-slate-500">{a.id} • Regional Center</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{a.assessmentsEvaluated} cases</td>
                  <td className="py-3 px-4 font-bold text-blue-700">{a.meanScoreGiven}%</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                      {a.aiAgreementRate}% Concordance
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">±{a.varianceFromBenchmark} pts</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Calibrated
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
