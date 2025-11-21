
import React, { useState, useMemo } from 'react';
import { STUDENT_LIST } from '../constants';
import { Search, Mail, Copy, User, Users, Check, Globe, Filter, ChevronDown } from 'lucide-react';

type FilterType = 'all' | 'my_course' | 'other_course' | 'other_students';

const StudentList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('my_course'); // Default to 'My Course'
  const [nationalityFilter, setNationalityFilter] = useState<string>('all');

  // Extract unique countries from the list
  const countries = useMemo(() => {
    const allCountries = new Set<string>();
    STUDENT_LIST.forEach(s => {
      if (s.nationality) {
        // Split dual nationalities like "Ukrainian/Russian"
        const parts = s.nationality.split('/').map(p => p.trim());
        parts.forEach(p => allCountries.add(p));
      }
    });
    return Array.from(allCountries).sort();
  }, []);

  const filteredStudents = STUDENT_LIST.filter(student => {
    // 1. Text Search
    const matchesSearch = 
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.nationality && student.nationality.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    // 2. Course Filter
    let matchesCourse = true;
    if (filter === 'my_course') {
        matchesCourse = student.course === '26 TI G2' || student.course === 'Both';
    } else if (filter === 'other_course') {
        matchesCourse = student.course === '26 TI G1' || student.course === 'Both';
    } else if (filter === 'other_students') {
        matchesCourse = student.course === 'Other';
    }

    if (!matchesCourse) return false;

    // 3. Nationality Filter
    if (nationalityFilter !== 'all') {
      if (!student.nationality) return false;
      // Check if the selected nationality string exists in the student's nationality field
      // This handles "Ukrainian" matching "Ukrainian/Russian"
      if (!student.nationality.includes(nationalityFilter)) return false;
    }

    return true; 
  });

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Helper to map nationality strings to emojis
  const getCountryFlag = (nationality: string | undefined): string => {
    if (!nationality) return '';
    
    const n = nationality.toLowerCase();
    let flags = '';

    // Europe
    if (n.includes('german')) flags += '🇩🇪 ';
    if (n.includes('ukrain')) flags += '🇺🇦 ';
    if (n.includes('russia')) flags += '🇷🇺 ';
    if (n.includes('bulgaria')) flags += '🇧🇬 ';
    if (n.includes('polish')) flags += '🇵🇱 ';

    // Asia
    if (n.includes('vietna')) flags += '🇻🇳 ';
    if (n.includes('indian')) flags += '🇮🇳 ';
    if (n.includes('pakistan')) flags += '🇵🇰 ';
    if (n.includes('bangla')) flags += '🇧🇩 ';
    if (n.includes('thai')) flags += '🇹🇭 ';
    if (n.includes('burma') || n.includes('myanmar')) flags += '🇲🇲 ';
    if (n.includes('afghan')) flags += '🇦🇫 ';
    if (n.includes('uzbek')) flags += '🇺🇿 ';
    if (n.includes('tajik')) flags += '🇹🇯 ';
    if (n.includes('kazakh')) flags += '🇰🇿 ';
    if (n.includes('kyrgyz')) flags += '🇰🇬 ';

    // Middle East
    if (n.includes('syria')) flags += '🇸🇾 ';
    if (n.includes('yemen')) flags += '🇾🇪 ';
    if (n.includes('iran')) flags += '🇮🇷 ';
    if (n.includes('egypt')) flags += '🇪🇬 ';
    if (n.includes('leban')) flags += '🇱🇧 ';
    if (n.includes('arab') && !flags) flags += '🇸🇦 '; 

    // Americas
    if (n.includes('brazil')) flags += '🇧🇷 ';
    if (n.includes('hondur')) flags += '🇭🇳 ';
    if (n.includes('colomb')) flags += '🇨🇴 ';
    if (n.includes('peru')) flags += '🇵🇪 ';
    if (n.includes('costa r')) flags += '🇨🇷 ';

    // Africa
    if (n.includes('morocc')) flags += '🇲🇦 ';
    if (n.includes('alger')) flags += '🇩🇿 ';
    if (n.includes('tunis')) flags += '🇹🇳 ';
    if (n.includes('congo')) flags += '🇨🇩 ';
    if (n.includes('burkina')) flags += '🇧🇫 ';
    if (n.includes('mali')) flags += '🇲🇱 ';

    return flags.trim();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Users size={32} />
              Teilnehmerliste
            </h1>
            <p className="text-indigo-200 opacity-90">
              {filter === 'my_course' ? 'Meine Klasse (26 TI G2)' : filter === 'other_course' ? 'Partnerklasse (26 TI G1)' : filter === 'other_students' ? 'Andere Gruppen' : 'Alle Teilnehmer & Dozenten'}
            </p>
          </div>
          <div className="text-indigo-100 font-mono bg-indigo-800/30 px-3 py-1 rounded text-sm">
            {filteredStudents.length} Personen
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col xl:flex-row gap-4">
          {/* Tabs */}
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto xl:w-auto w-full no-scrollbar">
              <button 
                onClick={() => setFilter('my_course')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filter === 'my_course' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                  G2 (Meine Klasse)
              </button>
              <button 
                onClick={() => setFilter('other_course')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filter === 'other_course' ? 'bg-slate-200 text-slate-800 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                  G1 (Partner)
              </button>
              <button 
                onClick={() => setFilter('other_students')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filter === 'other_students' ? 'bg-slate-200 text-slate-800 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                  Andere
              </button>
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                  Alle
              </button>
          </div>

          {/* Filters Group */}
          <div className="flex-1 flex flex-col md:flex-row gap-3">
            {/* Nationality Dropdown */}
            <div className="relative md:w-56">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Globe className="h-5 w-5 text-slate-400" />
                </div>
                <select
                    value={nationalityFilter}
                    onChange={(e) => setNationalityFilter(e.target.value)}
                    className="block w-full pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer"
                >
                    <option value="all">Alle Länder</option>
                    {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm"
                placeholder="Name oder E-Mail suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                <Filter className="text-slate-400" size={24} />
            </div>
            <p className="font-medium">Keine Teilnehmer gefunden.</p>
            <p className="text-sm text-slate-400 mt-1">Versuche es mit anderen Filtern.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Kurs</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Nationalität</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">E-Mail</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aktionen</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                   const isTrainer = student.role === 'Trainer/in';
                   const isMyClass = student.course === '26 TI G2';
                   const flags = getCountryFlag(student.nationality);
                   
                   return (
                    <tr key={student.id} className={`hover:bg-slate-50 transition-colors ${isTrainer ? 'bg-indigo-50/40' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isTrainer ? 'bg-indigo-100 text-indigo-600' : isMyClass ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                             <User size={20} />
                          </div>
                          <div className="ml-4">
                            <div className={`text-sm font-bold flex items-center gap-2 ${isTrainer ? 'text-indigo-700' : 'text-slate-900'}`}>
                                {student.lastName}, {student.firstName}
                                {flags && <span className="text-base" title={student.nationality}>{flags}</span>}
                            </div>
                            <div className="text-xs text-slate-500">
                                {student.role}
                            </div>
                            <div className="lg:hidden text-xs text-slate-400 mt-1 flex items-center gap-1">
                                {student.nationality && <><Globe size={10} /> {student.nationality}</>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                             student.course === 'Both' ? 'bg-purple-100 text-purple-800' :
                             student.course === '26 TI G2' ? 'bg-green-100 text-green-800' :
                             student.course === '26 TI G1' ? 'bg-blue-50 text-blue-600' :
                             'bg-slate-100 text-slate-600'
                         }`}>
                             {student.course === 'Both' ? 'Alle Kurse' : student.course}
                         </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                         {student.nationality && (
                             <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">
                                <Globe size={12} className="text-slate-400"/>
                                {student.nationality}
                             </div>
                         )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600 font-mono truncate max-w-[200px] xl:max-w-none" title={student.email}>{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                            <button 
                                onClick={() => handleCopyEmail(student.email)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative group"
                                title="E-Mail kopieren"
                            >
                                {copiedEmail === student.email ? <Check size={18} className="text-green-500"/> : <Copy size={18} />}
                            </button>
                            <a 
                                href={`mailto:${student.email}`}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="E-Mail schreiben"
                            >
                                <Mail size={18} />
                            </a>
                        </div>
                      </td>
                    </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
