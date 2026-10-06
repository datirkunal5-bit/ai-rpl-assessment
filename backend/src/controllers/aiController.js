import { extractSkillsFromExperience } from "../services/ai/skillExtractionService.js";
import { matchSkillsToQualifications } from "../services/ai/qualificationMatchingService.js";
import { analyzeAssessmentEvidence } from "../services/ai/evidenceAnalysisService.js";
import { calculateStandardizedScore, STANDARDIZED_CRITERIA } from "../services/ai/scoringAssistantService.js";
import { logAuditEvent } from "../services/auditService.js";

export async function extractSkills(req, res) {
  try {
    const { experienceText, tasksPerformed = [], toolsUsed = [], yearsDeclared, language = "en" } = req.body;

    const result = await extractSkillsFromExperience({
      experienceText,
      tasksPerformed,
      toolsUsed,
      yearsDeclared,
      language
    });

    logAuditEvent({
      userId: req.user ? req.user.id : "system-ai",
      userName: req.user ? req.user.name : "AI Skill Engine",
      role: req.user ? req.user.role : "ai_service",
      action: "AI_SKILL_EXTRACTION",
      entity: "SkillExtraction",
      newValue: `Extracted ${result.skills.length} skills with ${result.overallConfidence} avg confidence`
    });

    return res.json(result);
  } catch (err) {
    console.error("AI Skill Extraction API Error:", err);
    return res.status(500).json({ success: false, message: "Skill extraction failed" });
  }
}

export async function matchQualifications(req, res) {
  try {
    const { skills = [] } = req.body;
    const result = await matchSkillsToQualifications(skills);

    logAuditEvent({
      userId: req.user ? req.user.id : "system-ai",
      userName: req.user ? req.user.name : "AI Matcher",
      role: req.user ? req.user.role : "ai_service",
      action: "QP_NOS_MATCHED",
      entity: "QualificationPack",
      newValue: `Top match: ${result.topMatch?.qualificationName} (${result.topMatch?.matchPercentage}%)`
    });

    return res.json(result);
  } catch (err) {
    console.error("Qualification Matching API Error:", err);
    return res.status(500).json({ success: false, message: "Qualification matching failed" });
  }
}

export async function analyzeEvidence(req, res) {
  try {
    const { taskId, taskTitle, description, mediaType = "image", fileUrl = "" } = req.body;

    const result = await analyzeAssessmentEvidence({
      taskId,
      taskTitle,
      description,
      mediaType,
      fileUrl
    });

    logAuditEvent({
      userId: req.user ? req.user.id : "system-ai",
      userName: req.user ? req.user.name : "AI Evidence Vision",
      role: req.user ? req.user.role : "ai_service",
      action: "AI_EVIDENCE_ANALYSIS",
      entity: "Evidence",
      entityId: taskId,
      newValue: `Components: ${result.detectedComponents.length}, Confidence: ${result.confidence}`
    });

    return res.json(result);
  } catch (err) {
    console.error("Evidence Analysis API Error:", err);
    return res.status(500).json({ success: false, message: "Evidence analysis failed" });
  }
}

export function getStandardizedCriteria(req, res) {
  return res.json({
    success: true,
    criteria: STANDARDIZED_CRITERIA,
    guidance: "Assessor scores override AI recommendations. Each criterion weighted according to official RPL prototype rubric."
  });
}

export function calculateScore(req, res) {
  try {
    const { criteriaScores = [] } = req.body;
    const result = calculateStandardizedScore(criteriaScores);
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error("Score Calculation API Error:", err);
    return res.status(500).json({ success: false, message: "Score calculation failed" });
  }
}
