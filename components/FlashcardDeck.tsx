
import React, { useState, useEffect, useRef } from 'react';
import { Flashcard } from '../types';
import { RotateCw, Volume2, CheckCircle2, XCircle, Layers, Plus, Trash2, Clock, BrainCircuit, ChevronRight, Download, Upload, FileText } from 'lucide-react';

const FlashcardDeck: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [dueCardsCount, setDueCardsCount] = useState(0);
  
  // Study Session State
  const [studyMode, setStudyMode] = useState(false);
  const [sessionQueue, setSessionQueue] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // UI State
  const [showList, setShowList] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = () => {
    const stored = localStorage.getItem('flashcards');
    if (stored) {
      const parsed = JSON.parse(stored);
      setCards(parsed);
      updateDueCount(parsed);
    }
  };

  const updateDueCount = (allCards: Flashcard[]) => {
    const now = Date.now();
    const count = allCards.filter(c => c.nextReview <= now).length;
    setDueCardsCount(count);
  };

  const startSession = () => {
      const now = Date.now();
      const due = cards.filter(c => c.nextReview <= now).sort((a, b) => a.nextReview - b.nextReview);
      
      if (due.length === 0) return;

      setSessionQueue(due);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setStudyMode(true);
  };

  const saveCards = (newCards: Flashcard[]) => {
    setCards(newCards);
    localStorage.setItem('flashcards', JSON.stringify(newCards));
    updateDueCount(newCards);
  };

  const speakText = (text: string) => {
    // Use browser TTS
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        window.speechSynthesis.speak(utterance);
    }
  };

  // SuperMemo-2 Algorithm
  const processReview = (quality: number) => {
    // quality: 0=Again, 3=Hard, 4=Good, 5=Easy
    if (!sessionQueue[currentCardIndex]) return;

    const currentCard = sessionQueue[currentCardIndex];
    
    // Retrieve latest state of this card from master list (in case of edits)
    const cardInMaster = cards.find(c => c.id === currentCard.id) || currentCard;
    
    let { interval, repetitions, easeFactor } = cardInMaster;
    const now = Date.now();

    if (quality >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
      easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    } else {
      repetitions = 0;
      interval = 1;
    }

    if (easeFactor < 1.3) easeFactor = 1.3;

    // Update next review date
    const nextReview = now + (interval * 24 * 60 * 60 * 1000);

    const updatedCard = { ...cardInMaster, interval, repetitions, easeFactor, nextReview };
    const updatedMasterList = cards.map(c => c.id === cardInMaster.id ? updatedCard : c);
    
    // Save to DB
    saveCards(updatedMasterList);
    
    // UI Logic
    setIsFlipped(false);

    if (currentCardIndex < sessionQueue.length - 1) {
      // Move to next card in queue
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Session finished
      setStudyMode(false);
      setSessionQueue([]);
      setCurrentCardIndex(0);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Karte wirklich löschen?")) {
        const newCards = cards.filter(c => c.id !== id);
        saveCards(newCards);
    }
  };

  // --- IMPORT / EXPORT ---
  const handleExportAnki = () => {
    const header = "Front,Back,Context\n";
    const rows = cards.map(c => {
        const front = `"${c.front.replace(/"/g, '""')}"`;
        const back = `"${c.back.replace(/"/g, '""')}"`;
        const context = `"${(c.context || '').replace(/"/g, '""')}"`;
        return `${front},${back},${context}`;
    }).join("\n");

    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `anki_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          const content = e.target?.result as string;
          if (!content) return;
          
          const lines = content.split(/\r\n|\n/);
          const newCards: Flashcard[] = [];
          
          const startIndex = lines[0].toLowerCase().includes('front') ? 1 : 0;

          for (let i = startIndex; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;
              
              // Simple CSV parser
              const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
              let parts: string[] = [];
              
              if (matches) {
                 parts = matches.map(m => m.replace(/^"|"$/g, '').replace(/""/g, '"'));
              } else {
                 parts = line.split(',').map(p => p.trim());
              }
              
              if (parts.length >= 2) {
                  newCards.push({
                      id: Date.now().toString() + Math.random(),
                      front: parts[0],
                      back: parts[1],
                      context: parts[2] || '',
                      nextReview: Date.now(),
                      interval: 0,
                      easeFactor: 2.5,
                      repetitions: 0
                  });
              }
          }

          if (newCards.length > 0) {
              saveCards([...cards, ...newCards]);
              alert(`${newCards.length} Karten erfolgreich importiert!`);
          } else {
              alert("Fehler beim Import. Format: Front, Back, Context");
          }
      };
      reader.readAsText(file);
      event.target.value = '';
  };

  if (showList) {
      return (
          <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <Layers className="text-indigo-600" />
                      Karten verwalten ({cards.length})
                  </h2>
                  <button onClick={() => setShowList(false)} className="text-sm font-bold text-indigo-600 hover:underline">
                      Zurück zum Lernen
                  </button>
              </div>

              <div className="flex gap-3 flex-wrap">
                  <button onClick={handleExportAnki} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm">
                      <Download size={16} /> Export
                  </button>
                  <button onClick={handleImportClick} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm">
                      <Upload size={16} /> Import
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.txt" onChange={handleFileChange} />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-h-[60vh] overflow-y-auto">
                  {cards.length === 0 ? (
                      <div className="p-8 text-center text-slate-400">Keine Karten vorhanden.</div>
                  ) : (
                      <div className="divide-y divide-slate-100">
                          {cards.map(card => (
                              <div key={card.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                                  <div className="flex-1 min-w-0 mr-4">
                                      <div className="font-bold text-slate-800 truncate">{card.front}</div>
                                      <div className="text-sm text-slate-500 truncate">{card.back}</div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <div className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded whitespace-nowrap">
                                          {new Date(card.nextReview).toLocaleDateString()}
                                      </div>
                                      <button onClick={() => handleDelete(card.id)} className="text-slate-300 hover:text-red-500">
                                          <Trash2 size={18} />
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      );
  }

  if (!studyMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in zoom-in-95 duration-300">
         <div className="text-center space-y-2">
             <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                 <Layers size={40} className="text-indigo-600" />
             </div>
             <h1 className="text-3xl font-bold text-slate-800">Karteikarten</h1>
             <p className="text-slate-500 max-w-md">
                 Spaced Repetition System für effizientes Vokabellernen.
             </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
             <div className="bg-white p-6 rounded-xl border-2 border-indigo-100 text-center space-y-4 shadow-sm">
                 <h3 className="text-lg font-bold text-slate-700">
                     {dueCardsCount > 0 ? `${dueCardsCount} Karten fällig` : 'Alles erledigt!'}
                 </h3>
                 <button 
                    onClick={startSession}
                    disabled={dueCardsCount === 0}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 ${dueCardsCount > 0 ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200' : 'bg-slate-300 cursor-not-allowed'}`}
                 >
                    {dueCardsCount > 0 ? 'Lernen starten' : 'Pause genießen'}
                 </button>
             </div>

             <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-4 shadow-sm flex flex-col justify-center">
                 <button onClick={() => setShowList(true)} className="w-full py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg flex items-center justify-center gap-2 transition-colors">
                     <FileText size={16}/>
                     Liste bearbeiten
                 </button>
                 <div className="text-xs text-slate-400">Gesamt: {cards.length} Karten</div>
             </div>
         </div>
      </div>
    );
  }

  const currentCard = sessionQueue[currentCardIndex];

  if (!currentCard) return null; // Safety

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-center text-sm text-slate-400 font-medium">
           <button onClick={() => setStudyMode(false)} className="hover:text-indigo-600 transition-colors">Beenden</button>
           <div>Karte {currentCardIndex + 1} von {sessionQueue.length}</div>
       </div>

       {/* Flashcard Area */}
       <div 
          className="relative h-96 w-full perspective-1000 cursor-pointer group select-none"
          onClick={() => setIsFlipped(!isFlipped)}
       >
          <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* FRONT */}
              <div className="absolute w-full h-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col items-center justify-center backface-hidden">
                   <span className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">Frage / Deutsch</span>
                   <h2 className="text-4xl font-bold text-slate-800 text-center mb-6 leading-tight">{currentCard.front}</h2>
                   <button 
                      onClick={(e) => { e.stopPropagation(); speakText(currentCard.front); }}
                      className="p-3 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors hover:scale-110 transform"
                      title="Vorlesen"
                    >
                       <Volume2 size={24} />
                   </button>
                   <div className="absolute bottom-6 text-slate-400 text-sm animate-pulse">
                       Tippen zum Wenden
                   </div>
              </div>

              {/* BACK */}
              <div className="absolute w-full h-full bg-indigo-600 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180 text-white">
                   <span className="text-xs font-bold uppercase text-indigo-200 mb-4 tracking-widest">Antwort / Bedeutung</span>
                   <h2 className="text-3xl font-bold text-center mb-4 leading-tight">{currentCard.back}</h2>
                   {currentCard.context && (
                       <div className="bg-indigo-700/50 p-4 rounded-lg text-center text-indigo-100 italic text-sm max-w-sm border border-indigo-500/30">
                           "{currentCard.context}"
                       </div>
                   )}
              </div>
          </div>
       </div>

       {/* Controls */}
       {isFlipped ? (
           <div className="grid grid-cols-3 gap-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
               <button 
                  onClick={() => processReview(0)}
                  className="py-4 rounded-xl bg-red-100 text-red-700 font-bold hover:bg-red-200 transition-colors flex flex-col items-center shadow-sm hover:shadow-md"
                >
                   <XCircle size={24} className="mb-1" />
                   Nochmal
                   <span className="text-[10px] opacity-70 uppercase mt-1">Vergessen</span>
               </button>
               <button 
                  onClick={() => processReview(4)}
                  className="py-4 rounded-xl bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 transition-colors flex flex-col items-center shadow-sm hover:shadow-md"
                >
                   <CheckCircle2 size={24} className="mb-1" />
                   Gut
                   <span className="text-[10px] opacity-70 uppercase mt-1">Gewusst</span>
               </button>
               <button 
                  onClick={() => processReview(5)}
                  className="py-4 rounded-xl bg-green-100 text-green-700 font-bold hover:bg-green-200 transition-colors flex flex-col items-center shadow-sm hover:shadow-md"
                >
                   <BrainCircuit size={24} className="mb-1" />
                   Einfach
                   <span className="text-[10px] opacity-70 uppercase mt-1">Sofort</span>
               </button>
           </div>
       ) : (
           <div className="h-[88px] flex items-center justify-center text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
               Überlege dir die Antwort...
           </div>
       )}
    </div>
  );
};

export default FlashcardDeck;
