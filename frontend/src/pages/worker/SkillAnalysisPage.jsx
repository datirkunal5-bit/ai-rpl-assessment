import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { 
  Cpu, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  Layers, 
  Wrench, 
  Clock, 
  Globe 
} from 'lucide-react';

export default function SkillAnalysisPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [detectedTools, setDetectedTools] = useState([]);
  const [yearsDetected, setYearsDetected] = useState(6);
  const [languageDetected, setLanguageDetected] = useState('en');
  const [originalStatement, setOriginalStatement] = useState('');
  const [newSkillName, setNewSkillName] = useState('');

  useEffect(() => {
    async function fetchSkills() {
      try {
        const expRes = await api.getWorkerExperience();
        const rawText = expRes.experience?.rawDescription || 
          "I have worked as an electrician for 6 years in Pune. I do complete house wiring, install single and 3-phase switchboards, ceiling fans, MCB boxes, and repair tripping circuit faults with a multimeter and tester.";
        setOriginalStatement(rawText);

        const aiRes = await api.extractSkills({
          experienceText: rawText,
          tasksPerformed: expRes.experience?.tasksPerformed || [],
          toolsUsed: expRes.experience?.toolsUsed || [],
          yearsDeclared: expRes.experience?.yearsOfExperience || 6
        });

        if (aiRes.skills) {
          setExtractedSkills(aiRes.skills);
          setDetectedTools(aiRes.tools || []);
          setYearsDetected(aiRes.yearsOfExperience || 6);
          setLanguageDetected(aiRes.languageDetected || 'en');
        }
      } catch (err) {
        console.warn("Using fallback skill extraction results:", err.message);
        setExtractedSkills([
          { id: "sk-1", name: "Electrical Wiring", category: "Core Electrical", confidence: 0.92, confirmedByWorker: true },
          { id: "sk-2", name: "Switch Installation", category: "Installation & Fixtures", confidence: 0.95, confirmedByWorker: true },
          { id: "sk-3", name: "Fan Installation", category: "Installation & Fixtures", confidence: 0.89, confirmedByWorker: true },
          { id: "sk-4", name: "MCB Installation", category: "Protection & Distribution", confidence: 0.87, confirmedByWorker: true },
          { id: "sk-5", name: "Fault Diagnosis", category: "Troubleshooting", confidence: 0.81, confirmedByWorker: true },
          { id: "sk-6", name: "Safety Procedures", category: "Occupational Safety", confidence: 0.90, confirmedByWorker: true }
        ]);
        setDetectedTools(["Neon Phase Tester", "Digital Multimeter", "Combination Pliers", "Insulated Screwdriver Set"]);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  const handleRemoveSkill = (id) => {
    setExtractedSkills(prev => prev.filter(s => s.id !== id));
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const newSkill = {
      id: `sk-custom-${Date.now()}`,
      name: newSkillName.trim(),
      category: "Worker Added",
      confidence: 1.0,
      confirmedByWorker: true
    };
    setExtractedSkills([...extractedSkills, newSkill]);
    setNewSkillName('');
  };

  const handleConfirmAndProceed = () => {
    navigate('/worker/qualification-match', {
      state: { confirmedSkills: extractedSkills.map(s => s.name) }
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-600 font-bold">Synthesizing Practical Skill Inventory...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Core Step 3 • AI Skill Extraction Engine
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-2">
          {t('aiExtractedSkills')}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Review the competencies extracted from your declared experience. You may add or remove any skill before qualification matching.
        </p>
      </div>

      {/* Prominent Mandatory Human-in-the-Loop Banner */}
      <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-amber-900 shadow-sm flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-sm">
            {t('aiSuggestionNotice')}
          </h3>
          <p className="text-xs text-amber-800 mt-0.5">
            The extracted skills below represent an automated AI parsing recommendation. You must confirm and verify that these reflect your true hands-on capability.
          </p>
        </div>
      </div>

      {/* Original Declaration Quote Card */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Worker Original Experience Statement
          </span>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {yearsDetected} yrs detected</span>
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Dialect: {languageDetected.toUpperCase()}</span>
          </div>
        </div>
        <p className="text-sm text-slate-100 italic leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          "{originalStatement || "I have worked as an electrician for 6 years in Pune. I do complete house wiring, install single and 3-phase switchboards, ceiling fans, MCB boxes, and repair tripping circuit faults with a multimeter and tester."}"
        </p>

        {/* Tools detected pill rack */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5 text-blue-400" /> Detected Tools:
          </span>
          {detectedTools.map((t, idx) => (
            <span key={idx} className="bg-slate-800 text-blue-300 text-xs px-2.5 py-1 rounded-md border border-slate-700">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Extracted Skills List */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Identified Competencies ({extractedSkills.length})
          </h2>
          <span className="text-xs text-slate-500">
            Click 'Remove' if you do not perform a task
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {extractedSkills.map((sk) => {
            const pct = Math.round(sk.confidence * 100);
            return (
              <div
                key={sk.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {sk.category || 'Core Skill'}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1">
                      {sk.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(sk.id)}
                    className="text-slate-400 hover:text-red-600 p-1 rounded transition"
                    title={t('removeSkill')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Confidence Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">{t('confidence')}</span>
                    <span className="font-extrabold text-blue-700">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 90 ? 'bg-emerald-500' : pct >= 80 ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add custom skill inline */}
        <form onSubmit={handleAddCustomSkill} className="pt-4 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Add another skill you possess (e.g. Inverter Wiring, Submersible Motor Repair)"
            className="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('addCustomSkill')}</span>
          </button>
        </form>

        {/* Action Button */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            All skills confirmed will be mapped against NCVET QP/NOS database.
          </span>
          <button
            onClick={handleConfirmAndProceed}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
          >
            <span>{t('confirmSkills')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
