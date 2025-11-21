
import React, { useState, useEffect } from 'react';
import { Grade, GradeSubject } from '../types';
import { Plus, Trash2, TrendingUp, Award, AlertCircle, Save, X } from 'lucide-react';
import { SUBJECT_METADATA } from '../constants';

const GradeTracker: React.FC = () => {
  const [subjects, setSubjects] = useState<GradeSubject[]>([]);
  const [isAdding, setIsAdding] = useState<string | null>(null); // ID of subject being edited
  
  // Form States
  const [gradeName, setGradeName] = useState('');
  const [gradeValue, setGradeValue] = useState('');
  const [gradeWeight, setGradeWeight] = useState('1');

  useEffect(() => {
    const stored = localStorage.getItem('grades');
    if (stored) {
      setSubjects(JSON.parse(stored));
    } else {
      // Initialize with default subjects if empty
      const defaults = Object.keys(SUBJECT_METADATA).map(key => ({
        id: key,
        name: key,
        grades: []
      }));
      setSubjects(defaults);
      localStorage.setItem('grades', JSON.stringify(defaults));
    }
  }, []);

  const saveSubjects = (newSubjects: GradeSubject[]) => {
    setSubjects(newSubjects);
    localStorage.setItem('grades', JSON.stringify(newSubjects));
  };

  const addGrade = (subjectId: string) => {
    if (!gradeName || !gradeValue) return;

    const val = parseFloat(gradeValue.replace(',', '.'));
    if (isNaN(val) || val < 0.7 || val > 6.0) {
      alert("Bitte eine gültige Note eingeben (1.0 - 6.0)");
      return;
    }

    const newGrade: Grade = {
      id: Date.now().toString(),
      name: gradeName,
      value: val,
      weight: parseInt(gradeWeight) || 1,
      date: new Date().toISOString()
    };

    const newSubjects = subjects.map(sub => {
      if (sub.id === subjectId) {
        return { ...sub, grades: [...sub.grades, newGrade] };
      }
      return sub;
    });

    saveSubjects(newSubjects);
    setIsAdding(null);
    resetForm();
  };

  const deleteGrade = (subjectId: string, gradeId: string) => {
    if (!confirm("Note löschen?")) return;
    const newSubjects = subjects.map(sub => {
      if (sub.id === subjectId) {
        return { ...sub, grades: sub.grades.filter(g => g.id !== gradeId) };
      }
      return sub;
    });
    saveSubjects(newSubjects);
  };

  const resetForm = () => {
    setGradeName('');
    setGradeValue('');
    setGradeWeight('1');
  };

  const calculateAverage = (grades: Grade[]) => {
    if (grades.length === 0) return null;
    const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
    const weightedSum = grades.reduce((sum, g) => sum + (g.value * g.weight), 0);
    return (weightedSum / totalWeight).toFixed(2);
  };

  const getGradeColor = (avg: string | null) => {
    if (!avg) return 'text-slate-400';
    const val = parseFloat(avg);
    if (val <= 1.5) return 'text-emerald-600';
    if (val <= 2.5) return 'text-green-600';
    if (val <= 3.5) return 'text-yellow-600';
    if (val <= 4.0) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-8 text-white shadow-lg flex justify-between items-center relative overflow-hidden">
         <div className="relative z-10">
            <h1 className="text-2xl font-bold flex items-center gap-3 mb-2">
                <Award size={28} /> Noten-Manager
            </h1>
            <p className="text-rose-100 opacity-90">
                Behalte deinen Schnitt im Auge. Ziel: FSP bestehen! 🎓
            </p>
         </div>
         <TrendingUp size={100} className="absolute right-[-20px] bottom-[-20px] opacity-20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {subjects.map(sub => {
          const avg = calculateAverage(sub.grades);
          const meta = SUBJECT_METADATA[sub.id];
          const colorClass = meta ? meta.iconColor : 'text-slate-600';
          const bgClass = meta ? meta.color.split(' ')[0] : 'bg-slate-50';

          return (
            <div key={sub.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col">
              {/* Subject Header */}
              <div className={`p-4 border-b border-slate-100 flex justify-between items-center ${bgClass}`}>
                <h3 className={`font-bold text-lg ${colorClass}`}>{sub.name}</h3>
                <div className={`text-2xl font-bold ${getGradeColor(avg)}`}>
                   {avg || '-'}
                </div>
              </div>

              {/* Grades List */}
              <div className="p-4 flex-1 space-y-3">
                {sub.grades.length === 0 ? (
                    <div className="text-center py-4 text-slate-400 text-xs italic">
                        Noch keine Noten eingetragen.
                    </div>
                ) : (
                    sub.grades.map(g => (
                        <div key={g.id} className="flex justify-between items-center text-sm group">
                            <div>
                                <div className="font-bold text-slate-700">{g.name}</div>
                                <div className="text-xs text-slate-400">{new Date(g.date).toLocaleDateString()} • Gewicht: {g.weight}x</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`font-bold ${getGradeColor(g.value.toString())}`}>{g.value.toFixed(1)}</span>
                                <button 
                                    onClick={() => deleteGrade(sub.id, g.id)}
                                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
              </div>

              {/* Add Form / Button */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                  {isAdding === sub.id ? (
                      <div className="space-y-3 animate-in slide-in-from-bottom-2">
                          <input 
                            type="text" 
                            placeholder="Bezeichnung (z.B. Test 1)"
                            className="w-full px-3 py-2 text-sm rounded border border-slate-200"
                            value={gradeName}
                            onChange={e => setGradeName(e.target.value)}
                            autoFocus
                          />
                          <div className="flex gap-2">
                              <input 
                                type="number" 
                                placeholder="Note"
                                className="w-20 px-3 py-2 text-sm rounded border border-slate-200"
                                value={gradeValue}
                                onChange={e => setGradeValue(e.target.value)}
                                step="0.1"
                              />
                              <select 
                                className="flex-1 px-3 py-2 text-sm rounded border border-slate-200 bg-white"
                                value={gradeWeight}
                                onChange={e => setGradeWeight(e.target.value)}
                              >
                                  <option value="1">1x (Test)</option>
                                  <option value="2">2x (Klausur)</option>
                                  <option value="0.5">0.5x (Mündlich)</option>
                              </select>
                          </div>
                          <div className="flex gap-2">
                              <button 
                                onClick={() => addGrade(sub.id)}
                                className="flex-1 py-2 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700"
                              >
                                  Speichern
                              </button>
                              <button 
                                onClick={() => { setIsAdding(null); resetForm(); }}
                                className="px-3 py-2 bg-slate-200 text-slate-600 rounded hover:bg-slate-300"
                              >
                                  <X size={16} />
                              </button>
                          </div>
                      </div>
                  ) : (
                      <button 
                        onClick={() => { setIsAdding(sub.id); resetForm(); }}
                        className="w-full py-2 border border-dashed border-slate-300 text-slate-500 rounded-lg text-xs font-bold hover:bg-white hover:text-indigo-600 hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
                      >
                          <Plus size={14} /> Note hinzufügen
                      </button>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GradeTracker;
