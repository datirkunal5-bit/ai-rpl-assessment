import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { User, Phone, MapPin, Globe, Briefcase, Wrench, Check, Save, ArrowRight } from 'lucide-react';

export default function WorkerProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    fullName: "Ramesh Patil",
    age: 32,
    phone: "+91 98201 44521",
    location: "Pune, Maharashtra",
    preferredLanguage: "mr",
    trade: "Electrician",
    yearsOfExperience: 6,
    currentOccupation: "Independent Domestic Electrician",
    previousWorkplaces: "Subhash Electricals (3 yrs), Local Society Maintenance (3 yrs)",
    skills: ["Electrical Wiring", "Switch Installation", "MCB Installation", "Fault Diagnosis"],
    toolsUsed: ["Neon Phase Tester", "Digital Multimeter", "Combination Pliers", "Insulated Screwdriver"]
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.getWorkerProfile();
        if (res.success && res.profile) {
          setProfile(prev => ({ ...prev, ...res.profile }));
        }
      } catch (e) {
        // use default profile
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await api.updateWorkerProfile(profile);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert("Failed to save profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-slate-900">
          Candidate Profile & Trade Credentials
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Personal identification, background, and practical trade exposure details.
        </p>
      </div>

      {savedSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-sm font-semibold">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>Profile updated successfully! Information saved to central NCVET candidate registry.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        {/* Large Accessible Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Full Name (पूरा नाम / पूर्ण नाव)
            </label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full text-base px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              Age (आयु / वय)
            </label>
            <input
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
              className="w-full text-base px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              min="18"
              max="70"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              Mobile Phone (मोबाइल नंबर)
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full text-base px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              City & State (शहर / राज्य)
            </label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full text-base px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              Preferred Language (पसंदीदा भाषा)
            </label>
            <select
              value={profile.preferredLanguage}
              onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value })}
              className="w-full text-base px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
            >
              <option value="mr">Marathi (मराठी)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Years of Experience (अनुभव के वर्ष)
            </label>
            <input
              type="number"
              value={profile.yearsOfExperience}
              onChange={(e) => setProfile({ ...profile, yearsOfExperience: Number(e.target.value) })}
              className="w-full text-base px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              min="1"
              max="40"
              required
            />
          </div>
        </div>

        {/* Current Occupation */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            Current Occupation / Nature of Work
          </label>
          <input
            type="text"
            value={profile.currentOccupation}
            onChange={(e) => setProfile({ ...profile, currentOccupation: e.target.value })}
            placeholder="e.g. Domestic House Electrician / Contractor Assistant"
            className="w-full text-base px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        {/* Previous Employers & Workplaces */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            Previous Workplaces & Senior Contractors
          </label>
          <textarea
            rows="2"
            value={profile.previousWorkplaces}
            onChange={(e) => setProfile({ ...profile, previousWorkplaces: e.target.value })}
            placeholder="Name of electrical shops, senior ustads, or apartment societies where you worked"
            className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Profile...' : 'Save Profile Details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
