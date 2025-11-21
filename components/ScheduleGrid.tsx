import React, { useState } from 'react';
import { WEEK_SCHEDULE } from '../constants';
import { DayOfWeek, ClassSession } from '../types';
import { Clock, MapPin, User, X } from 'lucide-react';

const days = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
];

const ScheduleGrid: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);

  const getClassesForDay = (day: DayOfWeek) => {
    return WEEK_SCHEDULE.filter((s) => s.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

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
        current.endTime === next.startTime
      ) {
        merged.push({
          ...current,
          endTime: next.endTime,
        });
        i += 2; // Skip next
      } else {
        merged.push(current);
        i++;
      }
    }
    return merged;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Wochenplan
        </h2>
        <div className="text-sm text-slate-500 hidden sm:block">
             Wintersemester 25/26
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {days.map((day) => {
          const sessions = getMergedClasses(getClassesForDay(day));
          return (
            <div key={day} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-full min-h-[300px]">
              <div className="bg-slate-50 p-3 border-b border-slate-200">
                <h3 className="font-semibold text-slate-700 text-center">{day}</h3>
              </div>
              <div className="p-2 space-y-2 flex-1">
                {sessions.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm py-4">Frei</div>
                ) : (
                  sessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className={`w-full text-left p-3 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${
                        session.subject.includes("Deutsch") ? "border-orange-400 bg-orange-50" :
                        session.subject.includes("Physik") ? "border-blue-400 bg-blue-50" :
                        session.subject.includes("Informatik") ? "border-purple-400 bg-purple-50" :
                        session.subject.includes("Chemie") ? "border-green-400 bg-green-50" :
                        "border-slate-400 bg-slate-50"
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-500 mb-1">
                        {session.startTime} - {session.endTime}
                      </div>
                      <div className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">
                        {session.subject}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                        <span className="flex items-center gap-1 truncate max-w-[80px]" title={session.teacher}>
                            <User size={12} /> {session.teacher}
                        </span>
                        <span className="flex items-center gap-1 font-mono bg-white px-1 rounded border whitespace-nowrap">
                            <MapPin size={12} /> {session.room}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div 
                className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`p-6 ${
                     selectedSession.subject.includes("Deutsch") ? "bg-orange-50" :
                     selectedSession.subject.includes("Physik") ? "bg-blue-50" :
                     selectedSession.subject.includes("Informatik") ? "bg-purple-50" :
                     selectedSession.subject.includes("Chemie") ? "bg-green-50" :
                     "bg-slate-50"
                }`}>
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-slate-800 leading-tight">
                            {selectedSession.subject}
                        </h3>
                        <button 
                            onClick={() => setSelectedSession(null)}
                            className="p-1 rounded-full hover:bg-black/10 transition-colors text-slate-500"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="flex gap-2">
                         <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/60 text-xs font-bold uppercase tracking-wider text-slate-600">
                            {selectedSession.type || 'Vorlesung'}
                         </span>
                         <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/60 text-xs font-bold uppercase tracking-wider text-slate-600">
                            {selectedSession.day}
                         </span>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="bg-white p-2 rounded-full text-blue-600 shadow-sm">
                            <Clock size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase">Zeit</div>
                            <div className="text-slate-800 font-medium">
                                {selectedSession.startTime} - {selectedSession.endTime} Uhr
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="bg-white p-2 rounded-full text-indigo-600 shadow-sm">
                            <User size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase">Dozent/in</div>
                            <div className="text-slate-800 font-medium">
                                {selectedSession.teacher}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="bg-white p-2 rounded-full text-rose-600 shadow-sm">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase">Raum</div>
                            <div className="text-slate-800 font-medium font-mono">
                                {selectedSession.room}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <button 
                        onClick={() => setSelectedSession(null)}
                        className="w-full py-2.5 bg-white border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                    >
                        Schließen
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleGrid;