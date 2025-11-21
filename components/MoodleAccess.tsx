
import React, { useEffect, useState } from 'react';
import { MOODLE_URL, SUBJECT_METADATA } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";
import { ExternalLink, GraduationCap, BookOpen, CheckCircle2, User, Sparkles, Loader2, RefreshCw, List, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Types ---

interface CourseTopic {
  subjectKey: string;
  subjectDisplayName: string;
  teacher: string;
  currentTopic: string;
  bullets: string[];
  week: number;
  moodleUrl?: string;
}

const MoodleAccess: React.FC = () => {
  // Initialize with static data immediately so links work instantly
  const [topics, setTopics] = useState<CourseTopic[]>(() => {
      return Object.entries(SUBJECT_METADATA).map(([key, meta]) => ({
          subjectKey: key,
          subjectDisplayName: meta.moodleName,
          teacher: meta.teacher,
          currentTopic: meta.defaultTopic,
          bullets: meta.defaultBullets,
          week: 1,
          moodleUrl: meta.moodleUrl
      }));
  });
  
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(1);

  useEffect(() => {
    fetchSyllabus();
  }, []);

  const fetchSyllabus = async () => {
    setIsAiLoading(true);
    try {
      const now = new Date();
      // Winter Semester usually starts Oct 1st
      const semesterStart = new Date('2025-10-01'); 
      const diffTime = Math.abs(now.getTime() - semesterStart.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      const weekNum = Math.ceil(diffDays / 7);
      setCurrentWeek(weekNum > 0 ? weekNum : 1);

      // Check if API Key is available
      if (!process.env.API_KEY) {
        console.warn("No API Key found, using fallback.");
        setIsAiLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        You are the curriculum manager for 'Studienkolleg Coburg', class '26 TI G2'.
        Current Date: ${now.toLocaleDateString('de-DE')} (Week ${weekNum} of Winter Semester).
        
        Generate a JSON array of current topics for these specific courses.
        
        CRITICAL: Use these specific syllabus schedules/milestones from Moodle to decide the topic:

        **Analysis (Hadwiger):**
        - 1. Mathematische Grundlagen (Oct) -> 2. Funktionen (Started mid-Nov). 2.3 is current but not in exam 1.

        **Physik (Stößel):**
        - Praktikum V00-V04 (Oct). V05 (Freier Fall) was late Oct.
        - Nov: 2.6 Freier Fall -> 2.7 Senkrechter Wurf -> 2.8 Waagrechter Wurf -> 2.9 Schräger Wurf (mid-Nov) -> 2.10 Kräftezerlegung (late Nov).

        **Informatik (Pfeffer):**
        - 1. Information (Late Sept).
        - 2. Textverarbeitung (Oct).
        - 3. Zahlensysteme (Started Nov 12). Current topic is 3. Zahlensysteme.

        **Chemie (Ohlraun):**
        - 1. Stoffe und Reaktionen (Oct).
        - 2. Atombau und Periodensystem (Started Nov 16).

        **Deutsch (Klug):**
        - Topics: Stadt der Zukunft, Wasser, Umwelt & Klima.
        - Grammatik: Kapitel 6 Verben, Passiv, Konjunktiv II (Nov).
        - Presentations start Nov 24 (Thema Umwelt).

        **Deutsch (Kessel):**
        - Oct: Deutschland und die Deutschen, Mark Twain.
        - Nov: Deutsche Erfindungen, Gutenberg, Sprachstrukturen.

        **Geometrie (Kessler):**
        - Oct: I. Grundlagen, II. Winkel, III. Symmetrien, IV. Flächen (late Oct).
        - Nov: V. Dreiecke im Detail (Pythagoras, Sinus/Kosinus starts mid-Nov).

        **Darstellende Geometrie (Dietel):**
        - Basics (Normen), Vielecke, Kreisanschlüsse (Oct).
        - Linienarten & Projektionsmethoden (Nov).

        Response must be JSON array with objects containing: subjectKey, currentTopic, bullets.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                subjectKey: { type: Type.STRING, description: "One of: Analysis, Physik, Informatik, Chemie, Deutsch (Klug), Deutsch (Kessel), Geometrie, Darstellende Geometrie" },
                currentTopic: { type: Type.STRING, description: "Short title of current topic" },
                bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["subjectKey", "currentTopic", "bullets"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || "[]");
      
      // Update state with AI data, preserving the structure
      setTopics(prevTopics => prevTopics.map(topic => {
          const aiItem = data.find((d: any) => d.subjectKey === topic.subjectKey || d.subjectKey.includes(topic.subjectKey.split(' ')[0]));
          if (aiItem) {
              return {
                  ...topic,
                  currentTopic: aiItem.currentTopic,
                  bullets: aiItem.bullets.slice(0, 3),
                  week: weekNum
              };
          }
          return topic;
      }));

      setIsLive(true);

    } catch (error) {
      console.error("AI Fetch failed:", error);
      // No need to "useFallback" as initial state IS fallback
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-500 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <GraduationCap size={32} />
                Meine Kurse
            </h1>
            <p className="text-orange-50 opacity-90 max-w-2xl">
                Direktzugriff auf deine Moodle-Kurse für <strong>26 TI G2</strong>.
            </p>
        </div>
        <div className="absolute right-0 top-0 p-8 opacity-10">
            <BookOpen size={120} />
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isLive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                <Sparkles size={20} />
            </div>
            <div>
                <h2 className="font-bold text-slate-800 text-sm">
                    {isLive ? `Semesterwoche ${currentWeek}` : "Offline Modus"}
                </h2>
                <p className="text-xs text-slate-500">
                   {isLive ? "Themen basierend auf Datum synchronisiert." : "Standard-Lehrplan wird angezeigt."}
                </p>
            </div>
        </div>
        
        <button 
            onClick={fetchSyllabus} 
            disabled={isAiLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 transition-colors"
        >
            {isAiLoading ? <Loader2 size={16} className="animate-spin"/> : <RefreshCw size={16}/>}
            {isAiLoading ? "Analysiere..." : "Themen aktualisieren"}
        </button>
      </div>
      
      {/* Course Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {topics.map((topic) => {
                const meta = SUBJECT_METADATA[topic.subjectKey];
                const courseUrl = meta?.moodleUrl || `${MOODLE_URL}`;

                return (
                    <div key={topic.subjectKey} className={`group relative rounded-xl border p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white border-slate-200`}>
                        {/* Color accent bar */}
                        <div className={`absolute top-0 left-0 w-full h-1.5 rounded-t-xl ${meta?.iconColor.replace('text-', 'bg-') || 'bg-slate-400'}`}></div>

                        <div className="flex justify-between items-start mb-4 mt-2">
                            <div className={`p-2.5 rounded-lg ${meta?.color} ${meta?.iconColor}`}>
                                <BookOpen size={20} />
                            </div>
                            <a 
                                href={courseUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1 transition-colors border border-blue-100 shadow-sm z-10"
                            >
                                Moodle Öffnen
                                <ExternalLink size={12} />
                            </a>
                        </div>

                        <Link to={`/course/${topic.subjectKey}`} className="block group-hover:opacity-80 transition-opacity">
                            <h3 className="font-bold text-slate-800 leading-tight mb-1 line-clamp-2 h-10" title={topic.subjectDisplayName}>
                                {topic.subjectDisplayName}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-medium">
                                <User size={14} />
                                {topic.teacher}
                            </div>

                            {/* AI Predicted Current Topic */}
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 relative overflow-hidden mb-3">
                                {isAiLoading ? (
                                    <div className="animate-pulse space-y-3">
                                        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                        <div className="space-y-2 pt-2">
                                            <div className="h-2 bg-slate-200 rounded w-full"></div>
                                            <div className="h-2 bg-slate-200 rounded w-4/5"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-wider flex items-center gap-1">
                                            {isLive && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>}
                                            Aktuell
                                        </h4>
                                        <div className="font-bold text-slate-700 mb-2 text-sm">
                                            {topic.currentTopic}
                                        </div>
                                        <ul className="space-y-1.5">
                                            {topic.bullets.map((bullet, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                                                    <CheckCircle2 size={12} className={`mt-0.5 shrink-0 ${meta?.iconColor}`} />
                                                    <span className="leading-tight line-clamp-2">{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </Link>

                        <Link 
                            to={`/course/${topic.subjectKey}`}
                            className="mt-auto border-t border-slate-100 pt-3 text-xs font-bold text-slate-500 flex items-center justify-between hover:text-blue-600 transition-colors"
                        >
                            <span className="flex items-center gap-1.5">
                                <List size={14} />
                                Themenübersicht bearbeiten
                            </span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default MoodleAccess;
