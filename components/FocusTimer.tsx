
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, BrainCircuit, Bell } from 'lucide-react';

const FocusTimer: React.FC = () => {
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  
  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      playAlarm();
      if (mode === 'focus') {
        setCycles(c => c + 1);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const initAudio = () => {
      if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
              audioCtxRef.current = new AudioContextClass();
          }
      }
      // Resume context if suspended (browser policy)
      if (audioCtxRef.current?.state === 'suspended') {
          audioCtxRef.current.resume();
      }
  };

  const playAlarm = () => {
    if (!audioCtxRef.current) initAudio();
    
    if (audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    }
  };

  const switchMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'focus') setTimeLeft(25 * 60);
    if (newMode === 'shortBreak') setTimeLeft(5 * 60);
    if (newMode === 'longBreak') setTimeLeft(15 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleTimer = () => {
      if (!isActive) {
          initAudio(); // Ensure audio is ready on user click
      }
      setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    switchMode(mode);
  };

  const progress = mode === 'focus' 
    ? 100 - (timeLeft / (25 * 60)) * 100 
    : mode === 'shortBreak' 
    ? 100 - (timeLeft / (5 * 60)) * 100
    : 100 - (timeLeft / (15 * 60)) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] max-w-xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 w-full text-center relative overflow-hidden">
        {/* Progress Bar Background */}
        <div className={`absolute bottom-0 left-0 h-2 transition-all duration-1000 ${
            mode === 'focus' ? 'bg-indigo-500' : 'bg-emerald-500'
        }`} style={{ width: `${progress}%` }}></div>

        <div className="flex justify-center gap-2 mb-8">
            <button 
                onClick={() => switchMode('focus')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    mode === 'focus' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'
                }`}
            >
                Focus
            </button>
            <button 
                onClick={() => switchMode('shortBreak')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    mode === 'shortBreak' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 hover:bg-slate-50'
                }`}
            >
                Kurze Pause
            </button>
            <button 
                onClick={() => switchMode('longBreak')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    mode === 'longBreak' ? 'bg-teal-100 text-teal-700' : 'text-slate-400 hover:bg-slate-50'
                }`}
            >
                Lange Pause
            </button>
        </div>

        <div className="relative mb-8">
            <div className={`text-8xl font-mono font-bold tracking-tighter transition-colors ${
                isActive 
                    ? (mode === 'focus' ? 'text-indigo-600' : 'text-emerald-600') 
                    : 'text-slate-300'
            }`}>
                {formatTime(timeLeft)}
            </div>
            <div className="absolute top-0 right-0 lg:right-10">
               {isActive && <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></div>}
            </div>
        </div>

        <div className="flex items-center justify-center gap-6 mb-8">
            <button 
                onClick={toggleTimer}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 ${
                    isActive 
                    ? 'bg-white border-2 border-slate-200 text-slate-600' 
                    : mode === 'focus' ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-emerald-500 text-white shadow-emerald-200'
                }`}
            >
                {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            
            <button 
                onClick={resetTimer}
                className="p-4 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
                <RotateCcw size={24} />
            </button>
        </div>

        <div className="flex items-center justify-center gap-8 text-slate-400 text-sm font-medium">
            <div className="flex items-center gap-2">
                <BrainCircuit size={16} />
                <span>{cycles} Fokus-Zyklen</span>
            </div>
            <div className="flex items-center gap-2">
                <Coffee size={16} />
                <span>{mode !== 'focus' ? 'Entspann dich' : 'Stay focused'}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
