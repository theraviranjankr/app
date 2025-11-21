import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LearnGerman from './LearnGerman';
import FlashcardDeck from './FlashcardDeck';
import RevisionManager from './RevisionManager';
import FocusTimer from './FocusTimer';
import { Languages, Layers, BrainCircuit, Timer } from 'lucide-react';

type Tab = 'learn' | 'flashcards' | 'revision' | 'timer';

const StudyZone: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>('learn');

  useEffect(() => {
    // Allow navigation from other components to specific tabs
    if (location.state && (location.state as any).activeTab) {
        setActiveTab((location.state as any).activeTab);
    }
  }, [location.state]);

  return (
    <div className="space-y-6">
      {/* Hub Header Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('learn')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'learn'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Languages size={18} />
          Learn Today
        </button>
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'flashcards'
              ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Layers size={18} />
          Karteikarten
        </button>
        <button
          onClick={() => setActiveTab('revision')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'revision'
              ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <BrainCircuit size={18} />
          Lernplaner
        </button>
        <button
          onClick={() => setActiveTab('timer')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'timer'
              ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Timer size={18} />
          Focus Timer
        </button>
      </div>

      {/* Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        {activeTab === 'learn' && <LearnGerman />}
        {activeTab === 'flashcards' && <FlashcardDeck />}
        {activeTab === 'revision' && <RevisionManager />}
        {activeTab === 'timer' && <FocusTimer />}
      </div>
    </div>
  );
};

export default StudyZone;