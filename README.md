# RPL Assist — AI-Assisted Recognition of Prior Learning Platform

> **Subtitle:** AI-Assisted Recognition of Prior Learning Assessment Platform for India's Informal Trade Workforce  
> **Initial Trade Focus:** ELECTRICIAN (NSQF Level 4 • QP Code: `ELE/Q1401`)  
> **Framework:** National Skills Qualification Framework (NSQF) & NCVET Guidelines  

---

## ⚠️ Important Regulatory & Certification Disclaimer

> **Human-in-the-Loop Safeguard:**  
> **This prototype demonstrates an AI-assisted RPL assessment workflow. It is NOT an official certification platform and does NOT replace authorized assessment or certification authorities (such as NCVET, NSDC, or accredited Sector Skill Councils).**  
> **The AI system supports human assessors with skill extraction, QP/NOS alignment, visual evidence suggestions, and rubric standardization. The AI does NOT independently certify a worker. The final assessment decision belongs exclusively to authorized human assessors.**

---

## 1. Problem Statement

A significant proportion of India’s skilled workforce has acquired trade competencies informally—through apprenticeship-style on-the-job experience rather than formal institutional schooling—and possesses no formal credential to demonstrate their capability.

While NCVET's **Recognition of Prior Learning (RPL)** framework exists to evaluate and formally certify these workers against **National Skills Qualification Framework (NSQF)** levels without forcing them into redundant training, traditional implementation suffers from critical operational bottlenecks:

1. **Assessor Inconsistency & High Variance:** Manual practical evaluations vary significantly across assessors and regional centers.
2. **Scheduling & Economic Barriers:** Informal daily-wage workers cannot afford taking multiple days off work to travel to distant assessment centers.
3. **Slow to Scale:** Shortage of certified assessors creates a nationwide administrative backlog.
4. **Undocumented Skill Mapping:** Informal speech and trade jargon are difficult to map systematically to formal National Occupational Standards (NOS).

---

## 2. Solution: RPL Assist

**RPL Assist** is a full-stack, AI-assisted, human-in-the-loop web platform engineered to streamline the end-to-end RPL evaluation process:

- **Structured Worker Self-Declaration:** Multi-step accessible interface supporting colloquial descriptions and simulated voice input in **English, Hindi, and Marathi**.
- **AI Skill Extraction Engine:** Parses informal descriptions, tools, and tasks into standardized competencies with confidence metrics.
- **Explainable QP/NOS Matching:** Transparently aligns candidate skill profiles to official NCVET Qualification Packs with detailed *"Why this match?"* reasoning.
- **Guided Practical Assessment:** Standardized rubrics with timers, task instructions, safety protocols, and evidence requirements.
- **AI Computer Vision Evidence Assistance:** Scans photographic/video proof for PPE safety gear (1000V gloves, eye protection) and circuit components (conduits, MCBs, multimeters).
- **Standardized 5-Criteria Rubric:** Standardized weights (*Technical Skill 30%, Practical Execution 30%, Safety 15%, Quality 15%, Task Completion 10%*) reducing assessor variance.
- **Assessor Override & Veto:** Certified human assessors review evidence, adjust criteria scores, and add comments. AI suggestions never override human judgment.
- **Verified Competency Profile:** Issues a formal RPL Competency Assessment Profile with radar/bar dimension breakdowns and certification recommendations.
- **Assessor Consistency Analytics:** Directorate dashboard comparing score variance (12.4 manual vs 6.8 AI-assisted) and inter-assessor agreement (Cohen's Kappa).
- **Offline-First PWA Capability:** Local drafts and IndexedDB/localStorage sync queue for field centers with intermittent connectivity.

---

## 3. Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS, React Router v6, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js (v20+ / v22+), Express.js 4, Multer, JWT, bcryptjs |
| **Database** | Dual Mode: MongoDB / Mongoose with automatic, zero-dependency In-Memory Store fallback |
| **Offline / PWA** | Service Worker (`sw.js`), Web App Manifest, Local Storage Sync Queue, Online/Offline Detection |
| **AI Architecture** | Backend AI Service with deterministic, rule-based NCVET taxonomy & LLM provider abstraction |

---

## 4. Primary User Roles & Demo Credentials

The platform includes **1-Click Demo & Role Login** on the login page and top Workflow Navigator bar:

| Role | Demo Name | Email | Password | Primary Console |
|---|---|---|---|---|
| **Worker (Candidate)** | Ramesh Patil (6y Electrician) | `worker@rplassist.gov.in` | `worker123` | `/worker/dashboard` |
| **Assessor** | Amit Sharma (Lead NCVET Assessor) | `assessor@rplassist.gov.in` | `assessor123` | `/assessor/dashboard` |
| **Admin (Directorate)** | Admin User | `admin@rplassist.gov.in` | `admin123` | `/admin/dashboard` |

---

## 5. End-to-End Workflow (The 10 Platform Assessment Steps)

Use the top **Workflow Navigator** to click through or run the complete evaluation flow:

1. **Step 1: Worker Login:** Candidate accesses personalized portal; views NSQF Level 4 target and 7-step roadmap.
2. **Step 2: Self-Declaration:** 5-step intuitive form declaring years of experience, task checkboxes, voice/text description, and tools used.
3. **Step 3: AI Skill Extraction:** Natural language engine identifies practical skills with confidence ratings (e.g. Electrical Wiring 92%, Switchboard 95%, MCB 87%). Worker confirms inventory.
4. **Step 4: QP/NOS Matching:** Evaluates Electrician (`ELE/Q1401` 92%), Wireman (`ELE/Q1402` 78%), and Maintenance Tech (`ELE/Q1403` 71%) with transparent *"Why this match?"* breakdown.
5. **Step 5: Practical Tasks:** 5 structured tasks (Conduit Wiring, Modular Switchboard, MCB Box, Fault Diagnosis, Earthing & Safety) with stop-watches and execution checklists.
6. **Step 6: Practical Evidence & AI Vision:** Uploads photo/video proofs; AI vision assistant inspects work area, components, and PPE safety gear.
7. **Step 7: Assessor Queue & Review:** Certified assessor opens candidate dossier, inspects original narrative, and reviews evidence side-by-side.
8. **Step 8: Standardized Scoring & Overrides:** Assessor adjusts 5-criteria weights; overrides AI baseline scores; system dynamically calculates final score.
9. **Step 9: Competency Profile:** Generates official RPL Candidate Competency Profile certificate (83.3% overall score, dimension breakdown, strengths, improvement areas, print/download ready).
10. **Step 10: Assessor Consistency Analytics:** Administrative console displays variance reduction (12.4 down to 6.8) and Cohen's Kappa multi-assessor concordance.

---

## 6. Project Structure

```
rpl-assist/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── aiController.js
│   │   │   ├── assessmentController.js
│   │   │   ├── authController.js
│   │   │   ├── competencyController.js
│   │   │   ├── notificationController.js
│   │   │   ├── syncController.js
│   │   │   └── workerController.js
│   │   ├── data/
│   │   │   └── qpNosData.js          # NCVET QP/NOS Standards & 5 Practical Tasks
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT verification & role authorization
│   │   │   └── upload.js             # Multer upload & MIME validation
│   │   ├── routes/
│   │   │   └── api.js                # Centralized REST API endpoints
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   │   ├── evidenceAnalysisService.js
│   │   │   │   ├── qualificationMatchingService.js
│   │   │   │   ├── scoringAssistantService.js
│   │   │   │   └── skillExtractionService.js
│   │   │   ├── storage/
│   │   │   │   └── database.js       # Dual MongoDB & zero-dependency In-Memory Store
│   │   │   └── auditService.js       # Immutable audit logs & notifications
│   │   └── server.js                 # Express server on port 5000
│   ├── test-e2e.js                   # Comprehensive automated test suite (13 passing tests)
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   ├── manifest.json             # PWA configuration
│   │   ├── sw.js                     # Offline Service Worker
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── DemoBar.jsx       # 1-Click Workflow Navigator & Role Switcher
│   │   │       ├── Footer.jsx        # NCVET disclaimer & certification safeguards
│   │   │       ├── LanguageSelector.jsx
│   │   │       ├── Navbar.jsx        # Role-based navigation & notification popover
│   │   │       └── OfflineBanner.jsx # PWA offline status & sync queue triggers
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── LanguageContext.jsx   # English, Hindi, Marathi support
│   │   │   ├── NotificationContext.jsx
│   │   │   └── OfflineContext.jsx    # Simulated & real offline sync management
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AuditLogPage.jsx
│   │   │   │   ├── ConsistencyAnalyticsPage.jsx
│   │   │   │   └── QpNosLibraryPage.jsx
│   │   │   ├── assessor/
│   │   │   │   ├── AssessorDashboard.jsx
│   │   │   │   ├── EvidenceReviewPage.jsx
│   │   │   │   ├── ScoringPage.jsx
│   │   │   │   └── WorkerDetailReview.jsx
│   │   │   ├── worker/
│   │   │   │   ├── AssessmentTasksPage.jsx
│   │   │   │   ├── CompetencyProfileView.jsx
│   │   │   │   ├── EvidenceUploadPage.jsx
│   │   │   │   ├── QualificationMatchPage.jsx
│   │   │   │   ├── SelfDeclarationPage.jsx
│   │   │   │   ├── SkillAnalysisPage.jsx
│   │   │   │   └── WorkerDashboard.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   └── LoginPage.jsx
│   │   ├── services/
│   │   │   ├── api.js                # API client with token interception
│   │   │   └── offlineStorage.js     # IndexedDB / localStorage queue
│   │   ├── utils/
│   │   │   └── translations.js       # Centralized multilingual strings
│   │   ├── App.jsx                   # Central routing architecture
│   │   ├── index.css                 # Enterprise government design system
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

---

## 7. Installation & Quick Start

### Prerequisites
- **Node.js** v20.x or v22.x
- **npm** v10.x
- *(Optional)* MongoDB locally or MongoDB Atlas URI (if absent, the platform automatically boots its embedded zero-dependency datastore).

### Step 1: Clone & Install Dependencies

```bash
# In the root repository directory:
cd backend
npm install

cd ../frontend
npm install
```

### Step 2: Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/rpl_assist
JWT_SECRET=rpl_assist_super_secret_jwt_key_production_dev
AI_PROVIDER=mock
# Optional real AI provider key (e.g. Gemini or OpenAI)
AI_API_KEY=
AI_MODEL=gemini-1.5-flash
CLIENT_URL=http://localhost:5173
```

### Step 3: Run the Prototype

**Terminal 1 (Backend API):**
```bash
cd backend
npm start
# Server starts on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Vite server starts on http://localhost:5173
```

Open your browser at `http://localhost:5173`.

---

## 8. Automated End-to-End Test Suite

Run the comprehensive test suite verifying all 13 core endpoints and algorithms:

```bash
cd backend
node test-e2e.js
```

**Output:**
```
==================================================
  RPL ASSIST - END-TO-END VERIFICATION TEST SUITE
==================================================
  ✓ [PASS] API Health Endpoint
  ✓ [PASS] Demo Worker Login (Ramesh Patil)
  ✓ [PASS] Demo Assessor Login (Amit Sharma)
  ✓ [PASS] Demo Admin Login (Admin User)
  ✓ [PASS] Worker Dashboard Metrics
  ✓ [PASS] AI Skill Extraction Engine
  ✓ [PASS] QP/NOS Matching Engine
  ✓ [PASS] AI Evidence Computer Vision Scanning
  ✓ [PASS] Standardized 5-Criteria Weighted Scoring Engine
  ✓ [PASS] Competency Profile Verification
  ✓ [PASS] Assessor Consistency Analytics & Cohen's Kappa
  ✓ [PASS] Permanent Certification Audit Log
  ✓ [PASS] Frontend Vite Dev Server (port 5173)
==================================================
  TEST RESULTS: 13 PASSED, 0 FAILED
==================================================
```

---

## 9. Production Deployment

### Frontend (Vercel)
- Set Root Directory to `frontend`.
- Build Command: `npm run build`
- Output Directory: `dist`
- Set Environment Variable: `VITE_API_URL=https://your-backend-service.onrender.com`

### Backend (Render / Railway)
- Set Root Directory to `backend`.
- Build Command: `npm install`
- Start Command: `npm start`
- Set Environment Variables:
  - `MONGO_URI`: MongoDB Atlas connection string
  - `JWT_SECRET`: Secure production secret
  - `PORT`: `5000` (or injected port)

---

## 10. Future Scalability Roadmap

1. **Additional Trade Packs:** Expand schema to Plumbing (`PSC/Q0101`), Masonry (`CON/Q0101`), and Automotive (`ASC/Q1401`).
2. **On-Device Edge Vision Models:** Run TensorFlow.js / ONNX quantized models locally on mobile devices for real-time safety gear guidance without cellular data.
3. **DigiLocker Integration:** Direct issuance of verifiable, digitally signed micro-credentials to candidate national DigiLocker accounts via Indian Citizen Stack API.
4. **Multi-Assessor Double-Blind Trials:** Real-world pilot validation to measure weighted Cohen's Kappa agreement across accredited industrial training institutes.
