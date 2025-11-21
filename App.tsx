
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, GraduationCap, Library, Building2, Settings, Download, Upload, Trash2, X, Phone } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ScheduleGrid from './components/ScheduleGrid';
import MoodleAccess from './components/MoodleAccess';
import CourseDetail from './components/CourseDetail';
import StudyZone from './components/StudyZone';
import CampusHub from './components/CampusHub';
import WelcomeScreen from './components/WelcomeScreen';

const NavLink = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (location.pathname.startsWith('/course') && to === '/moodle');

  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center min-w-[75px] md:w-full py-3 md:py-4 md:flex-row md:justify-start md:px-6 md:space-x-3 transition-all duration-300 rounded-xl mx-1 md:mx-2 my-1 ${
        isActive
          ? 'text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-200/50 scale-105'
          : 'text-slate-500 hover:text-indigo-600 hover:bg-white/50'
      }`}
    >
      <Icon size={24} className={isActive ? 'text-white' : 'text-slate-400'} />
      <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0 whitespace-nowrap">{label}</span>
    </Link>
  );
};

const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if(isOpen) {
            setPhone(localStorage.getItem('user_phone') || '');
        }
    }, [isOpen]);

    const handleExport = () => {
        const data: Record<string, string | null> = {};
        for(let i=0; i<localStorage.length; i++) {
            const key = localStorage.key(i);
            if(key) data[key] = localStorage.getItem(key);
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `raviranjan_companion_backup_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;
        
        if(!confirm("Achtung! Dies überschreibt alle aktuellen Daten. Fortfahren?")) {
             e.target.value = ''; 
             return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target?.result as string);
                Object.entries(data).forEach(([key, value]) => {
                    if(typeof value === 'string') localStorage.setItem(key, value);
                });
                alert("Daten erfolgreich wiederhergestellt! Die App wird neu geladen.");
                window.location.reload();
            } catch(err) {
                alert("Fehler beim Importieren der Datei.");
            }
        };
        reader.readAsText(file);
    };

    const handleReset = () => {
        if(confirm("Bist du sicher? ALLES wird gelöscht.")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const savePhone = () => {
        localStorage.setItem('user_phone', phone);
        alert("Nummer gespeichert!");
    };

    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Settings className="text-slate-400" /> Einstellungen
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-500">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-6">
                    {/* Backup Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Daten & Backup</h3>
                        <button onClick={handleExport} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 font-medium text-sm">
                            <span>Backup erstellen (Export)</span>
                            <Download size={16} className="text-blue-500" />
                        </button>
                        
                        <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 font-medium text-sm">
                            <span>Backup wiederherstellen (Import)</span>
                            <Upload size={16} className="text-green-500" />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
                    </div>

                    {/* Profile Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Profil</h3>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Phone className="absolute top-2.5 left-3 text-slate-400" size={16}/>
                                <input 
                                    type="text" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="49170123456"
                                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <button onClick={savePhone} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">
                                Save
                            </button>
                        </div>
                        <p className="text-xs text-slate-400">Für WhatsApp Erinnerungen benötigt.</p>
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-4 border-t border-slate-100">
                        <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm transition-colors">
                            <Trash2 size={16} />
                            App zurücksetzen (Alle Daten löschen)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden">
      {/* --- VIBRANT BACKGROUND LAYER --- */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-slate-50">
          {/* Base Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white/80 to-purple-50/80"></div>
          
          {/* Animated Blobs */}
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000"></div>
          
          {/* Subtle Grid Pattern overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Sidebar (Desktop) / Bottom Bar (Mobile) */}
      <nav className="order-2 md:order-1 bg-white/70 backdrop-blur-xl border-t md:border-t-0 md:border-r border-white/50 fixed bottom-0 w-full md:relative md:w-72 md:h-screen z-50 flex md:flex-col pt-safe-bottom md:pt-8 pb-safe-bottom shadow-[0_-4px_20px_-1px_rgba(0,0,0,0.05)] md:shadow-none">
        <div className="hidden md:flex items-center gap-3 px-6 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">26</div>
            <div>
                <h1 className="font-bold text-slate-800 leading-tight text-lg">26 TI G2</h1>
                <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 font-bold">Studienkolleg Coburg</p>
            </div>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1 md:overflow-y-auto md:space-y-2 flex md:flex-col justify-around md:justify-start px-2 md:px-2 pb-2 md:pb-0 no-scrollbar">
            <NavLink to="/" icon={LayoutDashboard} label="Dashboard" />
            <NavLink to="/schedule" icon={CalendarDays} label="Stundenplan" />
            <NavLink to="/moodle" icon={GraduationCap} label="Kurse" />
            <NavLink to="/study" icon={Library} label="Study Zone" />
            <NavLink to="/campus" icon={Building2} label="Campus Hub" />
        </div>

        {/* Personalized User Profile (Desktop only) */}
        <div className="hidden md:block p-4 mx-4 mb-4 rounded-2xl bg-white/50 backdrop-blur-md border border-white/60 shadow-sm group hover:bg-white/80 transition-colors cursor-pointer" onClick={() => setIsSettingsOpen(true)}>
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 via-white to-green-500 p-[2px] shadow-sm shrink-0">
                    <div className="w-full h-full rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      RK
                    </div>
                 </div>
                 <div className="min-w-0 flex-1">
                     <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-slate-800 truncate">Raviranjan Kumar</p>
                        <Settings size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"/>
                     </div>
                     <p className="text-[10px] font-medium text-slate-500 flex items-center gap-1 truncate">
                        🇮🇳 India <span className="w-1 h-1 rounded-full bg-slate-300"></span> 26 TI G2
                     </p>
                 </div>
             </div>
        </div>
      </nav>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Main Content */}
      <main className="order-1 md:order-2 flex-1 p-4 md:p-8 pb-28 md:pb-8 overflow-y-auto h-screen scroll-smooth relative z-10">
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);

  const handleEnter = () => {
    // Force navigation to Dashboard to avoid white/empty screens
    window.location.hash = "/";
    setHasEntered(true);
  };

  if (!hasEntered) {
    return <WelcomeScreen onEnter={handleEnter} />;
  }

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<ScheduleGrid />} />
          <Route path="/moodle" element={<MoodleAccess />} />
          <Route path="/course/:subjectId" element={<CourseDetail />} />
          <Route path="/study" element={<StudyZone />} />
          <Route path="/campus" element={<CampusHub />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
