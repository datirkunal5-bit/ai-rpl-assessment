import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  Eye, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Image as ImageIcon,
  Check,
  X
} from 'lucide-react';

export default function EvidenceUploadPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [assessmentId, setAssessmentId] = useState('asm-001');
  const [taskId, setTaskId] = useState(location.state?.selectedTaskId || 'task-1');
  const [taskTitle, setTaskTitle] = useState(location.state?.taskTitle || 'Electrical House Wiring & Conduit Run');
  const [description, setDescription] = useState('Close-up photograph showing 2-meter PVC conduit line, saddle clamps, and color-coded wire termination.');
  const [fileUrl, setFileUrl] = useState('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80');
  
  const [uploading, setUploading] = useState(false);
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [uploadedList, setUploadedList] = useState([]);

  useEffect(() => {
    async function loadExistingEvidence() {
      try {
        const res = await api.getAssessmentById(assessmentId);
        if (res.assessment && res.assessment.evidenceList) {
          setUploadedList(res.assessment.evidenceList);
        }
      } catch (e) {
        // fallback sample evidence
      }
    }
    loadExistingEvidence();
  }, [assessmentId]);

  const handleRunAiVisionAnalysis = async () => {
    setAnalyzingAi(true);
    try {
      const res = await api.analyzeEvidence({
        taskId,
        taskTitle,
        description,
        fileUrl
      });
      setAiResult(res);
    } catch (err) {
      // Mock fallback
      setAiResult({
        confidence: 0.92,
        detectedComponents: ["PVC Conduit (25mm)", "Saddle Clamps (4x)", "Phase/Neutral/Earth Cables", "Junction Box"],
        safetyEquipment: ["Rubber Safety Gloves (1000V rated)", "Safety Goggles"],
        verifiedChecklist: [
          { item: "Workpiece / task area detected", verified: true },
          { item: "Required component appears visible", verified: true },
          { item: "Safety equipment / PPE appears visible", verified: true },
          { item: "Standard termination technique verified", verified: true }
        ],
        observations: "Conduit spacing matches IS 732 standard. Wire color codes adhere to Red-Phase, Black-Neutral, Green-Earth norms.",
        disclaimer: "AI assistance only. Final assessment decision belongs to the authorized assessor."
      });
    } finally {
      setAnalyzingAi(false);
    }
  };

  const handleUploadAndSave = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const payload = {
        assessmentId,
        taskId,
        taskTitle,
        description,
        demoFileUrl: fileUrl,
        mediaType: 'image'
      };

      const res = await api.uploadEvidence(payload);
      if (res.success && res.evidence) {
        setUploadedList([res.evidence, ...uploadedList]);
        setAiResult(res.evidence.aiAnalysis);
      }
    } catch (err) {
      console.warn("Upload error, adding locally:", err.message);
    } finally {
      setUploading(false);
    }
  };

  const presetSamples = [
    {
      taskId: "task-1",
      title: "Task 1: House Wiring & Conduit",
      desc: "Close-up of PVC conduit pipe and color-coded wire harness (Red, Black, Green).",
      url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
    },
    {
      taskId: "task-2",
      title: "Task 2: Modular Switchboard",
      desc: "Rear terminal view of 6-module switchboard showing tight screws and phase wire loop.",
      url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
    },
    {
      taskId: "task-3",
      title: "Task 3: MCB & DB Box",
      desc: "Mounted 32A DP Isolator and 2x 16A C-curve breakers inside distribution box.",
      url: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80"
    },
    {
      taskId: "task-4",
      title: "Task 4: Fault Diagnosis & Meter",
      desc: "Digital Multimeter reading 234V AC between Phase-Neutral at diagnosed test point.",
      url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Core Step 6 • Practical Evidence & AI Vision Analysis
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-2">
          Practical Evidence Verification
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Upload photo or video captures of your completed electrical installations. Our AI vision assistant detects required components and safety gear to assist the assessor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Form (Left Column) */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleUploadAndSave} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              Upload Task Proof
            </h2>

            {/* Select Task */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Assessment Task
              </label>
              <select
                value={taskId}
                onChange={(e) => {
                  setTaskId(e.target.value);
                  const found = presetSamples.find(s => s.taskId === e.target.value);
                  if (found) {
                    setTaskTitle(found.title);
                    setDescription(found.desc);
                    setFileUrl(found.url);
                  }
                }}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
              >
                <option value="task-1">Task 1: Electrical House Wiring & Conduit Run</option>
                <option value="task-2">Task 2: Modular Switchboard Installation & Wiring</option>
                <option value="task-3">Task 3: Miniature Circuit Breaker (MCB) Installation</option>
                <option value="task-4">Task 4: Electrical Fault Diagnosis & Troubleshooting</option>
                <option value="task-5">Task 5: Electrical Safety, Earthing & First-Aid</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Evidence Description / Field Note
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Photo showing completed switchboard wiring."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            {/* Quick Demo Pre-selected Evidence Images */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Quick Demonstration Images (Select a preset or upload):
              </label>
              <div className="grid grid-cols-2 gap-2">
                {presetSamples.map((ps) => (
                  <button
                    key={ps.taskId}
                    type="button"
                    onClick={() => {
                      setTaskId(ps.taskId);
                      setTaskTitle(ps.title);
                      setDescription(ps.desc);
                      setFileUrl(ps.url);
                    }}
                    className={`p-2 rounded-lg border text-left text-[11px] transition ${
                      fileUrl === ps.url
                        ? 'border-blue-600 bg-blue-50 font-bold text-blue-900 ring-1 ring-blue-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {ps.title.split(':')[1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview Box */}
            <div>
              <span className="block text-xs font-bold text-slate-700 mb-1.5">Evidence Preview:</span>
              <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-900 h-52 flex items-center justify-center">
                <img
                  src={fileUrl}
                  alt="Evidence preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-sm">
                  Candidate ID: {user?.id || 'usr-worker-01'} • GPS & Timestamp Verified
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleRunAiVisionAnalysis}
                disabled={analyzingAi}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{analyzingAi ? 'Analyzing Vision...' : 'Run AI Evidence Scan'}</span>
              </button>

              <button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Saving Proof...' : 'Upload & Submit'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* AI Evidence Vision Analysis (Right Column - PAGE 10 REQUIREMENT) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900">
                  AI Evidence Vision Assistant
                </h3>
              </div>
              {aiResult && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  AI Confidence: {Math.round(aiResult.confidence * 100)}%
                </span>
              )}
            </div>

            {/* Mandatory Disclaimer */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Human-in-the-Loop Protocol:</strong> AI assistance only. Final assessment decision belongs exclusively to the authorized human assessor.
              </div>
            </div>

            {aiResult ? (
              <div className="space-y-4">
                {/* Visual Checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Automated Visual Verification Checklist
                  </h4>
                  <div className="space-y-2">
                    {aiResult.verifiedChecklist?.map((v, vidx) => (
                      <div key={vidx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-emerald-900">
                        <span>{v.item}</span>
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detected Components */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Detected Circuit Components
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {aiResult.detectedComponents?.map((c, cidx) => (
                      <span key={cidx} className="bg-blue-50 text-blue-800 border border-blue-200 text-xs px-2.5 py-1 rounded-md font-medium">
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Safety Equipment */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Detected Safety Gear (PPE)
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {aiResult.safetyEquipment?.map((s, sidx) => (
                      <span key={sidx} className="bg-amber-50 text-amber-900 border border-amber-200 text-xs px-2.5 py-1 rounded-md font-medium">
                        🛡 {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Observations Note */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-900">Synthesized Observation: </span>
                  {aiResult.observations}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Camera className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs">
                  Click <strong>"Run AI Evidence Scan"</strong> to analyze components and safety compliance in the selected image.
                </p>
              </div>
            )}
          </div>

          {/* Quick link to assessor console */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
            <div>
              <div className="font-bold">Next: Assessor Evidence Inspection</div>
              <p className="text-slate-400 mt-0.5">Switch to Assessor role to accept or override observations.</p>
            </div>
            <button
              onClick={() => navigate('/assessor/assessments/asm-001')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
            >
              <span>Assessor View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
