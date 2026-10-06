/**
 * Qualification Packs and National Occupational Standards (QP-NOS)
 * Aligned with NCVET / NSDC / Electronic Sector Skill Council of India (ESSCI) / Power Sector Skill Council (PSSC)
 * Trade: Electrical / Electronics
 */

export const QP_NOS_DATABASE = [
  {
    id: "qp-ele-001",
    qpCode: "ELE/Q1401",
    qualificationName: "Electrician - Domestic Solutions",
    sector: "Power / Electronics",
    subSector: "Domestic Electrical Solutions",
    nsqfLevel: 4,
    description: "An Electrician (Domestic Solutions) is responsible for installing, repairing, testing and maintaining domestic electrical systems, house wiring, fixtures, switchboards, MCBs, earthing, and home appliances.",
    coreSkills: [
      "Electrical Wiring",
      "Switch Installation",
      "Fan Installation",
      "MCB Installation",
      "Socket Installation",
      "Fault Diagnosis",
      "Earthing and Grounding",
      "Safety Procedures",
      "Multimeter & Tester Usage"
    ],
    requiredTools: [
      "Neon Phase Tester",
      "Digital Multimeter",
      "Wire Stripper & Cutter",
      "Combination Pliers",
      "Insulated Screwdriver Set",
      "Hammer Drill Machine",
      "PVC Conduit Bender",
      "Insulation Tape (ISI mark)"
    ],
    nosList: [
      {
        nosCode: "ELE/N1401",
        nosName: "Prepare and assemble house wiring and conduits",
        nsqfLevel: 4,
        weightage: 25,
        performanceCriteria: [
          "Inspect wall layout and mark conduit points accurately according to blueprint",
          "Cut and bend PVC conduits with correct bend radius without damaging pipe",
          "Pull single-core PVC insulated copper cables of appropriate gauge (1.5 sq mm, 2.5 sq mm, 4.0 sq mm)",
          "Follow color-coding norms: Red/Yellow/Blue for Phase, Black for Neutral, Green for Earth"
        ]
      },
      {
        nosCode: "ELE/N1402",
        nosName: "Install switchboards, sockets, and protection devices (MCB/RCCB)",
        nsqfLevel: 4,
        weightage: 25,
        performanceCriteria: [
          "Install modular switch plate and flush metal gang boxes securely",
          "Wire 6A and 16A switches with proper phase disconnection",
          "Mount Miniature Circuit Breaker (MCB) on DIN rail and connect load appropriately",
          "Ensure no loose strands or exposed copper at terminal lugs"
        ]
      },
      {
        nosCode: "ELE/N1403",
        nosName: "Perform electrical fault diagnosis and maintenance",
        nsqfLevel: 4,
        weightage: 25,
        performanceCriteria: [
          "Use neon tester and multimeter to trace voltage, continuity, and ground leakage",
          "Identify short circuit, open circuit, and neutral break conditions",
          "Replace blown fuses, tripped MCBs, and damaged wiring safely",
          "Restore power and verify balanced load across distribution board"
        ]
      },
      {
        nosCode: "ELE/N9901",
        nosName: "Follow electrical safety and workshop health protocols",
        nsqfLevel: 4,
        weightage: 25,
        performanceCriteria: [
          "Wear proper Personal Protective Equipment (rubber-insulated gloves, safety shoes, safety goggles)",
          "Follow Lock-Out / Tag-Out (LOTO) protocols before opening live panels",
          "Keep Class C fire extinguishers and dry sand bucket within accessible reach",
          "Provide prompt first-aid treatment in case of electric shock emergency"
        ]
      }
    ],
    assessmentCriteria: [
      { id: "crit-1", name: "Technical Skill & Knowledge", weight: 0.30, description: "Accuracy of circuit wiring, wire gauge selection, terminal tightening" },
      { id: "crit-2", name: "Practical Execution & Craftsmanship", weight: 0.30, description: "Clean conduit routing, tool handling, neat termination, finish" },
      { id: "crit-3", name: "Safety Compliance (PPE & LOTO)", weight: 0.15, description: "Insulated tools, safety footwear, power de-energization verification" },
      { id: "crit-4", name: "Quality & Testing", weight: 0.15, description: "Multimeter continuity test, voltage verification, polarity check" },
      { id: "crit-5", name: "Task Completion & Speed", weight: 0.10, description: "Completed within time limit following standard workflow checklist" }
    ]
  },
  {
    id: "qp-ele-002",
    qpCode: "ELE/Q1402",
    qualificationName: "Wireman (Building & Construction)",
    sector: "Power / Construction",
    subSector: "Building Electrical Installations",
    nsqfLevel: 3,
    description: "A Wireman is responsible for laying conduits, drawing electrical wires, fitting basic electrical fixtures and establishing service connections under supervision.",
    coreSkills: [
      "Conduit Laying",
      "Wire Pulling",
      "Switch Installation",
      "Socket Installation",
      "Basic Earthing",
      "Safety Procedures"
    ],
    requiredTools: [
      "Wire Stripper",
      "Pliers",
      "Screwdriver",
      "Measuring Tape",
      "Test Lamp"
    ],
    nosList: [
      {
        nosCode: "ELE/N1404",
        nosName: "Conduit installation and cable pulling in buildings",
        nsqfLevel: 3,
        weightage: 40,
        performanceCriteria: [
          "Lay surface and concealed conduit pipes",
          "Draw electrical wires with fish tape without tearing insulation"
        ]
      },
      {
        nosCode: "ELE/N1405",
        nosName: "Basic fixture mounting and termination",
        nsqfLevel: 3,
        weightage: 40,
        performanceCriteria: [
          "Mount ceiling rose, batten holders, and single switches",
          "Ensure secure mechanical anchoring in brick and concrete walls"
        ]
      },
      {
        nosCode: "ELE/N9902",
        nosName: "Site safety and housekeeping",
        nsqfLevel: 3,
        weightage: 20,
        performanceCriteria: [
          "Clear debris after chasing and drilling",
          "Wear helmet and safety boots on construction site"
        ]
      }
    ],
    assessmentCriteria: [
      { id: "crit-1", name: "Technical Skill & Knowledge", weight: 0.30, description: "Conduit layout and basic wiring execution" },
      { id: "crit-2", name: "Practical Execution & Craftsmanship", weight: 0.30, description: "Neatness of cabling and fixture fitting" },
      { id: "crit-3", name: "Safety Compliance", weight: 0.15, description: "Adherence to site personal safety rules" },
      { id: "crit-4", name: "Quality & Testing", weight: 0.15, description: "Check continuity with test lamp" },
      { id: "crit-5", name: "Task Completion", weight: 0.10, description: "Tasks finished according to supervisor instructions" }
    ]
  },
  {
    id: "qp-ele-003",
    qpCode: "ELE/Q1403",
    qualificationName: "Electrical Maintenance Technician",
    sector: "Power / Industrial",
    subSector: "Industrial & Commercial Maintenance",
    nsqfLevel: 5,
    description: "An Electrical Maintenance Technician inspects, maintains, diagnoses, and repairs industrial electrical distribution panels, motors, star-delta starters, transformers, and automated control panels.",
    coreSkills: [
      "Industrial Wiring",
      "3-Phase Power Systems",
      "Motor & Starter Maintenance",
      "Distribution Panel Maintenance",
      "Fault Diagnosis",
      "Relay & Contactor Testing",
      "Safety Procedures",
      "Preventive Maintenance Protocols"
    ],
    requiredTools: [
      "Megger / Insulation Resistance Tester",
      "Digital Multimeter",
      "Clamp-on Ammeter",
      "Torque Wrench",
      "Phase Sequence Indicator"
    ],
    nosList: [
      {
        nosCode: "ELE/N1406",
        nosName: "Inspect and service 3-phase LT distribution switchboards",
        nsqfLevel: 5,
        weightage: 35,
        performanceCriteria: [
          "Measure phase-to-phase and phase-to-neutral voltages (415V / 230V)",
          "Inspect contact pitting on air circuit breakers and contactors",
          "Check busbar connections for hot spots and correct torque"
        ]
      },
      {
        nosCode: "ELE/N1407",
        nosName: "Diagnose induction motors and motor control centers (MCC)",
        nsqfLevel: 5,
        weightage: 35,
        performanceCriteria: [
          "Perform insulation resistance test with 500V/1000V megger",
          "Troubleshoot DOL and Star-Delta starter interlocking circuits"
        ]
      },
      {
        nosCode: "ELE/N9903",
        nosName: "Industrial high-voltage safety and emergency shutdown",
        nsqfLevel: 5,
        weightage: 30,
        performanceCriteria: [
          "Execute permit-to-work (PTW) procedures",
          "Follow arc flash protection precautions"
        ]
      }
    ],
    assessmentCriteria: [
      { id: "crit-1", name: "Technical Skill & Knowledge", weight: 0.30, description: "Three-phase circuitry, motor controls, panel schematics" },
      { id: "crit-2", name: "Practical Execution & Craftsmanship", weight: 0.30, description: "Panel troubleshooting, cable glanding, precision instrumentation" },
      { id: "crit-3", name: "Safety Compliance", weight: 0.15, description: "PTW protocols, arc-flash PPE, discharge grounding" },
      { id: "crit-4", name: "Quality & Testing", weight: 0.15, description: "Megger insulation resistance values and amp draw logs" },
      { id: "crit-5", name: "Task Completion", weight: 0.10, description: "Preventive maintenance checklist fulfilled completely" }
    ]
  }
];

export const PRACTICAL_ASSESSMENT_TASKS = [
  {
    id: "task-1",
    taskNumber: 1,
    title: "Electrical House Wiring & Conduit Run",
    trade: "Electrician",
    qpCode: "ELE/Q1401",
    estimatedTimeMinutes: 45,
    description: "Install a 2-meter PVC conduit run on the demonstration panel, pull phase, neutral, and earth cables according to ISI color-coding standards, and terminate at a junction box.",
    requiredTools: [
      "PVC Conduit Bender",
      "Hacksaw with 24 TPI blade",
      "Wire Stripper (0.5 - 6 sq mm)",
      "Combination Pliers (8 inch insulated)",
      "Screwdriver"
    ],
    safetyRequirements: [
      "Wear ISI marked rubber-insulated safety gloves (1000V rated)",
      "Wear safety goggles while cutting/drilling conduit",
      "Inspect insulation of all hand tools before beginning"
    ],
    performanceCriteria: [
      "Conduit pipe cut cleanly at 90 degrees with deburred edges",
      "Proper saddle clamps spaced at maximum 40 cm intervals",
      "Correct wire gauges used (Red 2.5 mm² phase, Black 2.5 mm² neutral, Green 1.5 mm² earth)",
      "Zero bare copper exposed outside junction terminals"
    ],
    evidenceRequired: [
      "Close-up photo of wire terminations showing color coding and ferrule marking",
      "Full view photo or short video showing aligned conduit routing and secure clamps"
    ]
  },
  {
    id: "task-2",
    taskNumber: 2,
    title: "Modular Switchboard Installation & Wiring",
    trade: "Electrician",
    qpCode: "ELE/Q1401",
    estimatedTimeMinutes: 30,
    description: "Assemble and wire a 6-module switchboard containing two 6A switches, one 6A 3-pin socket, one fan regulator, and one 16A power socket with an indicator.",
    requiredTools: [
      "Digital Multimeter",
      "Phase Tester (100-500V AC)",
      "Insulated Flathead & Phillips Screwdrivers",
      "Wire Cutter"
    ],
    safetyRequirements: [
      "Ensure circuit breaker is locked in OFF position during wiring",
      "Verify zero live voltage with tester before touching contacts",
      "Keep insulated work mat under feet"
    ],
    performanceCriteria: [
      "Phase wire connected through switch to right pin of socket (looking from front)",
      "Neutral wire firmly connected directly to left socket terminal",
      "Grounding wire connected securely to top earth socket terminal",
      "All screws torqued securely without crushing conductor strands"
    ],
    evidenceRequired: [
      "Rear view photo of the wired switchboard clearly displaying terminal connections",
      "Front view photo showing flush mounting and indicator LED illumination on power test"
    ]
  },
  {
    id: "task-3",
    taskNumber: 3,
    title: "Miniature Circuit Breaker (MCB) & DB Box Installation",
    trade: "Electrician",
    qpCode: "ELE/Q1401",
    estimatedTimeMinutes: 35,
    description: "Install a 32A Double Pole (DP) Isolator and two Single Pole 16A C-Curve MCBs onto a DIN rail inside a distribution box. Connect incoming mains and distribute branch circuits with busbar/links.",
    requiredTools: [
      "Insulated Screwdriver Set",
      "Crimping Tool for cable lugs",
      "Cable Stripper",
      "Digital Multimeter"
    ],
    safetyRequirements: [
      "Confirm incoming mains isolator is locked out (LOTO tag applied)",
      "Check with calibrated digital multimeter for absence of voltage across all terminals",
      "Wear electrical safety boots with rubber soles"
    ],
    performanceCriteria: [
      "Isolator and MCBs firmly snapped onto DIN rail without play",
      "Line (incoming) connected to top terminals, Load (outgoing) to bottom terminals as specified",
      "Neutral link bar and Earth bar properly separated and torqued",
      "Clear labeling of each circuit breaker branch"
    ],
    evidenceRequired: [
      "Clear photo of opened Distribution Box showing neat dress cabling and busbar connections",
      "Close-up photo of MCB ratings and cable lug crimping"
    ]
  },
  {
    id: "task-4",
    taskNumber: 4,
    title: "Electrical Fault Diagnosis & Troubleshooting",
    trade: "Electrician",
    qpCode: "ELE/Q1401",
    estimatedTimeMinutes: 40,
    description: "Troubleshoot a simulated residential electrical failure panel displaying an intermittent tripping MCB, open neutral, and reversed socket polarity.",
    requiredTools: [
      "Digital Multimeter with continuity buzzer",
      "Neon Phase Tester",
      "Test Lamp (100W incandescent in safety cage)"
    ],
    safetyRequirements: [
      "Maintain one-hand rule when probing unfamiliar live test points",
      "Do not bypass any fuse or circuit protective device during testing",
      "Check test leads for cracked insulation before probe contact"
    ],
    performanceCriteria: [
      "Correctly identify root cause of MCB trip (short circuit vs neutral leakage)",
      "Locate open neutral point using voltage drop measurement",
      "Demonstrate socket polarity test with multimeter (230V Phase-Neutral, 230V Phase-Earth, <2V Neutral-Earth)",
      "Rectify fault and verify safe operating values"
    ],
    evidenceRequired: [
      "Photo of multimeter screen showing test reading at diagnosed fault point",
      "Worker note or checklist sheet documenting step-by-step diagnostic reasoning"
    ]
  },
  {
    id: "task-5",
    taskNumber: 5,
    title: "Electrical Safety, Earthing & First-Aid Protocol",
    trade: "Electrician",
    qpCode: "ELE/Q1401",
    estimatedTimeMinutes: 25,
    description: "Demonstrate proper earthing loop impedance check, selection and inspection of Personal Protective Equipment (PPE), Lock-Out / Tag-Out procedure, and emergency response for electric shock.",
    requiredTools: [
      "Earth Resistance Tester / Clamp Meter",
      "LOTO Safety Padlock and Tag",
      "Safety Helmet, 1000V Gloves, Safety Shoes",
      "First Aid Kit & CPR Dummy or Poster Demonstration"
    ],
    safetyRequirements: [
      "Zero tolerance for PPE violation during demonstration",
      "Proper handling of simulated shock victim using non-conductive wooden/fiber stick"
    ],
    performanceCriteria: [
      "Pre-inspection of rubber gloves for pinhole air leaks",
      "Correct placement of LOTO danger tag on master breaker",
      "Measurement of earth pit resistance value (< 5 Ohms)",
      "Accurate recital and demonstration of CPR and recovery position"
    ],
    evidenceRequired: [
      "Photo of worker properly attired in full PPE holding insulated tools",
      "Photo or video of LOTO tag attached to main power isolation switch"
    ]
  }
];
