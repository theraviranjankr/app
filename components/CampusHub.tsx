
import React, { useState } from 'react';
import SemesterEvents from './SemesterEvents';
import StudentList from './StudentList';
import AttendanceTracker from './AttendanceTracker';
import InfoHub from './InfoHub';
import GradeTracker from './GradeTracker';
import { Calendar, Users, PieChart, Info, Award } from 'lucide-react';

type Tab = 'events' | 'students' | 'attendance' | 'info' | 'grades';

const CampusHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('events');

  return (
    <div className="space-y-6">
      {/* Hub Header Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex min-w-max gap-2">
            <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'events'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
            >
            <Calendar size={18} />
            Termine
            </button>
            <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'students'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
            >
            <Users size={18} />
            Teilnehmer
            </button>
            <button
            onClick={() => setActiveTab('grades')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'grades'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
            >
            <Award size={18} />
            Noten
            </button>
            <button
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'attendance'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
            >
            <PieChart size={18} />
            Fehlzeiten
            </button>
            <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'info'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
            >
            <Info size={18} />
            Infos
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        {activeTab === 'events' && <SemesterEvents />}
        {activeTab === 'students' && <StudentList />}
        {activeTab === 'grades' && <GradeTracker />}
        {activeTab === 'attendance' && <AttendanceTracker />}
        {activeTab === 'info' && <InfoHub />}
      </div>
    </div>
  );
};

export default CampusHub;
