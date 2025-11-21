import React from 'react';
import { ATTENDANCE_POLICIES, CONTACT_EMAIL, ICS_CALENDAR_URL } from '../constants';
import { Mail, Calendar as CalendarIcon, FileText, ExternalLink } from 'lucide-react';

const InfoHub: React.FC = () => {
  const handleSickMail = () => {
    const subject = encodeURIComponent("Krankmeldung [Dein Name] - Kurs 26 TI G2");
    const body = encodeURIComponent(
      "Sehr geehrte Damen und Herren,\n\nhiermit melde ich mich für den [Datum] krank.\n\nMit freundlichen Grüßen,\n[Dein Name]"
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Actions Column */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CalendarIcon className="text-blue-500" size={20}/>
                Aktionen
            </h3>
            <div className="space-y-3">
                <button 
                    onClick={handleSickMail}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 p-3 rounded-lg border border-red-200 transition-all font-medium group"
                >
                    <Mail size={18} className="group-hover:scale-110 transition-transform"/>
                    Krankmeldung senden
                </button>
                
                <a 
                    href={ICS_CALENDAR_URL}
                    className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-lg border border-blue-200 transition-all font-medium text-center no-underline group"
                >
                    <CalendarIcon size={18} className="group-hover:scale-110 transition-transform"/>
                    Kalender abonnieren (.ics)
                </a>
            </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-md text-white">
             <h3 className="font-bold text-lg mb-2">Wichtige Info</h3>
             <p className="text-slate-300 text-sm mb-4">
                Unentschuldigte Fehlzeiten? Meld dich sofort im Sekretariat oder schreib eine Mail.
             </p>
             <div className="text-xs font-mono bg-slate-950/50 p-2 rounded text-slate-400">
                {CONTACT_EMAIL}
             </div>
        </div>
      </div>

      {/* Policy Column */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText className="text-slate-500" size={20}/>
                Absenzenregelung
            </h3>
            <span className="text-xs text-slate-400">Stand: 24.07.2025</span>
        </div>
        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {ATTENDANCE_POLICIES.map((policy, idx) => (
                <div key={idx} className={`p-5 ${policy.important ? 'bg-amber-50/50' : ''}`}>
                    <h4 className={`text-sm font-bold mb-1 flex items-center gap-2 ${policy.important ? 'text-amber-700' : 'text-slate-700'}`}>
                        {policy.important && <AlertTriangleIcon size={14}/>}
                        {policy.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {policy.content}
                    </p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const AlertTriangleIcon = ({size}: {size: number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <path d="M12 9v4"/>
        <path d="M12 17h.01"/>
    </svg>
);

export default InfoHub;