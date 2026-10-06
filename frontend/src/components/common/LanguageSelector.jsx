import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSelector({ compact = false }) {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' }
  ];

  return (
    <div className="flex items-center gap-1">
      {!compact && <Globe className="w-4 h-4 text-slate-500" />}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs rounded-md px-2 py-1 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
        aria-label="Select Interface Language"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native} ({l.label})
          </option>
        ))}
      </select>
    </div>
  );
}
