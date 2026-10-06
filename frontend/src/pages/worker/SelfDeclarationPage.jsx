import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useOffline } from '../../context/OfflineContext';
import { api } from '../../services/api';
import { 
  Wrench, 
  CheckSquare, 
  Mic, 
  MicOff, 
  Cpu, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  HelpCircle,
  Sparkles,
  Zap
} from 'lucide-react';

export default function SelfDeclarationPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { isOnline, enqueueAction } = useOffline();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Form State
  const [yearsOfExperience, setYearsOfExperience] = useState(6);
  const [learningType, setLearningType] = useState('Informal Apprenticeship under Senior Electrician / Ustad');
  const [previousWorkplaces, setPreviousWorkplaces] = useState('Subhash Electricals, Katraj; Shanti Apartments Society Maintenance');
  
  const [tasksPerformed, setTasksPerformed] = useState([
    'Electrical wiring',
    'Switch installation',
    'Fan installation',
    'MCB installation',
    'Socket installation',
    'Fault diagnosis',
    'Electrical maintenance',
    'Safety procedures'
  ]);

  const [rawDescription, setRawDescription] = useState(
    "I have worked as an electrician for 6 years in Pune. I do complete house wiring, install single and 3-phase switchboards, ceiling fans, MCB boxes, and repair tripping circuit faults with a multimeter and tester."
  );

  const [toolsUsed, setToolsUsed] = useState([
    'Neon Phase Tester',
    'Digital Multimeter',
    'Insulated Screwdriver Set',
    'Wire Stripper & Cutter',
    'Combination Pliers',
    'Hammer Drill Machine',
    'Insulation Tape'
  ]);

  const allAvailableTasks = [
    { id: 't1', label: 'Electrical wiring (Conduit, Surface & Concealed)' },
    { id: 't2', label: 'Switch installation (Modular & Non-Modular)' },
    { id: 't3', label: 'Fan installation (Ceiling fans, Regulators & Exhausts)' },
    { id: 't4', label: 'MCB installation (Distribution Box & Isolators)' },
    { id: 't5', label: 'Socket installation (6A & 16A Power Sockets)' },
    { id: 't6', label: 'Fault diagnosis (Circuit tripping & Short circuits)' },
    { id: 't7', label: 'Electrical maintenance & Earthing verification' },
    { id: 't8', label: 'Safety procedures (PPE, LOTO & Shock protocols)' }
  ];

  const allAvailableTools = [
    'Neon Phase Tester',
    'Digital Multimeter',
    'Insulated Screwdriver Set',
    'Wire Stripper & Cutter',
    'Combination Pliers',
    'Hammer Drill Machine',
    'PVC Conduit Bender',
    'Insulation Tape'
  ];

  const toggleTask = (label) => {
    setTasksPerformed(prev => 
      prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]
    );
  };

  const toggleTool = (tool) => {
    setToolsUsed(prev => 
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setRawDescription(
        "I have worked as an electrician for 6 years in Pune. I do complete house wiring, install single and 3-phase switchboards, ceiling fans, MCB boxes, and repair tripping circuit faults with a multimeter and tester."
      );
    }, 2000);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = {
      yearsOfExperience,
      learningType,
      previousWorkplaces,
      tasksPerformed,
      rawDescription,
      toolsUsed,
      language
    };

    try {
      if (!isOnline) {
        // Enqueue offline
        enqueueAction('SYNC_EXPERIENCE', {
          workerId: user?.id,
          ...payload
        });
        setTimeout(() => {
          setSubmitting(false);
          navigate('/worker/skill-analysis');
        }, 1200);
        return;
      }

      const res = await api.submitWorkerExperience(payload);
      if (res.success) {
        // Artificial short pause to show visual AI processing state
        setTimeout(() => {
          setSubmitting(false);
          navigate('/worker/skill-analysis');
        }, 1000);
      }
    } catch (err) {
      console.warn("Submission error, proceeding locally:", err.message);
      setSubmitting(false);
      navigate('/worker/skill-analysis');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Core Step 2 • Worker Self-Declaration
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-2">
          {t('declareExperience')}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Tell us about your informal electrical trade practice so our AI engine can map your competencies to NCVET standards.
        </p>
      </div>

      {/* Stepper Dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === s
                ? 'bg-blue-700 text-white shadow-md scale-110'
                : step > s
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {step > s ? <Check className="w-4 h-4" /> : s}
          </div>
        ))}
      </div>

      {/* Card Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        {/* STEP 1: Experience & Origin */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              {t('step1Title')}
            </h2>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                {t('yearsExpLabel')}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-xl font-extrabold text-blue-700 w-16 text-center">
                  {yearsOfExperience} yrs
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                {t('learningTypeLabel')}
              </label>
              <div className="space-y-2">
                {[
                  t('informalApprentice'),
                  t('onTheJob'),
                  t('familyTradition')
                ].map((type) => (
                  <label
                    key={type}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      learningType === type
                        ? 'bg-blue-50/80 border-blue-500 font-medium text-blue-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="learningType"
                      checked={learningType === type}
                      onChange={() => setLearningType(type)}
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                {t('previousWorkplacesLabel')}
              </label>
              <input
                type="text"
                value={previousWorkplaces}
                onChange={(e) => setPreviousWorkplaces(e.target.value)}
                placeholder="Names of shops, contractors, or builders you assisted"
                className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Tasks Performed Checkboxes */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              {t('step2Title')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('tasksChecklistLabel')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allAvailableTasks.map((tItem) => {
                const isSelected = tasksPerformed.some(tp => tItem.label.toLowerCase().includes(tp.toLowerCase().split(' ')[0]));
                return (
                  <div
                    key={tItem.id}
                    onClick={() => toggleTask(tItem.label.split(' (')[0])}
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 shadow-sm text-blue-900 font-semibold'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{tItem.label}</span>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                      isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Voice / Text Statement */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                {t('step3Title')}
              </h2>
              {/* Simulated Voice Recognition Button */}
              <button
                type="button"
                onClick={handleSimulateVoice}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  isRecording 
                    ? 'bg-red-600 text-white animate-pulse' 
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? 'Listening in Marathi/Hindi...' : t('speakOrType')}</span>
              </button>
            </div>

            <p className="text-xs text-slate-500">
              {t('voiceTextPrompt')}
            </p>

            <div>
              <textarea
                rows="5"
                value={rawDescription}
                onChange={(e) => setRawDescription(e.target.value)}
                placeholder={t('voiceTextPlaceholder')}
                className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                Our AI model automatically parses technical skills from your casual colloquial description. You will have full opportunity to review and confirm every extracted skill.
              </span>
            </div>
          </div>
        )}

        {/* STEP 4: Tools & Instruments */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              {t('step4Title')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('toolsChecklistLabel')}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {allAvailableTools.map((tool) => {
                const isSelected = toolsUsed.includes(tool);
                return (
                  <div
                    key={tool}
                    onClick={() => toggleTool(tool)}
                    className={`p-3.5 rounded-xl border cursor-pointer text-center transition flex flex-col items-center justify-between min-h-[90px] ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 shadow-sm text-blue-900 font-bold'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Wrench className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="text-xs">{tool}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Final Review & Submission */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              {t('step5Title')}
            </h2>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3 text-xs border border-slate-200">
              <div>
                <span className="text-slate-500 font-medium">Declared Experience:</span>{' '}
                <strong className="text-slate-800">{yearsOfExperience} Years ({learningType})</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Tasks Declared:</span>{' '}
                <strong className="text-slate-800">{tasksPerformed.length} practical tasks selected</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Tools Checked:</span>{' '}
                <strong className="text-slate-800">{toolsUsed.length} standard tools verified</strong>
              </div>
              <div className="pt-2 border-t border-slate-200 text-slate-700 italic">
                "{rawDescription}"
              </div>
            </div>

            {submitting ? (
              <div className="p-8 text-center bg-blue-50 rounded-2xl border border-blue-200 space-y-3">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 className="font-bold text-sm text-blue-900">
                  {t('aiAnalyzingPrompt')}
                </h3>
                <p className="text-xs text-blue-700 max-w-md mx-auto">
                  Extracting core trade skills, evaluating confidence levels, and aligning with NCVET NSQF Level 4 Qualification Pack (ELE/Q1401)...
                </p>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                ✓ Ready for AI Skill Extraction engine. Click below to proceed.
              </div>
            )}
          </div>
        )}

        {/* Navigation Step Buttons */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              disabled={submitting}
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Step</span>
            </button>
          ) : <div></div>}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-black shadow-lg transition flex items-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              <span>{submitting ? 'Analyzing...' : t('submitForAiAnalysis')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
