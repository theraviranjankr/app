
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BookOpen, Mic, BrainCircuit, Newspaper, GraduationCap, Volume2, HelpCircle, CheckCircle2, XCircle, ExternalLink, Loader2, Plus, Layers, Search, Play, Square, RefreshCw } from 'lucide-react';
import { Flashcard } from '../types';
import { useNavigate } from 'react-router-dom';

interface GermanWord {
  word: string;
  article: string; // der, die, das, or empty
  plural: string;
  definition: string; // in German
  example: string;
}

interface GermanPhrase {
  phrase: string;
  meaning: string; // in German
  usage: string;
}

interface DailyLesson {
  topicTitle: string;
  readingText: string; // C1 level text
  words: GermanWord[];
  phrases: GermanPhrase[];
  grammarTip: string;
}

interface GroundingSource {
  title: string;
  uri: string;
}

interface PronunciationFeedback {
  score: number; // 1-10
  feedback: string;
  correction: string;
}

const LearnGerman: React.FC = () => {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<DailyLesson | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reading' | 'vocab' | 'phrases' | 'quiz' | 'speak'>('reading');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<Record<string, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Flashcard Selection State
  const [selectionRect, setSelectionRect] = useState<{top: number, left: number} | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [pronunciationTarget, setPronunciationTarget] = useState("");
  const [pronunciationFeedback, setPronunciationFeedback] = useState<PronunciationFeedback | null>(null);
  const [isAnalyzingAudio, setIsAnalyzingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    loadDailyLesson();
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  useEffect(() => {
      return () => {
          if (audioUrl) URL.revokeObjectURL(audioUrl);
          stopRecording(); // Cleanup on unmount
      };
  }, [audioUrl]);

  const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
          setSelectionRect(null);
          return;
      }

      const text = selection.toString().trim();
      if (text.length > 0 && activeTab === 'reading') {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          // Ensure the popup stays within viewport
          const top = Math.max(10, rect.top - 50);
          const left = Math.min(window.innerWidth - 200, Math.max(10, rect.left + (rect.width / 2) - 60));

          setSelectionRect({ top, left });
          setSelectedText(text);
      } else {
          setSelectionRect(null);
      }
  };

  // --- AUDIO RECORDING & ANALYSIS ---

  const startRecording = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioStreamRef.current = stream;
          const recorder = new MediaRecorder(stream);
          const chunks: BlobPart[] = [];

          recorder.ondataavailable = (e) => chunks.push(e.data);
          recorder.onstop = () => {
              const blob = new Blob(chunks, { type: 'audio/webm' });
              setAudioBlob(blob);
              const url = URL.createObjectURL(blob);
              setAudioUrl(url);
          };

          recorder.start();
          setIsRecording(true);
          setPronunciationFeedback(null);
          mediaRecorderRef.current = recorder;
      } catch (err) {
          console.error("Mic error:", err);
          alert("Mikrofonzugriff verweigert. Bitte überprüfe die Einstellungen.");
      }
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
      }
      if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach(track => track.stop());
          audioStreamRef.current = null;
      }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
      });
  };

  const analyzePronunciation = async () => {
      if (!audioBlob || !pronunciationTarget || !process.env.API_KEY) return;
      setIsAnalyzingAudio(true);

      try {
          const base64Audio = await blobToBase64(audioBlob);
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

          const prompt = `
            You are a strict German teacher. User said: "${pronunciationTarget}".
            Evaluate pronunciation. Return JSON: { "score": number(1-10), "feedback": "german advice", "correction": "phonetic hint" }
          `;

          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: {
                  parts: [
                      { inlineData: { mimeType: "audio/webm", data: base64Audio } },
                      { text: prompt }
                  ]
              },
              config: { responseMimeType: "application/json" }
          });

          if (response.text) {
              setPronunciationFeedback(JSON.parse(response.text));
          }
      } catch (error) {
          console.error("Analysis failed:", error);
          alert("Fehler bei der Analyse.");
      } finally {
          setIsAnalyzingAudio(false);
      }
  };

  // --- FLASHCARD & LESSON ---

  const analyzeAndAddCard = async () => {
      if (!selectedText || !process.env.API_KEY) return;
      setIsAnalyzing(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      try {
          const prompt = `
             Analyze German: "${selectedText}".
             Return JSON: { "front": "${selectedText}", "back": "German Definition", "context": "Example sentence" }
          `;
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: { responseMimeType: "application/json" }
          });
          
          if (response.text) {
              const data = JSON.parse(response.text);
              addToDeck(data.front, data.back, data.context);
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsAnalyzing(false);
          setSelectionRect(null);
          window.getSelection()?.removeAllRanges();
      }
  };

  const addToDeck = (front: string, back: string, context?: string) => {
      const newCard: Flashcard = {
          id: Date.now().toString() + Math.random(),
          front,
          back,
          context,
          nextReview: Date.now(),
          interval: 0,
          easeFactor: 2.5,
          repetitions: 0
      };
      const existing = localStorage.getItem('flashcards');
      const deck = existing ? JSON.parse(existing) : [];
      deck.push(newCard);
      localStorage.setItem('flashcards', JSON.stringify(deck));
      alert(`"${front}" gespeichert!`);
  };

  const bulkAddVocab = () => {
      if (!lesson) return;
      lesson.words.forEach(w => {
          addToDeck(`${w.article} ${w.word}`, w.definition, w.example);
      });
      navigate('/study', { state: { activeTab: 'flashcards' } });
  };

  const loadDailyLesson = async () => {
    // Use ISO date for consistent keys
    const todayKey = `german_lesson_${new Date().toISOString().split('T')[0]}`;
    const cached = localStorage.getItem(todayKey);
    const cachedSources = localStorage.getItem(`${todayKey}_sources`);

    if (cached) {
      try {
          setLesson(JSON.parse(cached));
          if (cachedSources) setSources(JSON.parse(cachedSources));
          setLoading(false);
          return;
      } catch (e) {
          console.error("Cache parsing error", e);
      }
    }

    await fetchLessonFromAI(todayKey);
  };

  const fetchLessonFromAI = async (storageKey: string) => {
    setLoading(true);
    if (!process.env.API_KEY) {
      setLoading(false);
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const prompt = `
        Task: Generate a "Daily German Lesson" (C1 Level) based on current German news.
        
        Output purely valid JSON (no markdown) with this structure:
        {
          "topicTitle": "Headline",
          "readingText": "C1 Text (~150 words)",
          "words": [{ "word": "Noun/Verb", "article": "der/die/das", "plural": "-", "definition": "German definition", "example": "Sentence" }],
          "phrases": [{ "phrase": "Idiom", "meaning": "Meaning", "usage": "Sentence" }],
          "grammarTip": "Tip"
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });

      if (response.text) {
        // Robust cleaner for AI chatter
        let text = response.text.trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            text = jsonMatch[0];
        }

        try {
            const data: DailyLesson = JSON.parse(text);
            setLesson(data);
            localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (parseError) {
            console.error("JSON Parse failed:", text);
        }

        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
            const srcs = chunks
                .filter((c: any) => c.web?.uri && c.web?.title)
                .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
            setSources(srcs);
            localStorage.setItem(`${storageKey}_sources`, JSON.stringify(srcs));
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleQuizCheck = () => {
    if (!lesson) return;
    const results: Record<string, boolean> = {};
    lesson.words.forEach(w => {
       if (w.article) {
         const correct = w.article.toLowerCase();
         const given = (quizAnswers[w.word] || '').toLowerCase();
         results[w.word] = correct === given;
       }
    });
    setQuizResult(results);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-700">Generiere Lektion...</h3>
          <p className="text-slate-500 text-sm">Suche Nachrichten & erstelle Übungen</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
        <div className="p-8 text-center space-y-4">
            <p className="text-red-500 font-bold">Fehler beim Laden.</p>
            <button onClick={() => loadDailyLesson()} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                <RefreshCw size={16} className="inline mr-2"/> Neustart
            </button>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative pb-12 animate-in fade-in duration-500">
      
      {/* Context Menu for Flashcards */}
      {selectionRect && (
          <div 
            style={{ top: selectionRect.top, left: selectionRect.left }}
            className="fixed z-50 bg-slate-900 text-white px-3 py-2 rounded-lg shadow-2xl flex items-center gap-2 animate-in zoom-in duration-200 border border-slate-700"
            onMouseDown={(e) => e.preventDefault()} // Prevent losing selection
          >
              {isAnalyzing ? (
                  <Loader2 size={16} className="animate-spin text-emerald-400" />
              ) : (
                  <button onClick={analyzeAndAddCard} className="flex items-center gap-2 text-xs font-bold hover:text-emerald-400 transition-colors">
                      <Plus size={14} />
                      Als Karteikarte
                  </button>
              )}
          </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <div className="flex items-center gap-2 text-emerald-100 font-bold uppercase tracking-wider text-xs mb-2">
                <Newspaper className="w-4 h-4" />
                Tageslektion
            </div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                Deutsch C1
            </h1>
            <p className="text-emerald-100 opacity-90 text-lg">{lesson.topicTitle}</p>
        </div>
        <div className="absolute right-0 top-0 p-6 opacity-10">
            <BookOpen size={140} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
         {[
            { id: 'reading', label: 'Lesen', icon: BookOpen },
            { id: 'vocab', label: 'Wortschatz', icon: GraduationCap },
            { id: 'phrases', label: 'Redewendungen', icon: Layers },
            { id: 'quiz', label: 'Quiz', icon: HelpCircle },
            { id: 'speak', label: 'Sprechen', icon: Mic },
         ].map(tab => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
             >
                 <tab.icon size={18} />
                 {tab.label}
             </button>
         ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
          
          {/* READING */}
          {activeTab === 'reading' && (
              <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex justify-between items-start mb-6">
                      <h2 className="text-xl font-bold text-slate-800">Lesetext</h2>
                      <button 
                        onClick={() => speakText(lesson.readingText)}
                        className={`p-3 rounded-full transition-all shadow-sm ${isSpeaking ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                      >
                          <Volume2 size={24} />
                      </button>
                  </div>
                  
                  <div className="prose prose-slate max-w-none mb-8">
                      <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-line font-serif selection:bg-emerald-200 selection:text-emerald-900">
                          {lesson.readingText}
                      </p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-3 text-sm text-slate-600">
                      <Search size={20} className="text-emerald-500"/>
                      <p>Markiere Text, um ihn als Karteikarte zu speichern.</p>
                  </div>
              </div>
          )}

          {/* VOCAB */}
          {activeTab === 'vocab' && (
              <div className="divide-y divide-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-slate-600">Wortschatz</span>
                      <button onClick={bulkAddVocab} className="text-xs bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded font-bold flex items-center gap-1 transition-colors">
                          <Plus size={14} /> Alle speichern
                      </button>
                  </div>
                  {lesson.words.map((word, idx) => (
                      <div key={idx} className="p-6 hover:bg-slate-50 transition-colors flex gap-4 group">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0">
                              {idx + 1}
                          </div>
                          <div className="flex-1">
                              <div className="flex items-baseline gap-2 mb-1">
                                  <h3 className="text-lg font-bold text-slate-800">
                                      <span className="text-emerald-600 font-normal mr-2">{word.article}</span>
                                      {word.word}
                                  </h3>
                                  {word.plural && <span className="text-sm text-slate-400">({word.plural})</span>}
                              </div>
                              <p className="text-slate-600 italic mb-2">{word.definition}</p>
                              <div className="bg-slate-50 p-3 rounded-lg border-l-4 border-emerald-300">
                                  <p className="text-sm text-slate-700">"{word.example}"</p>
                              </div>
                          </div>
                          <button onClick={() => { setActiveTab('speak'); setPronunciationTarget(`${word.article} ${word.word}`); }} className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-full self-start">
                                <Mic size={20} />
                          </button>
                      </div>
                  ))}
              </div>
          )}

          {/* PHRASES */}
          {activeTab === 'phrases' && (
              <div className="divide-y divide-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {lesson.phrases.map((phrase, idx) => (
                      <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                           <div className="flex gap-4">
                                <div className="mt-1"><CheckCircle2 className="text-emerald-500" size={24} /></div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">{phrase.phrase}</h3>
                                    <p className="text-sm font-bold text-emerald-700 mb-2 bg-emerald-50 inline-block px-2 py-0.5 rounded">
                                        {phrase.meaning}
                                    </p>
                                    <p className="text-slate-600 text-sm italic">"{phrase.usage}"</p>
                                </div>
                           </div>
                      </div>
                  ))}
              </div>
          )}

          {/* QUIZ */}
          {activeTab === 'quiz' && (
              <div className="p-6 md:p-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Artikel Training</h2>
                  <div className="space-y-4">
                      {lesson.words.filter(w => w.article).map((word, idx) => {
                          const res = quizResult[word.word];
                          return (
                              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                                  <span className="font-bold text-slate-800">{word.word}</span>
                                  <div className="flex gap-2">
                                      {['der', 'die', 'das'].map(art => (
                                          <button
                                            key={art}
                                            onClick={() => {
                                                setQuizAnswers(p => ({...p, [word.word]: art}));
                                                const n = {...quizResult}; delete n[word.word]; setQuizResult(n);
                                            }}
                                            className={`px-3 py-1.5 rounded font-bold text-sm transition-all ${
                                                quizAnswers[word.word] === art 
                                                ? 'bg-slate-800 text-white' 
                                                : 'bg-white border border-slate-300 text-slate-500'
                                            }`}
                                            disabled={res !== undefined}
                                          >
                                              {art}
                                          </button>
                                      ))}
                                  </div>
                                  <div className="w-6 flex justify-center">
                                      {res === true && <CheckCircle2 className="text-green-500" size={20} />}
                                      {res === false && <XCircle className="text-red-500" size={20} />}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
                  <div className="mt-8 text-center">
                      <button onClick={handleQuizCheck} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold shadow-md hover:bg-emerald-700">
                          Prüfen
                      </button>
                  </div>
              </div>
          )}

          {/* SPEAK */}
          {activeTab === 'speak' && (
              <div className="p-6 md:p-10 text-center max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h2 className="text-xl font-bold text-slate-800 mb-6">Aussprache-Trainer</h2>
                  
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                       <input 
                          type="text" 
                          value={pronunciationTarget}
                          onChange={(e) => setPronunciationTarget(e.target.value)}
                          placeholder="Wort eingeben..."
                          className="w-full text-center text-2xl font-bold bg-transparent border-b border-slate-300 focus:border-emerald-500 focus:outline-none pb-2"
                       />
                       <button onClick={() => speakText(pronunciationTarget)} className="mt-4 text-sm text-emerald-600 font-bold flex items-center justify-center gap-2 mx-auto hover:underline">
                           <Volume2 size={16} /> Anhören
                       </button>
                  </div>

                  <div className="mb-8 flex flex-col items-center justify-center min-h-[120px]">
                      {!isRecording && !audioBlob && (
                          <button 
                            onClick={startRecording}
                            disabled={!pronunciationTarget}
                            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105 ${!pronunciationTarget ? 'bg-slate-200 text-slate-400' : 'bg-red-500 text-white'}`}
                          >
                              <Mic size={32} />
                          </button>
                      )}

                      {isRecording && (
                          <button onClick={stopRecording} className="w-20 h-20 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-xl animate-pulse">
                              <Square size={24} fill="currentColor" />
                          </button>
                      )}

                      {!isRecording && audioBlob && (
                          <div className="flex flex-col items-center gap-4 w-full">
                              {audioUrl && <audio src={audioUrl} controls className="w-full h-8" />}
                              <div className="flex gap-3">
                                  <button onClick={() => { setAudioBlob(null); setAudioUrl(null); }} className="px-4 py-2 text-sm font-bold text-slate-500 border border-slate-300 rounded-lg">Neu</button>
                                  <button onClick={analyzePronunciation} disabled={isAnalyzingAudio} className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 rounded-lg flex items-center gap-2">
                                      {isAnalyzingAudio ? <Loader2 className="animate-spin" size={16}/> : <BrainCircuit size={16}/>} Analyse
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>

                  {pronunciationFeedback && (
                      <div className="bg-white border border-slate-200 rounded-xl p-4 text-left animate-in slide-in-from-bottom-4">
                           <div className="flex justify-between mb-2">
                               <span className="font-bold text-slate-700">Ergebnis</span>
                               <span className={`font-bold ${pronunciationFeedback.score > 7 ? 'text-green-600' : 'text-orange-500'}`}>Score: {pronunciationFeedback.score}/10</span>
                           </div>
                           <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded mb-2">{pronunciationFeedback.feedback}</p>
                           <p className="text-sm text-emerald-700 font-medium">Tipp: {pronunciationFeedback.correction}</p>
                      </div>
                  )}
              </div>
          )}
      </div>
    </div>
  );
};

export default LearnGerman;
