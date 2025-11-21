
import React, { useState, useEffect } from 'react';
import { SUBJECT_METADATA } from '../constants';
import { SyllabusItem } from '../types';
import { BrainCircuit, CheckCircle2, RotateCw, TrendingUp, AlertCircle, BookOpen, Calendar, Clock, AlertTriangle, Trophy, MessageCircle, Phone, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RevisionItem extends SyllabusItem {
  subjectKey: string;
  subjectName: string;
  subjectColor: string;
  revisedThisWeek: boolean;
}

const RevisionManager: React.FC = () => {
  const [allTopics, setAllTopics] = useState<RevisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysLeft, setDaysLeft] = useState(0);
  const [userPhone, setUserPhone] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setHours(0, 0, 0, 0);
    return new Date(date.setDate(diff));
  };

  const loadData = () => {
    setLoading(true);
    const gathered: RevisionItem[] = [];
    const currentMonday = getMonday(new Date());

    const currentDay = new Date().getDay();
    const daysRemaining = currentDay === 0 ? 0 : 7 - currentDay;
    setDaysLeft(daysRemaining);
    
    const storedPhone = localStorage.getItem('user_phone');
    if (storedPhone) setUserPhone(storedPhone);

    Object.entries(SUBJECT_METADATA).forEach(([key, meta]) => {
      const storedKey = `syllabus_${key}`;
      const stored = localStorage.getItem(storedKey);
      
      let items: SyllabusItem[] = [];
      try {
          if (stored) {
            items = JSON.parse(stored);
          } else if (meta.fullSyllabus) {
            items = meta.fullSyllabus.map((title, idx) => ({
              id: `init-${idx}`,
              title,
              isDone: false,
              addedBy: 'system',
              revisionCount: 0
            }));
          }
      } catch (e) {
          console.error(`Error parsing syllabus for ${key}`, e);
          items = [];
      }

      // Filter for completed items (that need revision)
      const taughtItems = items.filter(i => i.isDone);

      taughtItems.forEach(item => {
        const lastRev = item.lastRevised ? new Date(item.lastRevised) : null;
        const revisedThisWeek = lastRev ? lastRev.getTime() >= currentMonday.getTime() : false;

        gathered.push({
          ...item,
          subjectKey: key,
          subjectName: meta.moodleName,
          subjectColor: meta.iconColor,
          revisedThisWeek
        });
      });
    });

    setAllTopics(gathered);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const savePhone = () => {
      localStorage.setItem('user_phone', userPhone);
      setShowSettings(false);
  };

  const handleRevise = (item: RevisionItem) => {
    const now = new Date().toISOString();
    
    const updatedList = allTopics.map(t => 
      t.id === item.id && t.subjectKey === item.subjectKey 
        ? { ...t, lastRevised: now, revisionCount: (t.revisionCount || 0) + 1, revisedThisWeek: true } 
        : t
    );
    setAllTopics(updatedList);

    const storedKey = `syllabus_${item.subjectKey}`;
    const stored = localStorage.getItem(storedKey);
    if (stored) {
      try {
          const parsed: SyllabusItem[] = JSON.parse(stored);
          const newStorage = parsed.map(t => 
            t.id === item.id 
              ? { ...t, lastRevised: now, revisionCount: (t.revisionCount || 0) + 1 }
              : t
          );
          localStorage.setItem(storedKey, JSON.stringify(newStorage));
      } catch (e) {
          console.error("Failed to save revision", e);
      }
    }
  };

  const sendWhatsAppReminder = () => {
      const unrevised = allTopics.filter(t => !t.revisedThisWeek);
      const completed = allTopics.length - unrevised.length;
      
      let message = `📚 *Lernplan Status - 26 TI G2* 📚\n\nHallo Raviranjan! Hier ist dein aktueller Stand:\n\n`;
      message += `✅ Erledigt: ${completed}\n`;
      message += `⭕ Offen: ${unrevised.length}\n\n`;
      
      if (unrevised.length > 0) {
          message += `*To-Do diese Woche:*\n`;
          const bySubject: Record<string, string[]> = {};
          unrevised.forEach(t => {
              if (!bySubject[t.subjectKey]) bySubject[t.subjectKey] = [];
              bySubject[t.subjectKey].push(t.title);
          });

          Object.entries(bySubject).forEach(([subject, titles]) => {
              message += `*${subject}:*\n`;
              titles.forEach(title => message += `• ${title}\n`);
              message += `\n`;
          });
          message += `Deadline: Sonntag! ⏳\n\n`;
      } else {
          message += `🎉 *Fantastisch! Alles erledigt!* 🎉\nGenieße dein Wochenende!\n\n`;
      }

      message += `_Gesendet von Raviranjan's Companion App_`;

      const cleanPhone = userPhone.replace(/\D/g, '');
      const target = cleanPhone ? cleanPhone : ''; 
      
      const url = `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
  };

  const totalTopics = allTopics.length;
  const completedThisWeek = allTopics.filter(t => t.revisedThisWeek).length;
  const remainingThisWeek = totalTopics - completedThisWeek;
  const progressPercent = totalTopics > 0 ? Math.round((completedThisWeek / totalTopics) * 100) : 0;

  let urgencyLevel: 'normal' | 'warning' | 'critical' = 'normal';
  if (remainingThisWeek > 0) {
      if (daysLeft <= 1) urgencyLevel = 'critical';
      else if (daysLeft <= 3 && progressPercent < 50) urgencyLevel = 'critical';
      else if (daysLeft <= 4 && progressPercent < 80) urgencyLevel = 'warning';
  }
  if (remainingThisWeek === 0 && totalTopics > 0) urgencyLevel = 'normal';

  const smartQueue = [...allTopics]
    .filter(t => !t.revisedThisWeek)
    .sort((a, b) => a.id.localeCompare(b.id))
    .slice(0, 5);

  const grouped = allTopics.reduce((acc, item) => {
    if (!acc[item.subjectKey]) acc[item.subjectKey] = [];
    acc[item.subjectKey].push(item);
    return acc;
  }, {} as Record<string, RevisionItem[]>);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-slate-400">
            <RotateCw className="animate-spin w-10 h-10 text-indigo-500" />
            <span className="text-sm font-medium">Berechne Wochenziel...</span>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-700 to-violet-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
              <div>
                  <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <BrainCircuit size={32} className="text-indigo-200" />
                    Lernplaner
                  </h1>
                  <p className="text-indigo-100 opacity-90 max-w-xl leading-relaxed">
                    Wiederhole jede Woche alle gelernten Themen, um den Stoff langfristig zu behalten.
                  </p>
              </div>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-indigo-100 transition-colors"
                title="Einstellungen"
              >
                  <Settings size={20} />
              </button>
          </div>
          
          {/* Phone Number Settings */}
          {showSettings && (
              <div className="mt-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 animate-in slide-in-from-top-2">
                  <h3 className="text-sm font-bold text-indigo-100 mb-2 flex items-center gap-2">
                      <Phone size={14} /> Deine WhatsApp Nummer
                  </h3>
                  <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder="z.B. 491701234567"
                        className="flex-1 px-3 py-2 rounded-lg bg-white/90 text-slate-800 text-sm placeholder-slate-400 focus:outline-none"
                      />
                      <button onClick={savePhone} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-sm">
                          Speichern
                      </button>
                  </div>
                  <p className="text-[10px] text-indigo-200 mt-2">
                      Gib deine Nummer im internationalen Format ein (ohne +).
                  </p>
              </div>
          )}

        </div>
        <div className="absolute right-0 top-0 p-8 opacity-10">
          <Calendar size={140} />
        </div>
      </div>

      {/* Weekly Dashboard */}
      <div className={`rounded-xl border-2 p-6 shadow-sm transition-all ${
          remainingThisWeek === 0 ? 'bg-green-50 border-green-200' :
          urgencyLevel === 'critical' ? 'bg-red-50 border-red-200' : 
          urgencyLevel === 'warning' ? 'bg-amber-50 border-amber-200' : 
          'bg-white border-indigo-100'
      }`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <div>
                  <h2 className={`text-xl font-bold flex items-center gap-2 ${
                      remainingThisWeek === 0 ? 'text-green-800' :
                      urgencyLevel === 'critical' ? 'text-red-800' : 
                      'text-slate-800'
                  }`}>
                      {remainingThisWeek === 0 ? (
                          <>
                            <Trophy className="text-green-600" />
                            Wochenziel erreicht!
                          </>
                      ) : (
                          <>
                            <Clock className={urgencyLevel === 'critical' ? 'text-red-600' : 'text-indigo-600'} />
                            Wochenziel: {remainingThisWeek} Themen offen
                          </>
                      )}
                  </h2>
              </div>
              
              <div className="flex gap-2">
                  {totalTopics > 0 && (
                    <button 
                        onClick={sendWhatsAppReminder}
                        className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <MessageCircle size={18} />
                        {remainingThisWeek === 0 ? "Erfolgsbericht" : "WhatsApp"}
                    </button>
                  )}
                  
                  {remainingThisWeek > 0 && (
                      <div className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 ${
                          urgencyLevel === 'critical' ? 'bg-red-200 text-red-800 animate-pulse' :
                          urgencyLevel === 'warning' ? 'bg-amber-200 text-amber-800' :
                          'bg-indigo-100 text-indigo-700'
                      }`}>
                          {daysLeft === 0 ? <AlertTriangle size={16}/> : <Calendar size={16}/>}
                          {daysLeft === 0 ? "HEUTE!" : `${daysLeft} Tage`}
                      </div>
                  )}
              </div>
          </div>

          <div className="h-4 w-full bg-white/50 rounded-full overflow-hidden border border-black/5 mb-4">
              <div 
                className={`h-full transition-all duration-500 ${
                    remainingThisWeek === 0 ? 'bg-green-500' :
                    urgencyLevel === 'critical' ? 'bg-red-500' :
                    'bg-indigo-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              ></div>
          </div>
      </div>

      {/* Smart Queue */}
      {smartQueue.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <RotateCw className="text-indigo-600" size={20} />
            Jetzt wiederholen ({smartQueue.length})
          </h3>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {smartQueue.map(item => (
              <div key={`${item.subjectKey}-${item.id}`} className="bg-white border-l-4 border-indigo-500 p-4 rounded-r-xl shadow-sm border-y border-r border-slate-200 flex flex-col justify-between group hover:shadow-md transition-all">
                 <div>
                    <div className={`text-xs font-bold uppercase mb-1 ${item.subjectColor}`}>
                      {item.subjectKey}
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2 line-clamp-2 text-sm leading-tight">{item.title}</h4>
                 </div>
                 <button 
                    onClick={() => handleRevise(item)}
                    className="w-full py-2 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95"
                 >
                    <CheckCircle2 size={16} />
                    Erledigt
                 </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Full List */}
      <section>
         <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <BookOpen className="text-slate-500" size={20} />
            Fachübersicht
          </h3>
          
          {totalTopics === 0 && (
             <div className="bg-slate-50 p-8 rounded-xl text-center border border-dashed border-slate-300">
                 <p className="text-slate-500">Noch keine Themen gelernt? <Link to="/moodle" className="text-indigo-600 font-bold hover:underline">Gehe zu den Kursen</Link> und hake ab, was du gelernt hast!</p>
             </div>
          )}
          
          <div className="space-y-6">
            {Object.entries(SUBJECT_METADATA).map(([key, meta]) => {
               const items = grouped[key] || [];
               if (items.length === 0) return null;
               items.sort((a, b) => (a.revisedThisWeek === b.revisedThisWeek) ? 0 : a.revisedThisWeek ? 1 : -1);

               return (
                 <div key={key} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className={`p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center`}>
                        <h4 className={`font-bold ${meta.iconColor} flex items-center gap-2`}>
                           {key}
                           <span className="text-xs bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500 font-normal">
                             {items.filter(i => i.revisedThisWeek).length}/{items.length} erledigt
                           </span>
                        </h4>
                        <Link to={`/course/${key}`} className="text-xs font-medium text-blue-600 hover:underline">
                           Themen verwalten
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                       {items.map(item => (
                           <div key={item.id} className={`p-3 flex items-center justify-between transition-colors ${item.revisedThisWeek ? 'bg-white opacity-60' : 'bg-orange-50/30 hover:bg-orange-50'}`}>
                              <div className="flex items-center gap-3 min-w-0">
                                 <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm ${
                                    item.revisedThisWeek ? 'bg-green-400' : 'bg-red-500 animate-pulse'
                                 }`} title={item.revisedThisWeek ? 'Diese Woche erledigt' : 'Muss diese Woche noch wiederholt werden'} />
                                 <span className={`text-sm truncate ${!item.revisedThisWeek ? 'font-medium text-slate-800' : 'text-slate-500 line-through decoration-slate-300'}`}>
                                   {item.title}
                                 </span>
                              </div>
                              <div className="flex items-center gap-2">
                                 {!item.revisedThisWeek && (
                                     <button 
                                        onClick={() => handleRevise(item)}
                                        className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-md hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors shadow-sm"
                                     >
                                        Wiederholen
                                     </button>
                                 )}
                                 {item.revisedThisWeek && (
                                    <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                                        <CheckCircle2 size={12}/> Erledigt
                                    </span>
                                 )}
                              </div>
                           </div>
                       ))}
                    </div>
                 </div>
               );
            })}
          </div>
      </section>
    </div>
  );
};

export default RevisionManager;
