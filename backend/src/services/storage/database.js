import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { QP_NOS_DATABASE, PRACTICAL_ASSESSMENT_TASKS } from "../../data/qpNosData.js";

// In-Memory store as bulletproof fallback or primary store
class MemoryStore {
  constructor() {
    this.users = [];
    this.workerProfiles = [];
    this.assessorProfiles = [];
    this.experiences = [];
    this.qualifications = [...QP_NOS_DATABASE];
    this.assessments = [];
    this.evidence = [];
    this.scores = [];
    this.competencyProfiles = [];
    this.notifications = [];
    this.auditLogs = [];
    this.syncQueue = [];
    this.isMongoConnected = false;
  }

  async init(mongoUri) {
    if (mongoUri && !mongoUri.includes("disabled")) {
      try {
        console.log("Attempting MongoDB connection to:", mongoUri);
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        this.isMongoConnected = true;
        console.log("Connected to MongoDB successfully.");
      } catch (err) {
        console.warn("MongoDB connection failed or not available. Using built-in In-Memory Datastore.", err.message);
        this.isMongoConnected = false;
      }
    } else {
      console.log("Using built-in In-Memory Datastore (Zero-dependency mode).");
    }

    await this.seedInitialData();
  }

  async seedInitialData() {
    const salt = await bcrypt.genSalt(10);
    const workerPassword = await bcrypt.hash("worker123", salt);
    const assessorPassword = await bcrypt.hash("assessor123", salt);
    const adminPassword = await bcrypt.hash("admin123", salt);

    // 1. Seed Users
    const workerUser = {
      id: "usr-worker-01",
      name: "Ramesh Patil",
      email: "worker@rplassist.gov.in",
      password: workerPassword,
      role: "worker",
      phone: "+91 98201 44521",
      location: "Pune, Maharashtra",
      createdAt: new Date("2026-09-15T09:00:00Z").toISOString()
    };

    const assessorUser = {
      id: "usr-assessor-01",
      name: "Amit Sharma",
      email: "assessor@rplassist.gov.in",
      password: assessorPassword,
      role: "assessor",
      phone: "+91 98110 33452",
      location: "New Delhi, Delhi",
      createdAt: new Date("2026-08-01T10:00:00Z").toISOString()
    };

    const adminUser = {
      id: "usr-admin-01",
      name: "Admin User",
      email: "admin@rplassist.gov.in",
      password: adminPassword,
      role: "admin",
      phone: "+91 99999 88888",
      location: "Central Skill Development Directorate, New Delhi",
      createdAt: new Date("2026-07-01T08:00:00Z").toISOString()
    };

    this.users = [workerUser, assessorUser, adminUser];

    // 2. Seed Worker Profile
    const workerProfile = {
      id: "wp-01",
      userId: workerUser.id,
      fullName: "Ramesh Patil",
      age: 32,
      phone: "+91 98201 44521",
      location: "Pune, Maharashtra",
      preferredLanguage: "mr", // Marathi / English
      trade: "Electrician",
      yearsOfExperience: 6,
      currentOccupation: "Independent Domestic Electrician & Contractor Assistant",
      previousWorkplaces: "Subhash Electricals (3 yrs), Local Housing Society Maintenance (3 yrs)",
      educationLevel: "10th Standard Completed",
      nsqfTargetLevel: 4,
      profileCompletionPercent: 95,
      skills: [
        "Electrical Wiring",
        "Switch Installation",
        "Fan Installation",
        "MCB Installation",
        "Socket Installation",
        "Fault Diagnosis",
        "Safety Procedures"
      ],
      toolsUsed: [
        "Neon Phase Tester",
        "Digital Multimeter",
        "Wire Stripper & Cutter",
        "Combination Pliers",
        "Insulated Screwdriver Set",
        "Insulation Tape"
      ]
    };
    this.workerProfiles = [workerProfile];

    // 3. Seed Assessor Profile
    const assessorProfile = {
      id: "ap-01",
      userId: assessorUser.id,
      fullName: "Amit Sharma",
      certificationId: "NCVET-ASSESSOR-2024-EL-889",
      tradeSpecialization: "Electrical & Power Distribution",
      yearsExperience: 14,
      totalAssessmentsCompleted: 142,
      rating: 4.9,
      assignedCenter: "Apex Skill Training Center, Pune"
    };
    this.assessorProfiles = [assessorProfile];

    // 4. Seed Experience Record
    const initialExperience = {
      id: "exp-01",
      workerId: workerUser.id,
      yearsOfExperience: 6,
      learningType: "Informal Apprenticeship under Senior Ustad & On-Job Practice",
      previousWorkplaces: "Subhash Electricals, Katraj; Shanti Apartments Society Maintenance",
      tasksPerformed: [
        "Electrical wiring",
        "Switch installation",
        "Fan installation",
        "MCB installation",
        "Socket installation",
        "Fault diagnosis",
        "Electrical maintenance",
        "Safety procedures"
      ],
      rawDescription: "I have worked as an electrician for 6 years in Pune. I do complete house wiring, install single and 3-phase switchboards, ceiling fans, MCB boxes, and repair tripping circuit faults with a multimeter and tester.",
      toolsUsed: [
        "Tester",
        "Multimeter",
        "Screwdriver",
        "Wire stripper",
        "Pliers",
        "Drill",
        "Insulation tape"
      ],
      createdAt: new Date("2026-09-20T11:00:00Z").toISOString(),
      status: "analyzed"
    };
    this.experiences = [initialExperience];

    // 5. Seed Assessment Record for Ramesh Patil
    const sampleAssessment = {
      id: "asm-001",
      workerId: workerUser.id,
      workerName: "Ramesh Patil",
      workerLocation: "Pune, Maharashtra",
      assessorId: assessorUser.id,
      assessorName: "Amit Sharma",
      trade: "Electrician",
      qualificationId: "qp-ele-001",
      qpCode: "ELE/Q1401",
      qualificationName: "Electrician - Domestic Solutions",
      nsqfLevel: 4,
      status: "under_review", // ready for assessor scoring in demo!
      submissionDate: new Date("2026-10-01T14:30:00Z").toISOString(),
      tasks: PRACTICAL_ASSESSMENT_TASKS.map(t => ({
        ...t,
        status: "completed",
        timeSpentMinutes: t.estimatedTimeMinutes - 5,
        completedAt: new Date("2026-10-01T15:30:00Z").toISOString()
      })),
      scores: [
        {
          criterionId: "crit-1",
          criterionName: "Technical Skill & Knowledge",
          weight: 0.30,
          aiScore: 8.5,
          assessorScore: 8.5,
          maxScore: 10,
          comment: "Accurate PVC conduit routing and 2.5 mm² wire gauge standard followed correctly."
        },
        {
          criterionId: "crit-2",
          criterionName: "Practical Execution & Craftsmanship",
          weight: 0.30,
          aiScore: 8.0,
          assessorScore: 8.0,
          maxScore: 10,
          comment: "Neat terminations and crimping inside switchboard; no loose copper strands."
        },
        {
          criterionId: "crit-3",
          criterionName: "Safety Compliance (PPE & LOTO)",
          weight: 0.15,
          aiScore: 9.0,
          assessorScore: 9.0,
          maxScore: 10,
          comment: "Rubber-insulated gloves inspected and LOTO lock applied before opening breaker box."
        },
        {
          criterionId: "crit-4",
          criterionName: "Quality & Testing",
          weight: 0.15,
          aiScore: 7.5,
          assessorScore: 8.0,
          maxScore: 10,
          comment: "Multimeter continuity check performed; verified phase polarity on right pin."
        },
        {
          criterionId: "crit-5",
          criterionName: "Task Completion & Speed",
          weight: 0.10,
          aiScore: 8.5,
          assessorScore: 8.5,
          maxScore: 10,
          comment: "All 5 tasks completed within allocated practical window."
        }
      ],
      aiOverallScore: 82.5,
      assessorOverallScore: 83.25,
      finalCalculatedScore: 83.3,
      assessorNotes: "Worker demonstrates mature hands-on craftsmanship and sound safety intuition acquired through rigorous informal apprenticeship. Recommended for official NSQF Level 4 certification.",
      recommendationStatus: "Recommended for Certification — Pending Final Authority Approval"
    };
    this.assessments = [sampleAssessment];

    // Seed another pending assessment for Assessor dashboard realism
    const pendingAssessment = {
      id: "asm-002",
      workerId: "usr-worker-02",
      workerName: "Sunil Kumar",
      workerLocation: "Nashik, Maharashtra",
      assessorId: assessorUser.id,
      assessorName: "Amit Sharma",
      trade: "Electrician",
      qualificationId: "qp-ele-001",
      qpCode: "ELE/Q1401",
      qualificationName: "Electrician - Domestic Solutions",
      nsqfLevel: 4,
      status: "submitted",
      submissionDate: new Date("2026-10-04T10:15:00Z").toISOString(),
      tasks: PRACTICAL_ASSESSMENT_TASKS.map(t => ({
        ...t,
        status: "completed"
      })),
      scores: [],
      aiOverallScore: 78.0,
      assessorOverallScore: null,
      finalCalculatedScore: null,
      assessorNotes: "",
      recommendationStatus: "Pending Assessment Review"
    };
    this.assessments.push(pendingAssessment);

    // 6. Seed Evidence items for asm-001
    this.evidence = [
      {
        id: "ev-001",
        assessmentId: "asm-001",
        taskId: "task-1",
        taskTitle: "Electrical House Wiring & Conduit Run",
        type: "image",
        fileUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
        description: "Clear photograph of completed 2-meter PVC conduit line with saddle clamps and color-coded wire harness (Red, Black, Green).",
        timestamp: new Date("2026-10-01T14:45:00Z").toISOString(),
        aiAnalysis: {
          detectedComponents: ["PVC Conduit (25mm)", "Saddle Clamps (4x)", "Phase/Neutral/Earth Cables", "Junction Box"],
          safetyEquipment: ["Insulated Hand Gloves", "Safety Goggles"],
          stepVerified: true,
          confidence: 0.92,
          observations: "Proper 40cm clamp spacing detected. Wire color coding matches Indian Standard (IS 732).",
          flags: [],
          assessorStatus: "accepted"
        }
      },
      {
        id: "ev-002",
        assessmentId: "asm-001",
        taskId: "task-2",
        taskTitle: "Modular Switchboard Installation & Wiring",
        type: "image",
        fileUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
        description: "Rear terminal view of 6-module switchboard showing tight screws, loop connections, and earthing pin termination.",
        timestamp: new Date("2026-10-01T15:10:00Z").toISOString(),
        aiAnalysis: {
          detectedComponents: ["6A Switch (2x)", "16A Power Socket", "Fan Regulator", "Modular Gang Plate"],
          safetyEquipment: ["Tester with Neon Glow Indicator"],
          stepVerified: true,
          confidence: 0.88,
          observations: "Phase routed through switch contacts correctly. Zero loose copper strands visible at terminal lugs.",
          flags: [],
          assessorStatus: "accepted"
        }
      },
      {
        id: "ev-003",
        assessmentId: "asm-001",
        taskId: "task-3",
        taskTitle: "Miniature Circuit Breaker (MCB) & DB Box Installation",
        type: "image",
        fileUrl: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
        description: "Distribution Box interior showing mounted 32A DP Isolator, DIN rail clips, and 2x 16A C-Curve breakers.",
        timestamp: new Date("2026-10-01T15:35:00Z").toISOString(),
        aiAnalysis: {
          detectedComponents: ["32A DP Isolator", "16A C-Curve MCB (2x)", "DIN Rail", "Neutral Busbar Link"],
          safetyEquipment: ["Rubber Sole Footwear", "Insulated Screwdriver (1000V)"],
          stepVerified: true,
          confidence: 0.85,
          observations: "Incoming line attached to top terminals, outgoing branches to bottom terminals. Firm DIN rail latch.",
          flags: [],
          assessorStatus: "accepted"
        }
      },
      {
        id: "ev-004",
        assessmentId: "asm-001",
        taskId: "task-4",
        taskTitle: "Electrical Fault Diagnosis & Troubleshooting",
        type: "image",
        fileUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        description: "Digital Multimeter reading 234V AC between Phase-Neutral and 0.8V between Neutral-Earth during fault resolution.",
        timestamp: new Date("2026-10-01T15:55:00Z").toISOString(),
        aiAnalysis: {
          detectedComponents: ["Digital Multimeter LCD", "Probe Leads (Cat III 600V)", "Test Board Terminal"],
          safetyEquipment: ["Insulated Probe Handles"],
          stepVerified: true,
          confidence: 0.89,
          observations: "Multimeter display indicates normal operating voltage and solid grounding reference (<2V N-E).",
          flags: [],
          assessorStatus: "accepted"
        }
      }
    ];

    // 7. Seed Competency Profile for asm-001
    this.competencyProfiles = [
      {
        id: "cp-001",
        assessmentId: "asm-001",
        workerId: workerUser.id,
        workerName: "Ramesh Patil",
        workerLocation: "Pune, Maharashtra",
        trade: "Electrician",
        qualificationName: "Electrician - Domestic Solutions",
        qpCode: "ELE/Q1401",
        nsqfLevel: 4,
        overallCompetencyPercent: 83.3,
        skillBreakdown: [
          { skill: "Electrical House Wiring", percentage: 90, grade: "Proficient" },
          { skill: "Modular Switch Installation", percentage: 85, grade: "Proficient" },
          { skill: "Ceiling Fan & Appliance Fitting", percentage: 80, grade: "Competent" },
          { skill: "MCB & Distribution Box Assembly", percentage: 84, grade: "Proficient" },
          { skill: "Fault Diagnosis & Meter Testing", percentage: 78, grade: "Competent" },
          { skill: "Occupational Safety & Earthing", percentage: 92, grade: "Exemplary" }
        ],
        strengths: [
          "Demonstrates rigorous practical intuition for color coding and terminal protection.",
          "High awareness of personal safety protocols including glove pre-checks and LOTO tagging.",
          "Strong capability in diagnosing broken neutrals and circuit tripping causes using multimeter."
        ],
        areasForImprovement: [
          "Opportunity to practice formal single-line schematic blueprint drafting.",
          "Familiarization with emerging smart home automation and IoT WiFi switches."
        ],
        assessorSummary: "Candidate displays 6+ years of valuable on-site trade maturity. Practical execution meets NCVET NSQF Level 4 benchmark standards.",
        assessorName: "Amit Sharma",
        certificationRecommendation: "Recommended for Certification — Pending Final Authority Approval",
        generatedAt: new Date("2026-10-02T11:00:00Z").toISOString()
      }
    ];

    // 8. Seed Notifications
    this.notifications = [
      {
        id: "notif-01",
        userId: workerUser.id,
        role: "worker",
        title: "Assessment Review Completed",
        message: "Assessor Amit Sharma has completed your practical assessment evaluation for Electrician - Domestic Solutions.",
        read: false,
        link: "/worker/competency-profile",
        createdAt: new Date("2026-10-02T11:05:00Z").toISOString()
      },
      {
        id: "notif-02",
        userId: assessorUser.id,
        role: "assessor",
        title: "New Practical Evidence Submitted",
        message: "Candidate Sunil Kumar (Nashik) has uploaded 4 task evidence files awaiting review.",
        read: false,
        link: "/assessor/assessments",
        createdAt: new Date("2026-10-04T10:20:00Z").toISOString()
      },
      {
        id: "notif-03",
        userId: adminUser.id,
        role: "admin",
        title: "Monthly Assessor Consistency Check Complete",
        message: "Inter-assessor score variance recorded at 6.8 (AI-assisted) vs 12.4 (Manual benchmark).",
        read: false,
        link: "/admin/consistency",
        createdAt: new Date("2026-10-05T08:00:00Z").toISOString()
      }
    ];

    // 9. Seed Audit Logs
    this.auditLogs = [
      {
        id: "aud-001",
        userId: workerUser.id,
        userName: "Ramesh Patil",
        role: "worker",
        action: "EXPERIENCE_SUBMITTED",
        entity: "Experience",
        entityId: "exp-01",
        oldValue: null,
        newValue: "6 years informal experience, 8 tasks, 7 tools declared",
        timestamp: new Date("2026-09-20T11:00:00Z").toISOString()
      },
      {
        id: "aud-002",
        userId: "system-ai",
        userName: "AI Skill Extraction Engine",
        role: "ai_service",
        action: "AI_SKILL_EXTRACTION",
        entity: "SkillAnalysis",
        entityId: "exp-01",
        oldValue: null,
        newValue: "Extracted 7 skills with 81%-95% confidence, QP matched ELE/Q1401 (92%)",
        timestamp: new Date("2026-09-20T11:02:00Z").toISOString()
      },
      {
        id: "aud-003",
        userId: workerUser.id,
        userName: "Ramesh Patil",
        role: "worker",
        action: "EVIDENCE_SUBMITTED",
        entity: "Assessment",
        entityId: "asm-001",
        oldValue: "draft",
        newValue: "submitted with 4 photographic evidence records",
        timestamp: new Date("2026-10-01T15:58:00Z").toISOString()
      },
      {
        id: "aud-004",
        userId: assessorUser.id,
        userName: "Amit Sharma",
        role: "assessor",
        action: "ASSESSOR_SCORE_OVERRIDE",
        entity: "Score",
        entityId: "asm-001",
        oldValue: "AI Score for Quality & Testing: 7.5",
        newValue: "Assessor Score for Quality & Testing: 8.0 (Override: Verified multimeter continuity audio)",
        timestamp: new Date("2026-10-02T10:45:00Z").toISOString()
      },
      {
        id: "aud-005",
        userId: assessorUser.id,
        userName: "Amit Sharma",
        role: "assessor",
        action: "ASSESSMENT_FINALIZED",
        entity: "CompetencyProfile",
        entityId: "cp-001",
        oldValue: "under_review",
        newValue: "Recommended for Certification (Final Score: 83.3%)",
        timestamp: new Date("2026-10-02T11:00:00Z").toISOString()
      }
    ];

    console.log("In-Memory datastore initialized with complete seed records.");
  }
}

export const db = new MemoryStore();
