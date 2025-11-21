
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SUBJECT_METADATA } from '../constants';
import { SyllabusItem } from '../types';
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Plus, Trash2, Edit2, Save, ExternalLink, X } from 'lucide-react';

const CourseDetail: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const meta = subjectId ? SUBJECT_METADATA[subjectId] : null;
  
  const [items, setItems] = useState<SyllabusItem[]>([]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Load items from local storage or initialize from metadata
  useEffect(() => {
    if (!subjectId || !meta) return;

    const storedKey = `syllabus_${subjectId}`;
    const stored = localStorage.getItem(storedKey);

    if (stored) {
      setItems(JSON.parse(stored));
    } else if (meta.fullSyllabus) {
      // Initialize with default syllabus
      const initialItems: SyllabusItem[] = meta.fullSyllabus.map((title, idx) => ({
        id: `init-${idx}`,
        title,
        isDone: false,
        addedBy: 'system',
        revisionCount: 0,
        lastRevised: undefined
      }));
      setItems(initialItems);
      localStorage.setItem(storedKey, JSON.stringify(initialItems));
    }
  }, [subjectId, meta]);

  const saveItems = (newItems: SyllabusItem[]) => {
    setItems(newItems);
    if (subjectId) {
        localStorage.setItem(`syllabus_${subjectId}`, JSON.stringify(newItems));
    }
  };

  const toggleDone = (id: string) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, isDone: !item.isDone } : item
    );
    saveItems(newItems);
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem: SyllabusItem = {
      id: Date.now().toString(),
      title: newItemTitle,
      isDone: false,
      addedBy: 'user',
      revisionCount: 0
    };

    saveItems([...items, newItem]);
    setNewItemTitle('');
    setIsAdding(false);
  };

  const deleteItem = (id: string) => {
    if (window.confirm('Möchtest du dieses Thema wirklich löschen?')) {
        saveItems(items.filter(i => i.id !== id));
    }
  };

  const startEdit = (item: SyllabusItem) => {
      setEditingId(item.id);
      setEditTitle(item.title);
  };

  const saveEdit = () => {
      if (!editingId || !editTitle.trim()) return;
      const newItems = items.map(item => 
          item.id === editingId ? { ...item, title: editTitle } : item
      );
      saveItems(newItems);
      setEditingId(null);
      setEditTitle('');
  };

  if (!meta) {
    return <div className="p-8 text-center">Kurs nicht gefunden.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-2xl p-8 shadow-lg text-slate-800 relative overflow-hidden bg-white border border-slate-200`}>
          <div className={`absolute top-0 left-0 w-full h-2 ${meta.color.replace('bg-', 'bg-').replace('border-', '')}`}></div>
          <div className="relative z-10">
            <button 
                onClick={() => navigate('/moodle')}
                className="mb-4 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-bold"
            >
                <ArrowLeft size={16} /> Zurück zur Übersicht
            </button>
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 text-slate-800">
                        {meta.moodleName}
                    </h1>
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                        <span className="bg-slate-100 px-2 py-1 rounded text-sm">{meta.teacher}</span>
                    </p>
                </div>
                {meta.moodleUrl && (
                    <a 
                        href={meta.moodleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
                    >
                        Moodle Kurs
                        <ExternalLink size={16} />
                    </a>
                )}
            </div>
          </div>
      </div>

      {/* Syllabus List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-lg text-slate-700 flex items-center gap-2">
                  <BookOpen className="text-slate-400" size={20} />
                  Themenübersicht & Stoffplan
              </h2>
              <div className="text-xs font-medium text-slate-500">
                  {items.filter(i => i.isDone).length} / {items.length} Abgeschlossen
              </div>
          </div>
          
          <div className="divide-y divide-slate-100">
              {items.length === 0 && (
                  <div className="p-8 text-center text-slate-400">
                      Keine Themen eingetragen. Füge welche hinzu!
                  </div>
              )}
              
              {items.map((item) => (
                  <div key={item.id} className={`p-4 flex items-start gap-3 group transition-colors ${item.isDone ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}>
                      <button 
                        onClick={() => toggleDone(item.id)}
                        className={`mt-0.5 flex-shrink-0 transition-colors ${item.isDone ? 'text-green-500' : 'text-slate-300 hover:text-slate-400'}`}
                        title={item.isDone ? "Als offen markieren" : "Als erledigt markieren"}
                      >
                          {item.isDone ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                          {editingId === item.id ? (
                              <div className="flex items-center gap-2">
                                  <input 
                                    type="text" 
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    autoFocus
                                  />
                                  <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-50 rounded"><Save size={16}/></button>
                                  <button onClick={() => setEditingId(null)} className="p-1 text-red-600 hover:bg-red-50 rounded"><X size={16}/></button>
                              </div>
                          ) : (
                            <p className={`text-sm leading-relaxed ${item.isDone ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                {item.title}
                            </p>
                          )}
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => startEdit(item)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Bearbeiten"
                          >
                              <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => deleteItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Löschen"
                          >
                              <Trash2 size={14} />
                          </button>
                      </div>
                  </div>
              ))}
          </div>

          {/* Add New Item */}
          <div className="p-4 bg-slate-50 border-t border-slate-100">
              {isAdding ? (
                  <form onSubmit={addItem} className="flex gap-2">
                      <input 
                        type="text"
                        value={newItemTitle}
                        onChange={(e) => setNewItemTitle(e.target.value)}
                        placeholder="Neues Thema eingeben..."
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        autoFocus
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                      >
                          Hinzufügen
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsAdding(false)}
                        className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg"
                      >
                          <X size={20} />
                      </button>
                  </form>
              ) : (
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                  >
                      <Plus size={18} />
                      Thema manuell hinzufügen
                  </button>
              )}
          </div>
      </div>
    </div>
  );
};

export default CourseDetail;
