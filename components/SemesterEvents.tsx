import React, { useState, useEffect } from 'react';
import { ICS_CALENDAR_URL } from '../constants';
import { CalendarEvent } from '../types';
import { Calendar, Clock, MapPin, Loader2, AlertCircle, CheckCircle2, History, Info, ExternalLink, RefreshCw } from 'lucide-react';

// Keywords to ignore if found in title
const IGNORED_KEYWORDS: string[] = [
  // "Intern", 
  // "Raumbuchung", 
];

// Keep history for approx 6 months
const HISTORY_DAYS_LIMIT = 180; 

const parseICSDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  // Matches YYYYMMDD or YYYYMMDDTHHMMSS(Z)
  const match = dateStr.match(/(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?/);
  if (!match) return null;

  const [, y, m, d, h, min, s, z] = match;
  const year = parseInt(y);
  const month = parseInt(m) - 1;
  const day = parseInt(d);
  
  if (h === undefined) {
      // All-day event (Date only)
      return new Date(year, month, day);
  }

  const hour = parseInt(h);
  const minute = parseInt(min);
  const second = parseInt(s);

  // If Z is present, it's UTC.
  if (z === 'Z') {
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }

  // Otherwise treat as local/floating time
  return new Date(year, month, day, hour, minute, second);
};

const parseICSEvents = (icsContent: string): CalendarEvent[] => {
  const lines = icsContent.split(/\r\n|\n|\r/);
  const events: CalendarEvent[] = [];

  let inEvent = false;
  let currentEvent: any = {};

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Handle line unfolding (lines starting with whitespace are continuations)
    while (i + 1 < lines.length && (lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('\t'))) {
      line += lines[i + 1].substring(1);
      i++;
    }

    if (line.trim().startsWith('BEGIN:VEVENT')) {
      inEvent = true;
      currentEvent = {};
    } else if (line.trim().startsWith('END:VEVENT')) {
      inEvent = false;
      
      // Only add if we have at least a start date
      if (currentEvent.dtstart) {
        const startDate = parseICSDate(currentEvent.dtstart);
        const summary = currentEvent.summary || "Termin"; // Fallback title
        
        if (startDate) {
           const isAllDay = currentEvent.dtstart.includes('VALUE=DATE') || currentEvent.dtstart.length === 8 || !currentEvent.dtstart.includes('T');

           events.push({
             id: `${startDate.toISOString()}-${summary}-${Math.random().toString(36).substr(2, 9)}`,
             date: startDate,
             title: summary.replace(/\\,/g, ',').replace(/\\;/g, ';'),
             location: currentEvent.location ? currentEvent.location.replace(/\\,/g, ',').replace(/\\n/g, ', ') : undefined,
             description: currentEvent.description ? currentEvent.description.replace(/\\n/g, '\n') : undefined,
             isAllDay
           });
        }
      }
    } else if (inEvent) {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex > -1) {
        const keyPart = line.substring(0, separatorIndex);
        const value = line.substring(separatorIndex + 1).trim();
        
        // Split parameters (e.g., DTSTART;VALUE=DATE)
        const key = keyPart.split(';')[0];

        if (key === 'DTSTART') currentEvent.dtstart = value;
        if (key === 'SUMMARY') currentEvent.summary = value;
        if (key === 'LOCATION') currentEvent.location = value;
        if (key === 'DESCRIPTION') currentEvent.description = value;
      }
    }
  }
  
  return events;
};

const EventCard: React.FC<{ event: CalendarEvent; isPast?: boolean }> = ({ event, isPast = false }) => (
  <div className={`bg-white rounded-xl p-4 shadow-sm border flex gap-4 transition-all ${isPast ? 'border-slate-100 bg-slate-50/50' : 'border-slate-200 hover:border-blue-300 hover:shadow-md'}`}>
      <div className={`flex-shrink-0 w-16 flex flex-col items-center justify-center rounded-lg ${isPast ? 'bg-slate-200 text-slate-500 grayscale' : 'bg-blue-50 text-blue-600'}`}>
          <span className="text-xs font-bold uppercase">{event.date.toLocaleDateString('de-DE', { month: 'short' })}</span>
          <span className="text-2xl font-bold">{event.date.getDate()}</span>
      </div>
      
      <div className="flex-1 min-w-0">
           <div className="flex justify-between items-start">
              <h3 className={`font-bold truncate pr-2 ${isPast ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-800'}`}>{event.title}</h3>
              {isPast && <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-500 text-[10px] font-bold">VERGANGEN</span>}
           </div>
           
           <div className="mt-1 flex flex-wrap gap-3 text-xs">
              {!event.isAllDay && (
                  <div className="flex items-center gap-1 text-slate-500">
                      <Clock size={12} />
                      <span>{event.date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr</span>
                  </div>
              )}
              {event.location && (
                  <div className="flex items-center gap-1 text-slate-500">
                      <MapPin size={12} />
                      <span className="truncate max-w-[200px]">{event.location}</span>
                  </div>
              )}
           </div>
      </div>
  </div>
);

const SemesterEvents: React.FC = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(false);
      
      const timestamp = Date.now();
      // Append timestamp to the actual ICS URL to prevent Outlook/Intermediate caching
      const targetUrl = `${ICS_CALENDAR_URL}${ICS_CALENDAR_URL.includes('?') ? '&' : '?'}nocache=${timestamp}`;

      // List of proxies to try in order.
      const proxies = [
        // Proxy 1: CorsProxy.io (Very reliable for raw streaming)
        (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
        
        // Proxy 2: AllOrigins (Good backup)
        (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        
        // Proxy 3: CodeTabs (Another alternative)
        (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
      ];

      for (const [index, proxyGen] of proxies.entries()) {
        try {
          const proxyUrl = proxyGen(targetUrl);
          console.log(`Attempting fetch with proxy ${index + 1}: ${proxyUrl}`);
          
          const response = await fetch(proxyUrl);
          
          if (!response.ok) {
            console.warn(`Proxy ${index + 1} failed with status: ${response.status}`);
            continue; // Try next proxy
          }
          
          const text = await response.text();
          
          // Basic validation to ensure we got an ICS file and not an error page/JSON
          if (!text.includes("BEGIN:VCALENDAR") && !text.includes("BEGIN:VEVENT")) {
             console.warn(`Proxy ${index + 1} returned invalid content (length: ${text.length})`);
             continue; // Try next proxy
          }

          // Parse
          const allEvents = parseICSEvents(text);
          console.log(`Successfully parsed ${allEvents.length} events from proxy ${index + 1}`);
          
          const now = new Date();
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const pastCutoff = new Date(todayStart);
          pastCutoff.setDate(pastCutoff.getDate() - HISTORY_DAYS_LIMIT);

          const filteredEvents = allEvents.filter(event => {
              if (event.date < pastCutoff) return false;
              if (IGNORED_KEYWORDS.some(keyword => event.title.includes(keyword))) return false;
              return true;
          });

          const upcoming = filteredEvents
              .filter(e => e.date >= todayStart)
              .sort((a, b) => a.date.getTime() - b.date.getTime());

          const past = filteredEvents
              .filter(e => e.date < todayStart)
              .sort((a, b) => b.date.getTime() - a.date.getTime());

          setUpcomingEvents(upcoming);
          setPastEvents(past);
          setDebugInfo(`Proxy ${index + 1} | Events: ${allEvents.length}`);
          setLoading(false);
          return; // Success! Exit function

        } catch (err) {
          console.error(`Error with proxy ${index + 1}:`, err);
          // Continue loop to next proxy
        }
      }

      // If we get here, all proxies failed
      setError(true);
      setLoading(false);
    };

    fetchEvents();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-slate-400">
            <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
            <span className="text-sm font-medium">Lade Semesterplan...</span>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center p-4">
            <div className="bg-red-50 p-4 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="space-y-2">
                <h3 className="font-bold text-slate-800">Termine konnten nicht geladen werden</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    Der Kalender konnte nicht abgerufen werden. Möglicherweise blockiert eine Firewall die Verbindung.
                </p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
                <button 
                    onClick={handleRetry} 
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                >
                    <RefreshCw size={16} />
                    Erneut versuchen
                </button>
                <a 
                    href={ICS_CALENDAR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                    <ExternalLink size={16} />
                    Direkt in Outlook öffnen
                </a>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-7 h-7 text-blue-600" />
              Semesterplan & Termine
          </h2>
          <div className="flex items-center gap-3 text-right">
             <div className="hidden sm:block">
                 <span className="block text-xs text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">
                   Live Sync: Outlook
                 </span>
                 {debugInfo && <span className="block text-[10px] text-slate-300 mt-1">{debugInfo}</span>}
             </div>
             <button 
                onClick={handleRetry}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                title="Aktualisieren"
             >
                 <RefreshCw size={18} />
             </button>
          </div>
       </div>

       {/* Upcoming Section */}
       <section>
          <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={20} />
              Aktuell & Demnächst
          </h3>
          {upcomingEvents.length === 0 ? (
              <div className="bg-slate-50 rounded-xl p-12 flex flex-col items-center justify-center text-center border border-dashed border-slate-200 text-slate-500">
                  <Info size={40} className="mb-4 text-slate-300" />
                  <p className="font-medium text-slate-600">Keine anstehenden Termine gefunden.</p>
                  <p className="text-sm text-slate-400 mt-1">Genieße die freie Zeit!</p>
              </div>
          ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {upcomingEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                  ))}
              </div>
          )}
       </section>

       {/* Past Section */}
       {pastEvents.length > 0 && (
           <section className="pt-8 border-t border-slate-200">
               <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-400 flex items-center gap-2">
                        <History className="text-slate-400" size={20} />
                        Vergangene Termine
                    </h3>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Letzte 6 Monate</span>
               </div>
               
               <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 opacity-75 hover:opacity-100 transition-opacity">
                   {pastEvents.map(event => (
                       <EventCard key={event.id} event={event} isPast={true} />
                   ))}
               </div>
           </section>
       )}
    </div>
  );
};

export default SemesterEvents;