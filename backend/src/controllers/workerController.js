import { db } from "../services/storage/database.js";
import { logAuditEvent, createNotification } from "../services/auditService.js";
import { extractSkillsFromExperience } from "../services/ai/skillExtractionService.js";
import { matchSkillsToQualifications } from "../services/ai/qualificationMatchingService.js";
import { PRACTICAL_ASSESSMENT_TASKS } from "../data/qpNosData.js";

export function getProfile(req, res) {
  const userId = req.user.id;
  let profile = db.workerProfiles.find(p => p.userId === userId);

  if (!profile) {
    profile = {
      id: `wp-${Date.now()}`,
      userId,
      fullName: req.user.name,
      age: 30,
      phone: req.user.phone,
      location: req.user.location,
      preferredLanguage: "en",
      trade: "Electrician",
      yearsOfExperience: 5,
      currentOccupation: "Domestic Electrician",
      previousWorkplaces: "Self-employed / Local Contractor",
      educationLevel: "10th Standard",
      nsqfTargetLevel: 4,
      profileCompletionPercent: 75,
      skills: ["Electrical Wiring", "Switch Installation", "Safety Procedures"],
      toolsUsed: ["Neon Phase Tester", "Wire Stripper & Cutter", "Combination Pliers"]
    };
    db.workerProfiles.push(profile);
  }

  return res.json({ success: true, profile });
}

export function updateProfile(req, res) {
  const userId = req.user.id;
  const updates = req.body;

  let profile = db.workerProfiles.find(p => p.userId === userId);
  if (!profile) {
    profile = { id: `wp-${Date.now()}`, userId, ...updates };
    db.workerProfiles.push(profile);
  } else {
    Object.assign(profile, updates);
  }

  logAuditEvent({
    userId,
    userName: req.user.name,
    role: "worker",
    action: "WORKER_PROFILE_UPDATED",
    entity: "WorkerProfile",
    entityId: profile.id,
    newValue: JSON.stringify(updates)
  });

  return res.json({ success: true, message: "Profile updated successfully", profile });
}

export async function submitExperience(req, res) {
  try {
    const userId = req.user.id;
    const {
      yearsOfExperience = 5,
      learningType = "Informal Apprenticeship",
      previousWorkplaces = "",
      tasksPerformed = [],
      rawDescription = "",
      toolsUsed = [],
      language = "en"
    } = req.body;

    const newExperience = {
      id: `exp-${Date.now()}`,
      workerId: userId,
      yearsOfExperience: Number(yearsOfExperience),
      learningType,
      previousWorkplaces,
      tasksPerformed,
      rawDescription,
      toolsUsed,
      createdAt: new Date().toISOString(),
      status: "analyzed"
    };

    db.experiences.push(newExperience);

    // Run AI skill extraction
    const extractionResult = await extractSkillsFromExperience({
      experienceText: rawDescription,
      tasksPerformed,
      toolsUsed,
      yearsDeclared: Number(yearsOfExperience),
      language
    });

    // Run qualification matching
    const matchingResult = await matchSkillsToQualifications(
      extractionResult.skills.map(s => s.name)
    );

    // Update worker profile with extracted skills and tools
    let profile = db.workerProfiles.find(p => p.userId === userId);
    if (profile) {
      profile.yearsOfExperience = Number(yearsOfExperience);
      profile.skills = extractionResult.skills.map(s => s.name);
      profile.toolsUsed = extractionResult.tools;
      profile.profileCompletionPercent = 90;
    }

    // Check or create associated assessment
    let assessment = db.assessments.find(a => a.workerId === userId);
    if (!assessment) {
      const topMatch = matchingResult.topMatch;
      assessment = {
        id: `asm-${Date.now()}`,
        workerId: userId,
        workerName: req.user.name,
        workerLocation: req.user.location,
        assessorId: "usr-assessor-01",
        assessorName: "Amit Sharma",
        trade: "Electrician",
        qualificationId: topMatch ? topMatch.qualificationId : "qp-ele-001",
        qpCode: topMatch ? topMatch.qpCode : "ELE/Q1401",
        qualificationName: topMatch ? topMatch.qualificationName : "Electrician - Domestic Solutions",
        nsqfLevel: topMatch ? topMatch.nsqfLevel : 4,
        status: "draft",
        submissionDate: new Date().toISOString(),
        tasks: PRACTICAL_ASSESSMENT_TASKS.map(t => ({
          ...t,
          status: "pending",
          timeSpentMinutes: 0
        })),
        scores: [],
        aiOverallScore: 82.5,
        assessorOverallScore: null,
        finalCalculatedScore: null,
        assessorNotes: "",
        recommendationStatus: "Pending Assessment Completion"
      };
      db.assessments.push(assessment);
    }

    logAuditEvent({
      userId,
      userName: req.user.name,
      role: "worker",
      action: "EXPERIENCE_SUBMITTED",
      entity: "Experience",
      entityId: newExperience.id,
      newValue: `Experience submitted: ${yearsOfExperience} years, ${tasksPerformed.length} tasks`
    });

    createNotification({
      userId,
      role: "worker",
      title: "Experience Profile Analyzed",
      message: "AI has successfully parsed your declared trade experience and matched your QP/NOS qualification.",
      link: "/worker/skill-analysis"
    });

    return res.status(201).json({
      success: true,
      message: "Experience saved and analyzed successfully",
      experience: newExperience,
      aiExtraction: extractionResult,
      qualificationMatch: matchingResult,
      assessmentId: assessment.id
    });
  } catch (err) {
    console.error("Experience submission error:", err);
    return res.status(500).json({ success: false, message: "Failed to submit and analyze experience" });
  }
}

export function getExperience(req, res) {
  const userId = req.user.id;
  const experienceList = db.experiences.filter(e => e.workerId === userId);
  return res.json({ success: true, experience: experienceList[experienceList.length - 1] || null });
}

export function getDashboardStats(req, res) {
  const userId = req.user.id;
  const profile = db.workerProfiles.find(p => p.userId === userId) || {};
  const experience = db.experiences.filter(e => e.workerId === userId).pop() || null;
  const assessment = db.assessments.find(a => a.workerId === userId) || null;
  const competency = db.competencyProfiles.find(c => c.workerId === userId) || null;

  // Compute completed tasks count
  const completedTasksCount = assessment ? assessment.tasks.filter(t => t.status === "completed").length : 0;
  const totalTasksCount = assessment ? assessment.tasks.length : 5;

  return res.json({
    success: true,
    stats: {
      profileCompletion: profile.profileCompletionPercent || 75,
      yearsDeclared: profile.yearsOfExperience || (experience ? experience.yearsOfExperience : 5),
      trade: profile.trade || "Electrician",
      nsqfLevel: assessment ? assessment.nsqfLevel : 4,
      qualificationName: assessment ? assessment.qualificationName : "Electrician - Domestic Solutions",
      qpCode: assessment ? assessment.qpCode : "ELE/Q1401",
      assessmentStatus: assessment ? assessment.status : "pending",
      completedTasksCount,
      totalTasksCount,
      competencyScore: competency ? competency.overallCompetencyPercent : (assessment && assessment.finalCalculatedScore ? assessment.finalCalculatedScore : null),
      recommendationStatus: competency ? competency.certificationRecommendation : (assessment ? assessment.recommendationStatus : "Pending Assessment")
    },
    latestAssessmentId: assessment ? assessment.id : null,
    hasExperience: !!experience,
    hasCompetencyProfile: !!competency
  });
}
