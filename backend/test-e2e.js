// Comprehensive Integration and Verification Script for RPL Assist
async function runTests() {
  console.log("==================================================");
  console.log("  RPL ASSIST - END-TO-END VERIFICATION TEST SUITE");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`  ✗ [FAIL] ${name}:`, e.message);
      failed++;
    }
  }

  // 1. Health check
  await test("API Health Endpoint", async () => {
    const res = await fetch("http://localhost:5000/api/health");
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== "ok") throw new Error("Status is not ok");
  });

  // 2. Demo Worker Login
  let workerToken = "";
  await test("Demo Worker Login (Ramesh Patil)", async () => {
    const res = await fetch("http://localhost:5000/api/auth/demo-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "worker" })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.token || data.user.role !== "worker") throw new Error("Invalid token or role");
    workerToken = data.token;
  });

  // 3. Demo Assessor Login
  let assessorToken = "";
  await test("Demo Assessor Login (Amit Sharma)", async () => {
    const res = await fetch("http://localhost:5000/api/auth/demo-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "assessor" })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.token || data.user.role !== "assessor") throw new Error("Invalid assessor login");
    assessorToken = data.token;
  });

  // 4. Demo Admin Login
  let adminToken = "";
  await test("Demo Admin Login (Admin User)", async () => {
    const res = await fetch("http://localhost:5000/api/auth/demo-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "admin" })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.token || data.user.role !== "admin") throw new Error("Invalid admin login");
    adminToken = data.token;
  });

  // 5. Worker Dashboard Stats
  await test("Worker Dashboard Metrics", async () => {
    const res = await fetch("http://localhost:5000/api/workers/dashboard-stats", {
      headers: { Authorization: `Bearer ${workerToken}` }
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.stats || data.stats.nsqfLevel !== 4) throw new Error("Invalid dashboard stats");
  });

  // 6. AI Skill Extraction
  let extractedSkills = [];
  await test("AI Skill Extraction Engine", async () => {
    const res = await fetch("http://localhost:5000/api/ai/extract-skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experienceText: "I do house wiring, switchboard installation, fan fitting, MCB boxes, and repair tripping faults.",
        tasksPerformed: ["Electrical wiring", "Switch installation", "MCB installation"],
        toolsUsed: ["Neon Phase Tester", "Digital Multimeter"],
        yearsDeclared: 6
      })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.skills || data.skills.length === 0) throw new Error("No skills extracted");
    extractedSkills = data.skills;
  });

  // 7. QP/NOS Qualification Matching
  await test("QP/NOS Matching Engine", async () => {
    const res = await fetch("http://localhost:5000/api/mapping/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills: extractedSkills.map(s => s.name) })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.topMatch || data.topMatch.qpCode !== "ELE/Q1401") throw new Error("Top match is not ELE/Q1401");
  });

  // 8. AI Evidence Computer Vision Analysis
  await test("AI Evidence Computer Vision Scanning", async () => {
    const res = await fetch("http://localhost:5000/api/ai/analyze-evidence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: "task-1",
        taskTitle: "Electrical House Wiring & Conduit Run",
        description: "Photo showing completed switchboard wiring."
      })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.detectedComponents || data.detectedComponents.length === 0) throw new Error("No components detected");
  });

  // 9. Standardized Score Calculation
  await test("Standardized 5-Criteria Weighted Scoring Engine", async () => {
    const res = await fetch("http://localhost:5000/api/ai/calculate-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        criteriaScores: [
          { criterionId: "crit-1", assessorScore: 8.5 },
          { criterionId: "crit-2", assessorScore: 8.0 },
          { criterionId: "crit-3", assessorScore: 9.0 },
          { criterionId: "crit-4", assessorScore: 8.0 },
          { criterionId: "crit-5", assessorScore: 8.5 }
        ]
      })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.finalCalculatedScore !== 83.5) throw new Error(`Expected 83.5, got ${data.finalCalculatedScore}`);
  });

  // 10. Competency Profile & Recommendation
  await test("Competency Profile Verification", async () => {
    const res = await fetch("http://localhost:5000/api/competency/usr-worker-01", {
      headers: { Authorization: `Bearer ${workerToken}` }
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.competencyProfile || !data.competencyProfile.certificationRecommendation.includes("Recommended")) {
      throw new Error("Invalid certification recommendation");
    }
  });

  // 11. Admin Consistency Analytics (Variance 12.4 vs 6.8)
  await test("Assessor Consistency Analytics & Cohen's Kappa", async () => {
    const res = await fetch("http://localhost:5000/api/admin/consistency", {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.comparisons || data.comparisons.scoreVariance.manual !== 12.4) {
      throw new Error("Invalid consistency metrics");
    }
  });

  // 12. Admin Audit Trail
  await test("Permanent Certification Audit Log", async () => {
    const res = await fetch("http://localhost:5000/api/admin/audit-logs", {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.auditLogs || data.auditLogs.length === 0) throw new Error("No audit logs found");
  });

  // 13. Frontend Vite Server Reachability
  await test("Frontend Vite Dev Server (port 5173)", async () => {
    const res = await fetch("http://localhost:5173/");
    if (!res.ok) throw new Error(`Frontend returned ${res.status}`);
    const html = await res.text();
    if (!html.includes("RPL Assist")) throw new Error("Frontend HTML missing title");
  });

  console.log("==================================================");
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runTests();
