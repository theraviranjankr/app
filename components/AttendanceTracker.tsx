import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const MAX_HOURS = 40;
const WARNING_THRESHOLD = 30;

const AttendanceTracker: React.FC = () => {
  const [missedHours, setMissedHours] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('missedHours');
    if (saved) {
      setMissedHours(parseInt(saved, 10));
    }
  }, []);

  const updateHours = (newVal: number) => {
    const val = Math.max(0, Math.min(MAX_HOURS, newVal));
    setMissedHours(val);
    localStorage.setItem('missedHours', val.toString());
  };

  const remaining = MAX_HOURS - missedHours;
  const isWarning = missedHours >= WARNING_THRESHOLD;
  const isCritical = missedHours >= MAX_HOURS;

  const data = [
    { name: 'Verbraucht', value: missedHours },
    { name: 'Verbleibend', value: remaining },
  ];

  const COLORS = [isCritical ? '#ef4444' : isWarning ? '#f97316' : '#3b82f6', '#e2e8f0'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Fehlzeiten-Tracker</h2>
          <p className="text-sm text-slate-500">Maximal 40 Stunden (20 Doppelstunden)</p>
        </div>
        {isCritical && (
          <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
            <AlertTriangle size={14} /> KRITISCH
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="h-48 w-48 relative">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip />
            </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className={`text-3xl font-bold ${isCritical ? 'text-red-600' : 'text-slate-700'}`}>{missedHours}</span>
                <span className="text-xs text-slate-400 uppercase font-semibold">Stunden</span>
            </div>
        </div>

        <div className="flex-1 space-y-4 w-full">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600 font-medium">Status</span>
                    <span className={`font-bold ${isCritical ? 'text-red-600' : isWarning ? 'text-orange-600' : 'text-green-600'}`}>
                        {isCritical ? 'Exmatrikulation droht' : isWarning ? 'Warnung' : 'Im Grünen Bereich'}
                    </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Du hast <strong>{remaining}</strong> Stunden übrig, bevor du die kritische Grenze erreichst. 
                    {isWarning && " Bitte achte darauf, ärztliche Atteste sofort einzureichen!"}
                </p>
            </div>

            <div className="flex gap-2 justify-center md:justify-start">
                <button 
                    onClick={() => updateHours(missedHours - 1)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    disabled={missedHours <= 0}
                >
                    -1 Std
                </button>
                 <button 
                    onClick={() => updateHours(missedHours - 2)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    disabled={missedHours <= 1}
                >
                    -2 Std
                </button>
                <div className="w-px bg-slate-300 mx-2"></div>
                <button 
                    onClick={() => updateHours(missedHours + 1)}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors font-medium"
                >
                    +1 Std
                </button>
                <button 
                    onClick={() => updateHours(missedHours + 2)}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors font-medium"
                >
                    +2 Std
                </button>
                 <button 
                    onClick={() => updateHours(0)}
                    className="ml-auto p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Reset"
                >
                    <RotateCcw size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;