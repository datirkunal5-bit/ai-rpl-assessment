import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../services/storage/database.js";
import { logAuditEvent } from "../services/auditService.js";

const JWT_SECRET = process.env.JWT_SECRET || "rpl_assist_super_secret_jwt_key_sih_2026_dev";

export async function register(req, res) {
  try {
    const { name, email, password, role = "worker", phone, location, trade = "Electrician" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role.toLowerCase(),
      phone: phone || "+91 98000 00000",
      location: location || "India",
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    // If worker, initialize worker profile
    if (newUser.role === "worker") {
      const newProfile = {
        id: `wp-${Date.now()}`,
        userId: newUser.id,
        fullName: name,
        age: 28,
        phone: newUser.phone,
        location: newUser.location,
        preferredLanguage: "en",
        trade,
        yearsOfExperience: 3,
        currentOccupation: "Apprentice / Assistant Electrician",
        previousWorkplaces: "Local residential wiring jobs",
        educationLevel: "10th Standard Completed",
        nsqfTargetLevel: 4,
        profileCompletionPercent: 60,
        skills: ["Electrical Wiring", "Switch Installation", "Safety Procedures"],
        toolsUsed: ["Neon Phase Tester", "Wire Stripper & Cutter", "Combination Pliers"]
      };
      db.workerProfiles.push(newProfile);
    }

    logAuditEvent({
      userId: newUser.id,
      userName: newUser.name,
      role: newUser.role,
      action: "USER_REGISTERED",
      entity: "User",
      entityId: newUser.id,
      newValue: `Registered as ${newUser.role}`
    });

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      success: true,
      message: "Account registered successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        location: newUser.location
      }
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: "Internal server error during registration" });
  }
}

export async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or credentials" });
    }

    if (role && user.role !== role.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: `Account role mismatch: Account is registered as '${user.role}', not '${role}'`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    logAuditEvent({
      userId: user.id,
      userName: user.name,
      role: user.role,
      action: "USER_LOGIN",
      entity: "User",
      entityId: user.id,
      newValue: `Logged in from IP/Client`
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Internal server error during login" });
  }
}

export async function demoLogin(req, res) {
  try {
    const { role = "worker" } = req.body;
    let targetEmail = "worker@rplassist.gov.in";
    if (role === "assessor") targetEmail = "assessor@rplassist.gov.in";
    if (role === "admin") targetEmail = "admin@rplassist.gov.in";

    const user = db.users.find(u => u.email === targetEmail);
    if (!user) {
      return res.status(404).json({ success: false, message: `Demo user for role ${role} not found` });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      success: true,
      message: `Logged in as Demo ${user.role.toUpperCase()}: ${user.name}`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location
      }
    });
  } catch (err) {
    console.error("Demo login error:", err);
    return res.status(500).json({ success: false, message: "Demo login failed" });
  }
}

export function getCurrentUser(req, res) {
  return res.json({
    success: true,
    user: req.user
  });
}
