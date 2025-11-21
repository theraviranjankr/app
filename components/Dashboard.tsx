
import React, { useEffect, useState } from 'react';
import { WEEK_SCHEDULE } from '../constants';
import { DayOfWeek, ClassSession } from '../types';
import { Clock, MapPin, ArrowRight, Sun, Library, Building2, GraduationCap, CalendarDays, StickyNote, Hourglass, Save } from 'lucide-react';

// Helper to merge consecutive same-subject blocks
const getMergedClasses = (sessions: ClassSession[]) => {
  const merged: ClassSession[] = [];
  let i = 0;
  while (i < sessions.length) {
    const current = sessions[i];
    const next = sessions[i + 1];
    if (
      next && 
      current.subject === next.subject && 
      current.teacher === next.teacher && 
      next.startTime === current.endTime
    ) {
      merged.push({ ...current, endTime: next.endTime });
      i += 2;
    } else {
      merged.push(current);
      i++;
    }
  }
  return merged;
};

const Dashboard: React.FC = () => {
  const [today, setToday] = useState<DayOfWeek>(DayOfWeek.Monday);
  const [tomorrow, setTomorrow] = useState<DayOfWeek>(DayOfWeek.Tuesday);
  const [currentTime, setCurrentTime] = useState('');
  
  // Notepad State
  const [note, setNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = [DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Saturday];
      setToday(days[now.getDay()]);

      const tmrwDate = new Date(now);
      tmrwDate.setDate(now.getDate() + 1);
      setTomorrow(days[tmrwDate.getDay()]);

      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);

    // Load note
    const savedNote = localStorage.getItem('dashboard_note');
    if (savedNote) setNote(savedNote);

    return () => clearInterval(interval);
  }, []);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNote(e.target.value);
      setNoteSaved(false);
  };

  const saveNote = () => {
      localStorage.setItem('dashboard_note', note);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2000);
  };

  // Exam Calculation
  const examDate = new Date('2026-02-15'); // Estimated FSP Date
  const now = new Date();
  const daysUntilExam = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

  const todaysClasses = WEEK_SCHEDULE.filter(c => c.day === today).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const tomorrowsClasses = WEEK_SCHEDULE.filter(c => c.day === tomorrow).sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  const mergedToday = getMergedClasses(todaysClasses);
  const mergedTomorrow = getMergedClasses(tomorrowsClasses);

  const SessionCard = ({ session, isTomorrow = false }: { session: ClassSession, isTomorrow?: boolean }) => (
    <div className={`p-5 rounded-2xl border flex items-center justify-between group transition-all duration-300 ${isTomorrow ? 'bg-white/80 border-slate-200 hover:bg-white hover:shadow-lg' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1'}`}>
        <div className="flex items-center gap-4">
            <div className={`font-mono text-sm px-3 py-2 rounded-xl font-bold transition-colors ${isTomorrow ? 'bg-slate-100 text-slate-500' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                {session.startTime}
            </div>
            <div>
                <div className="font-bold text-slate-800 text-lg">{session.subject}</div>
                <div className="text-xs font-medium text-slate-500">{session.teacher} • {session.type}</div>
            </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group-hover:border-indigo-100">
            <MapPin size={14}/>
            {session.room}
        </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500 opacity-10 rounded-full blur-3xl transform -translate-x-10 translate-y-10"></div>

        <div className="relative z-10 flex justify-between items-end">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-bold uppercase tracking-wider mb-3">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    {today}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">Namaste, Raviranjan! 🙏</h1>
                <p className="text-indigo-100 max-w-lg leading-relaxed opacity-90 font-medium text-lg">
                    Bereit für einen produktiven Tag? Hier ist dein Überblick.
                </p>
            </div>
            <div className="text-right hidden sm:block">
                <div className="text-6xl font-light tracking-tighter opacity-40">{currentTime}</div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Schedule */}
        <div className="lg:col-span-2 space-y-8">
            {/* Heute */}
            <section>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-5">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Clock size={20} />
                    </div>
                    Heute <span className="text-sm font-medium text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100">Focus Mode</span>
                </h2>
                
                {mergedToday.length > 0 ? (
                    <div className="grid gap-4">
                        {mergedToday.map((session) => (
                            <SessionCard key={session.id} session={session} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gradient-to-br from-indigo-50 to-white p-10 rounded-3xl border border-dashed border-indigo-200 text-center">
                        <div className="inline-flex p-4 bg-white rounded-full shadow-sm mb-4">
                             <Sun className="text-amber-500" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">Keine Vorlesungen heute</h3>
                        <p className="text-slate-500">Nutze den Tag zum Lernen oder Entspannen! 🎉</p>
                    </div>
                )}
            </section>

            {/* Morgen */}
            <section>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-5">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                        <Sun size={20} />
                    </div>
                    Morgen <span className="text-sm font-normal text-slate-400">({tomorrow})</span>
                </h2>
                
                {mergedTomorrow.length > 0 ? (
                    <div className="grid gap-3 opacity-80 hover:opacity-100 transition-opacity">
                        {mergedTomorrow.map((session) => (
                            <SessionCard key={`tmrw-${session.id}`} session={session} isTomorrow={true} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center text-slate-400 text-sm font-medium">
                        Morgen stehen keine Vorlesungen an.
                    </div>
                )}
            </section>
        </div>

        {/* Right Column: Widgets & Hubs */}
        <div className="space-y-6">
            
            {/* Exam Countdown Widget */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                        <Hourglass size={14} className="animate-spin-slow" /> Semester Countdown
                    </div>
                    <div className="text-4xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{daysUntilExam} Tage</div>
                    <div className="text-sm text-slate-400 font-medium">bis zu den FSP Prüfungen</div>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
                     <GraduationCap size={120} />
                </div>
            </div>

            {/* Quick Notes Widget */}
            <div className="bg-yellow-50/80 backdrop-blur-sm p-5 rounded-3xl border border-yellow-100 shadow-sm relative group hover:shadow-md transition-all">
                 <div className="flex justify-between items-center mb-3">
                     <h3 className="font-bold text-yellow-800 flex items-center gap-2 text-sm">
                         <StickyNote size={16} className="fill-yellow-500 text-yellow-600"/> Notizblock
                     </h3>
                     <button 
                        onClick={saveNote} 
                        className={`p-2 rounded-lg transition-all ${noteSaved ? 'bg-green-500 text-white shadow-lg scale-110' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                        title="Speichern"
                     >
                         <Save size={14} />
                     </button>
                 </div>
                 <textarea 
                    value={note}
                    onChange={handleNoteChange}
                    placeholder="Schreib was auf..."
                    className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-700 resize-none h-32 placeholder-yellow-400/50 leading-relaxed font-medium"
                 />
            </div>

            {/* Hub Navigation Grid */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Schnellzugriff</h2>
                <div className="grid gap-3">
                    <div onClick={() => window.location.hash = "#/schedule"} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all cursor-pointer group flex justify-between items-center">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <CalendarDays size={20} />
                             </div>
                             <span className="font-bold text-slate-700 group-hover:text-blue-700">Stundenplan</span>
                        </div>
                        <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"/>
                    </div>

                    <div onClick={() => window.location.hash = "#/moodle"} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-orange-100 transition-all cursor-pointer group flex justify-between items-center">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <GraduationCap size={20} />
                             </div>
                             <span className="font-bold text-slate-700 group-hover:text-orange-700">Kurse</span>
                        </div>
                        <ArrowRight size={16} className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"/>
                    </div>

                    <div onClick={() => window.location.hash = "#/study"} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-100 transition-all cursor-pointer group flex justify-between items-center">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Library size={20} />
                             </div>
                             <span className="font-bold text-slate-700 group-hover:text-emerald-700">Study Zone</span>
                        </div>
                        <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all"/>
                    </div>

                    <div onClick={() => window.location.hash = "#/campus"} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-purple-100 transition-all cursor-pointer group flex justify-between items-center">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Building2 size={20} />
                             </div>
                             <span className="font-bold text-slate-700 group-hover:text-purple-700">Campus Hub</span>
                        </div>
                        <ArrowRight size={16} className="text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all"/>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
