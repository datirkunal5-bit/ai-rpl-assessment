import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { 
  CheckCircle2, 
  Clock, 
  Wrench, 
  ShieldAlert, 
  Upload, 
  Play, 
  Check, 
  AlertTriangle, 
  Camera, 
  ArrowRight,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export default function AssessmentTasksPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTaskModal, setActiveTaskModal] = useState(null);
  const [taskTimer, setTaskTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [checkedCriteria, setCheckedCriteria] = useState({});

  useEffect(() => {
    async function loadAssessment() {
      try {
        const res = await api.getAssessments();
        if (res.assessments && res.assessments.length > 0) {
          const detail = await api.getAssessmentById(res.assessments[0].id);
          setAssessment(detail.assessment);
        }
      } catch (err) {
        console.warn("Using sample assessment data:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAssessment();
  }, []);

  // Timer tick effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTaskTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const startTaskExecution = (task) => {
    setActiveTaskModal(task);
    setTaskTimer(0);
    setIsTimerRunning(true);
    setCheckedCriteria({});
  };

  const toggleCriterion = (idx) => {
    setCheckedCriteria(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleCompleteActiveTask = async () => {
    if (!activeTaskModal || !assessment) return;
    setIsTimerRunning(false);

    try {
      await api.updateTaskProgress(assessment.id, activeTaskModal.id, {
        status: "completed",
        timeSpentMinutes: Math.max(1, Math.round(taskTimer / 60))
      });
      // Update local state
      setAssessment(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === activeTaskModal.id ? { ...t, status: "completed" } : t)
      }));
      setActiveTaskModal(null);
    } catch (e) {
      // offline fallback
      setAssessment(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === activeTaskModal.id ? { ...t, status: "completed" } : t)
      }));
      setActiveTaskModal(null);
    }
  };

  const handleGoToEvidenceUpload = (task) => {
    navigate('/worker/evidence', { state: { selectedTaskId: task.id, taskTitle: task.title } });
  };

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-bold">Loading practical assessment tasks...</span>
        </div>
      </div>
    );
  }

  const tasks = assessment?.tasks || [];
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Core Step 5 • Guided Practical Assessment
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-2">
            Electrician Practical Assessment Tasks
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Perform each trade task under timed conditions. Follow safety requirements and upload photo/video proof for evaluation.
          </p>
        </div>

        {/* Progress badge */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Tasks Completed</div>
            <div className="text-xl font-black font-display text-blue-700">
              {completedCount} of {tasks.length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-emerald-500 flex items-center justify-center font-bold text-xs">
            {Math.round((completedCount / (tasks.length || 1)) * 100)}%
          </div>
        </div>
      </div>

      {/* Tasks List Cards */}
      <div className="space-y-4">
        {tasks.map((task) => {
          const isDone = task.status === 'completed';

          return (
            <div
              key={task.id}
              className={`bg-white rounded-2xl p-6 border shadow-sm transition ${
                isDone ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-900 text-white text-xs font-bold px-2 py-0.5 rounded">
                      Task {task.taskNumber || 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Allocated: {task.estimatedTimeMinutes} mins
                    </span>
                    {isDone && (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Completed & Ready for Review
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {task.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Safety & Tools Summary */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Mandatory PPE: Insulated Gloves & Goggles
                    </span>
                    <span className="flex items-center gap-1 text-slate-700">
                      <Wrench className="w-3.5 h-3.5 text-blue-600" />
                      Key Tools: {task.requiredTools?.slice(0, 2).join(', ')}...
                    </span>
                  </div>
                </div>

                {/* Task Action Buttons */}
                <div className="flex flex-row lg:flex-col items-center gap-2 flex-shrink-0 w-full lg:w-auto">
                  {!isDone ? (
                    <button
                      onClick={() => startTaskExecution(task)}
                      className="flex-1 lg:flex-none w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{t('startTask')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => startTaskExecution(task)}
                      className="flex-1 lg:flex-none w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Review Details</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleGoToEvidenceUpload(task)}
                    className="flex-1 lg:flex-none w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{t('uploadProof')}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Execution Modal / Drawer */}
      {activeTaskModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase bg-blue-100 px-2 py-0.5 rounded">
                  Task Execution Mode
                </span>
                <h2 className="text-xl font-bold font-display text-slate-900 mt-1">
                  {activeTaskModal.title}
                </h2>
              </div>

              {/* Running Stop-Watch */}
              <div className="flex items-center gap-2 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl font-mono text-base font-bold shadow-sm">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                <span>{formatSeconds(taskTimer)}</span>
              </div>
            </div>

            {/* Performance criteria checklist */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Practical Execution Criteria Checklist
              </h4>
              <div className="space-y-2.5">
                {activeTaskModal.performanceCriteria?.map((crit, cIdx) => (
                  <div
                    key={cIdx}
                    onClick={() => toggleCriterion(cIdx)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                      checkedCriteria[cIdx]
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{crit}</span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      checkedCriteria[cIdx] ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                    }`}>
                      {checkedCriteria[cIdx] && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Reminder */}
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Safety Verification:</strong> Always verify absence of live voltage with neon phase tester or multimeter before contacting terminals.
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTaskModal(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Close without saving
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleCompleteActiveTask();
                    handleGoToEvidenceUpload(activeTaskModal);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Attach Photo Evidence</span>
                </button>

                <button
                  type="button"
                  onClick={handleCompleteActiveTask}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Task Completed</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
