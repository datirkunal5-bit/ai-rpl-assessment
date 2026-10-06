import { db } from "../services/storage/database.js";
import { logAuditEvent, createNotification } from "../services/auditService.js";
import { calculateStandardizedScore } from "../services/ai/scoringAssistantService.js";
import { analyzeAssessmentEvidence } from "../services/ai/evidenceAnalysisService.js";
import { PRACTICAL_ASSESSMENT_TASKS } from "../data/qpNosData.js";

export function getAllAssessments(req, res) {
  let list = db.assessments;

  if (req.user.role === "worker") {
    list = list.filter(a => a.workerId === req.user.id);
  } else if (req.user.role === "assessor") {
    // Show assessments assigned to assessor or all if assessor is general
    list = list.filter(a => !a.assessorId || a.assessorId === req.user.id);
  }

  return res.json({ success: true, count: list.length, assessments: list });
}

export function getAssessmentById(req, res) {
  const { id } = req.params;
  const assessment = db.assessments.find(a => a.id === id);

  if (!assessment) {
    return res.status(404).json({ success: false, message: "Assessment record not found" });
  }

  const evidenceList = db.evidence.filter(e => e.assessmentId === id);
  const workerProfile = db.workerProfiles.find(p => p.userId === assessment.workerId) || {};
  const experience = db.experiences.find(e => e.workerId === assessment.workerId) || null;

  return res.json({
    success: true,
    assessment: {
      ...assessment,
      evidenceList,
      workerProfile,
      experience
    }
  });
}

export function updateTaskProgress(req, res) {
  const { id, taskId } = req.params;
  const { status = "completed", timeSpentMinutes = 25, checklist = [] } = req.body;

  const assessment = db.assessments.find(a => a.id === id);
  if (!assessment) {
    return res.status(404).json({ success: false, message: "Assessment not found" });
  }

  const task = assessment.tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found in this assessment" });
  }

  task.status = status;
  task.timeSpentMinutes = Number(timeSpentMinutes);
  task.completedAt = new Date().toISOString();
  if (checklist.length) task.checklist = checklist;

  logAuditEvent({
    userId: req.user.id,
    userName: req.user.name,
    role: req.user.role,
    action: "TASK_PROGRESS_UPDATED",
    entity: "AssessmentTask",
    entityId: taskId,
    newValue: `Task '${task.title}' marked ${status}`
  });

  return res.json({ success: true, message: `Task ${task.title} updated`, task, assessment });
}

export function submitAssessmentByWorker(req, res) {
  const { id } = req.params;
  const assessment = db.assessments.find(a => a.id === id);

  if (!assessment) {
    return res.status(404).json({ success: false, message: "Assessment not found" });
  }

  assessment.status = "submitted";
  assessment.submissionDate = new Date().toISOString();

  // Mark all incomplete tasks completed if submitted
  assessment.tasks.forEach(t => {
    if (t.status !== "completed") {
      t.status = "completed";
      t.timeSpentMinutes = t.estimatedTimeMinutes;
    }
  });

  logAuditEvent({
    userId: req.user.id,
    userName: req.user.name,
    role: "worker",
    action: "ASSESSMENT_SUBMITTED_BY_WORKER",
    entity: "Assessment",
    entityId: assessment.id,
    newValue: `Assessment submitted with ${assessment.tasks.length} tasks completed`
  });

  createNotification({
    userId: assessment.assessorId || "usr-assessor-01",
    role: "assessor",
    title: "New Assessment Awaiting Review",
    message: `${req.user.name} has submitted practical assessment tasks for ${assessment.qualificationName}.`,
    link: `/assessor/assessments/${assessment.id}`
  });

  return res.json({
    success: true,
    message: "Assessment submitted successfully. Awaiting human assessor practical evaluation.",
    assessment
  });
}

export async function uploadEvidence(req, res) {
  try {
    const { assessmentId, taskId, taskTitle, description, demoFileUrl, mediaType = "image" } = req.body;

    let fileUrl = demoFileUrl;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    if (!fileUrl) {
      fileUrl = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80";
    }

    // Run AI evidence analysis
    const aiAnalysis = await analyzeAssessmentEvidence({
      taskId,
      taskTitle,
      description,
      mediaType,
      fileUrl
    });

    const newEvidence = {
      id: `ev-${Date.now()}`,
      assessmentId,
      taskId,
      taskTitle: taskTitle || "Practical Electrical Task",
      type: mediaType,
      fileUrl,
      description: description || "Worker uploaded practical demonstration proof",
      timestamp: new Date().toISOString(),
      aiAnalysis: {
        ...aiAnalysis,
        assessorStatus: "pending"
      }
    };

    db.evidence.push(newEvidence);

    // Update corresponding task status in assessment
    const assessment = db.assessments.find(a => a.id === assessmentId);
    if (assessment) {
      const task = assessment.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = "completed";
        task.evidenceSubmitted = true;
      }
    }

    logAuditEvent({
      userId: req.user.id,
      userName: req.user.name,
      role: req.user.role,
      action: "EVIDENCE_UPLOADED",
      entity: "Evidence",
      entityId: newEvidence.id,
      newValue: `Evidence added for task ${taskId}`
    });

    return res.status(201).json({
      success: true,
      message: "Evidence uploaded and analyzed by AI",
      evidence: newEvidence
    });
  } catch (err) {
    console.error("Evidence upload error:", err);
    return res.status(500).json({ success: false, message: "Evidence upload failed" });
  }
}

export function updateEvidenceAssessorReview(req, res) {
  const { evidenceId } = req.params;
  const { status = "accepted", assessorObservations = "", modifiedComponents = null } = req.body;

  const item = db.evidence.find(e => e.id === evidenceId);
  if (!item) {
    return res.status(404).json({ success: false, message: "Evidence record not found" });
  }

  const oldStatus = item.aiAnalysis.assessorStatus;
  item.aiAnalysis.assessorStatus = status;
  if (assessorObservations) {
    item.aiAnalysis.assessorObservations = assessorObservations;
  }
  if (modifiedComponents) {
    item.aiAnalysis.assessorModifiedComponents = modifiedComponents;
  }

  logAuditEvent({
    userId: req.user.id,
    userName: req.user.name,
    role: "assessor",
    action: "EVIDENCE_ASSESSOR_REVIEWED",
    entity: "Evidence",
    entityId: item.id,
    oldValue: oldStatus,
    newValue: `Assessor set status: ${status}. Observations: ${assessorObservations}`
  });

  return res.json({ success: true, message: "Assessor evidence observation saved", evidence: item });
}

export function submitAssessorScores(req, res) {
  try {
    const { id } = req.params;
    const { criteriaScores = [], assessorNotes = "", recommendationStatus } = req.body;

    const assessment = db.assessments.find(a => a.id === id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }

    // Calculate final weighted score
    const scoreResult = calculateStandardizedScore(criteriaScores);

    assessment.scores = scoreResult.criteria;
    assessment.aiOverallScore = scoreResult.aiOverallScore;
    assessment.assessorOverallScore = scoreResult.assessorOverallScore;
    assessment.finalCalculatedScore = scoreResult.finalCalculatedScore;
    assessment.assessorNotes = assessorNotes || "Practical evaluation completed by authorized NCVET assessor.";
    assessment.recommendationStatus = recommendationStatus || scoreResult.recommendationStatus;
    assessment.status = "completed";
    assessment.assessorId = req.user.id;
    assessment.assessorName = req.user.name;
    assessment.completedAt = new Date().toISOString();

    // Generate or update CompetencyProfile
    let competency = db.competencyProfiles.find(c => c.assessmentId === id);
    const skillBreakdown = [
      { skill: "Electrical House Wiring", percentage: Math.min(95, Math.round(scoreResult.finalCalculatedScore * 1.05)), grade: "Proficient" },
      { skill: "Modular Switch Installation", percentage: Math.min(95, Math.round(scoreResult.finalCalculatedScore * 1.02)), grade: "Proficient" },
      { skill: "Ceiling Fan & Appliance Fitting", percentage: Math.round(scoreResult.finalCalculatedScore * 0.98), grade: "Competent" },
      { skill: "MCB & Distribution Box Assembly", percentage: Math.round(scoreResult.finalCalculatedScore * 1.01), grade: "Proficient" },
      { skill: "Fault Diagnosis & Meter Testing", percentage: Math.round(scoreResult.finalCalculatedScore * 0.95), grade: "Competent" },
      { skill: "Occupational Safety & Earthing", percentage: Math.min(98, Math.round(scoreResult.finalCalculatedScore * 1.08)), grade: "Exemplary" }
    ];

    if (!competency) {
      competency = {
        id: `cp-${Date.now()}`,
        assessmentId: assessment.id,
        workerId: assessment.workerId,
        workerName: assessment.workerName,
        workerLocation: assessment.workerLocation,
        trade: assessment.trade,
        qualificationName: assessment.qualificationName,
        qpCode: assessment.qpCode,
        nsqfLevel: assessment.nsqfLevel,
        overallCompetencyPercent: scoreResult.finalCalculatedScore,
        skillBreakdown,
        strengths: [
          "Rigorous practical adherence to electrical color coding and terminal tightening standards.",
          "Demonstrates strong protective awareness: verifies de-energization and applies LOTO locks.",
          "Efficient diagnostic approach with multimeter continuity and polarity confirmation."
        ],
        areasForImprovement: [
          "Recommended to practice architectural electrical CAD drawings and load distribution balancing.",
          "Exposure to three-phase industrial control logic and inverter backup integration."
        ],
        assessorSummary: assessment.assessorNotes,
        assessorName: req.user.name,
        certificationRecommendation: assessment.recommendationStatus,
        generatedAt: new Date().toISOString()
      };
      db.competencyProfiles.push(competency);
    } else {
      competency.overallCompetencyPercent = scoreResult.finalCalculatedScore;
      competency.skillBreakdown = skillBreakdown;
      competency.assessorSummary = assessment.assessorNotes;
      competency.certificationRecommendation = assessment.recommendationStatus;
    }

    logAuditEvent({
      userId: req.user.id,
      userName: req.user.name,
      role: "assessor",
      action: "ASSESSMENT_SCORED_AND_FINALIZED",
      entity: "Assessment",
      entityId: assessment.id,
      newValue: `Final Score: ${scoreResult.finalCalculatedScore}%, Status: ${assessment.recommendationStatus}`
    });

    createNotification({
      userId: assessment.workerId,
      role: "worker",
      title: "Competency Profile Generated!",
      message: `Your RPL assessment for ${assessment.qualificationName} has been evaluated by Assessor ${req.user.name}. Overall Competency: ${scoreResult.finalCalculatedScore}%.`,
      link: "/worker/competency-profile"
    });

    return res.json({
      success: true,
      message: "Scores submitted and Competency Profile generated successfully",
      assessment,
      scoreResult,
      competencyProfile: competency
    });
  } catch (err) {
    console.error("Score submission error:", err);
    return res.status(500).json({ success: false, message: "Failed to submit assessment scores" });
  }
}
