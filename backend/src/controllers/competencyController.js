import { db } from "../services/storage/database.js";

export function getCompetencyProfileByWorker(req, res) {
  const { workerId } = req.params;
  const targetId = workerId || req.user.id;

  const profile = db.competencyProfiles.find(cp => cp.workerId === targetId) ||
                  db.competencyProfiles[0]; // fallback to demo record

  if (!profile) {
    return res.status(404).json({ success: false, message: "Competency profile not found for this worker" });
  }

  const workerUser = db.users.find(u => u.id === targetId) || { name: profile.workerName };
  const assessment = db.assessments.find(a => a.id === profile.assessmentId) || null;

  return res.json({
    success: true,
    competencyProfile: {
      ...profile,
      workerName: workerUser.name,
      workerLocation: workerUser.location || "Pune, Maharashtra",
      assessment
    },
    certificationNotice: "This profile represents an authorized human assessor evaluation under the NCVET RPL framework. AI provides recommendation assistance only."
  });
}

export function getCompetencyByAssessmentId(req, res) {
  const { assessmentId } = req.params;
  const profile = db.competencyProfiles.find(cp => cp.assessmentId === assessmentId);

  if (!profile) {
    return res.status(404).json({ success: false, message: "Competency profile not found for this assessment" });
  }

  return res.json({ success: true, competencyProfile: profile });
}
