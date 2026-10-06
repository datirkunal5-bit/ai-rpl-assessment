/**
 * AI Scoring Assistant Service
 * Computes AI baseline score suggestions based on evidence analysis and task checklist fulfillment.
 * Supports weighted standardized scoring across 5 NCVET practical criteria.
 */

export const STANDARDIZED_CRITERIA = [
  {
    criterionId: "crit-1",
    criterionName: "Technical Skill & Knowledge",
    weight: 0.30,
    baseAiScore: 8.5,
    description: "Accuracy of circuit wiring, wire gauge selection, and terminal tightening",
    suggestedComment: "Solid grasp of single-phase circuits, color-coding, and cable sizing."
  },
  {
    criterionId: "crit-2",
    criterionName: "Practical Execution & Craftsmanship",
    weight: 0.30,
    baseAiScore: 8.0,
    description: "Clean conduit routing, tool handling, neat termination, and flush fitting",
    suggestedComment: "Neat dress wiring and proper stripping depth; zero exposed copper outside lugs."
  },
  {
    criterionId: "crit-3",
    criterionName: "Safety Compliance (PPE & LOTO)",
    weight: 0.15,
    baseAiScore: 9.0,
    description: "Insulated tools, safety footwear, power de-energization verification, and LOTO",
    suggestedComment: "High safety vigilance; 1000V gloves and de-energization confirmed prior to work."
  },
  {
    criterionId: "crit-4",
    criterionName: "Quality & Testing",
    weight: 0.15,
    baseAiScore: 7.5,
    description: "Multimeter continuity test, voltage verification, and polarity checks",
    suggestedComment: "Continuity and 230V live polarity confirmed on socket right pin."
  },
  {
    criterionId: "crit-5",
    criterionName: "Task Completion & Speed",
    weight: 0.10,
    baseAiScore: 8.5,
    description: "Completed within time limit following standard workflow checklist",
    suggestedComment: "Candidate completed all tasks efficiently within practical test duration."
  }
];

export function calculateStandardizedScore(criteriaScores = []) {
  let aiWeightedTotal = 0;
  let assessorWeightedTotal = 0;
  let hasAssessorScores = false;

  const processedCriteria = STANDARDIZED_CRITERIA.map(defaultCrit => {
    const entered = criteriaScores.find(c => c.criterionId === defaultCrit.criterionId) || {};

    const aiScore = entered.aiScore !== undefined ? Number(entered.aiScore) : defaultCrit.baseAiScore;
    const assessorScore = (entered.assessorScore !== undefined && entered.assessorScore !== null && entered.assessorScore !== "")
      ? Number(entered.assessorScore)
      : null;

    if (assessorScore !== null) {
      hasAssessorScores = true;
    }

    aiWeightedTotal += (aiScore * defaultCrit.weight);
    assessorWeightedTotal += ((assessorScore !== null ? assessorScore : aiScore) * defaultCrit.weight);

    return {
      criterionId: defaultCrit.criterionId,
      criterionName: defaultCrit.criterionName,
      weight: defaultCrit.weight,
      maxScore: 10,
      aiScore: Math.round(aiScore * 10) / 10,
      assessorScore: assessorScore !== null ? Math.round(assessorScore * 10) / 10 : null,
      comment: entered.comment || defaultCrit.suggestedComment
    };
  });

  // Scale 0-10 weighted total to 0-100 percentage
  const aiOverallScore = Math.round(aiWeightedTotal * 10 * 10) / 10;
  const assessorOverallScore = hasAssessorScores ? Math.round(assessorWeightedTotal * 10 * 10) / 10 : null;
  const finalCalculatedScore = assessorOverallScore !== null ? assessorOverallScore : aiOverallScore;

  // Determination threshold: >= 60% for NSQF Level 4 pass
  const isRecommended = finalCalculatedScore >= 60;
  const recommendationStatus = isRecommended
    ? "Recommended for Certification — Pending Final Authority Approval"
    : "Re-assessment Recommended — Practical Competency Gap Identified";

  return {
    criteria: processedCriteria,
    aiOverallScore,
    assessorOverallScore,
    finalCalculatedScore,
    isRecommended,
    recommendationStatus,
    disclaimer: "Human assessor remains the sole certifying authority. AI scores are advisory suggestions only."
  };
}
