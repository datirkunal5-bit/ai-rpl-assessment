import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import * as authCtrl from "../controllers/authController.js";
import * as workerCtrl from "../controllers/workerController.js";
import * as aiCtrl from "../controllers/aiController.js";
import * as assessmentCtrl from "../controllers/assessmentController.js";
import * as competencyCtrl from "../controllers/competencyController.js";
import * as adminCtrl from "../controllers/adminController.js";
import * as syncCtrl from "../controllers/syncController.js";
import * as notifCtrl from "../controllers/notificationController.js";

const router = express.Router();

// --- Health Check ---
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "RPL Assist API",
    version: "1.0.0",
    trade: "Electrician",
    timestamp: new Date().toISOString()
  });
});

// --- Auth Routes ---
router.post("/auth/register", authCtrl.register);
router.post("/auth/login", authCtrl.login);
router.post("/auth/demo-login", authCtrl.demoLogin);
router.get("/auth/me", authenticate, authCtrl.getCurrentUser);

// --- Worker Routes ---
router.get("/workers/profile", authenticate, workerCtrl.getProfile);
router.put("/workers/profile", authenticate, workerCtrl.updateProfile);
router.get("/workers/experience", authenticate, workerCtrl.getExperience);
router.post("/workers/experience", authenticate, workerCtrl.submitExperience);
router.get("/workers/dashboard-stats", authenticate, workerCtrl.getDashboardStats);

// --- AI & Mapping Engine Routes ---
router.post("/ai/extract-skills", aiCtrl.extractSkills);
router.post("/mapping/match", aiCtrl.matchQualifications);
router.post("/ai/analyze-evidence", aiCtrl.analyzeEvidence);
router.get("/ai/standardized-criteria", aiCtrl.getStandardizedCriteria);
router.post("/ai/calculate-score", aiCtrl.calculateScore);

// --- Assessment Routes ---
router.get("/assessments", authenticate, assessmentCtrl.getAllAssessments);
router.get("/assessments/:id", authenticate, assessmentCtrl.getAssessmentById);
router.post("/assessments/:id/tasks/:taskId", authenticate, assessmentCtrl.updateTaskProgress);
router.post("/assessments/:id/submit", authenticate, assessmentCtrl.submitAssessmentByWorker);
router.post("/assessments/:id/scores", authenticate, requireRole("assessor", "admin"), assessmentCtrl.submitAssessorScores);

// --- Evidence Routes ---
router.post("/evidence/upload", authenticate, upload.single("file"), assessmentCtrl.uploadEvidence);
router.put("/evidence/:evidenceId/review", authenticate, requireRole("assessor", "admin"), assessmentCtrl.updateEvidenceAssessorReview);

// --- Competency Profiles & Certification ---
router.get("/competency/:workerId", authenticate, competencyCtrl.getCompetencyProfileByWorker);
router.get("/competency/assessment/:assessmentId", authenticate, competencyCtrl.getCompetencyByAssessmentId);

// --- Admin & Consistency Analytics ---
router.get("/admin/analytics", authenticate, requireRole("admin"), adminCtrl.getAdminDashboardStats);
router.get("/admin/consistency", authenticate, requireRole("admin", "assessor"), adminCtrl.getConsistencyAnalytics);
router.get("/admin/audit-logs", authenticate, requireRole("admin"), adminCtrl.getAuditLogs);
router.get("/admin/users", authenticate, requireRole("admin"), adminCtrl.getAllUsers);
router.get("/admin/qualifications", authenticate, adminCtrl.getQualifications);
router.post("/admin/qualifications", authenticate, requireRole("admin"), adminCtrl.addQualification);
router.put("/admin/qualifications/:id", authenticate, requireRole("admin"), adminCtrl.updateQualification);
router.delete("/admin/qualifications/:id", authenticate, requireRole("admin"), adminCtrl.deleteQualification);

// --- Offline Synchronization ---
router.post("/sync", syncCtrl.processOfflineSync);

// --- Notifications ---
router.get("/notifications", authenticate, notifCtrl.getNotifications);
router.put("/notifications/:id/read", authenticate, notifCtrl.markAsRead);
router.put("/notifications/read-all", authenticate, notifCtrl.markAllAsRead);

export default router;
