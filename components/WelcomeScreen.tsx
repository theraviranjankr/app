
import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Star, Quote } from 'lucide-react';

interface WelcomeScreenProps {
  onEnter: () => void;
}

const QUOTES = [
  { text: "Bildung ist die mächtigste Waffe, die du verwenden kannst, um die Welt zu verändern.", author: "Nelson Mandela" },
  { text: "Es spielt keine Rolle, wie langsam du gehst, solange du nicht stehen bleibst.", author: "Konfuzius" },
  { text: "Der beste Weg, die Zukunft vorherzusagen, ist, sie zu gestalten.", author: "Abraham Lincoln" },
  { text: "Erfolg hat drei Buchstaben: TUN.", author: "Johann Wolfgang von Goethe" },
  { text: "Glaube an dich selbst und an das, was du bist.", author: "Unbekannt" },
  { text: "Jeder Tag ist eine neue Chance, das zu tun, was du tun möchtest.", author: "Friedrich Schiller" },
  { text: "Lernen ist wie Rudern gegen den Strom. Sobald man aufhört, treibt man zurück.", author: "Benjamin Britten" },
  { text: "Man lernt nicht für die Schule, sondern für das Leben.", author: "Seneca" }
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [quote, setQuote] = useState(QUOTES[0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Pick a random quote based on the day of the year to keep it consistent for the day, 
    // or just random on load. Let's do random on load for freshness.
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      
      {/* Animated Background Shapes */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className={`max-w-2xl w-full z-10 flex flex-col items-center text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        <div className="mb-8 inline-block p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
           <Sparkles size={40} className="text-yellow-300 animate-pulse" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tight drop-shadow-md">
          Namaste, Raviranjan!
        </h1>
        <p className="text-xl md:text-2xl text-white/80 font-light mb-12">
          Willkommen zurück zu deinem Begleiter.
        </p>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl max-w-xl mb-12 relative">
          <Quote className="absolute top-4 left-4 text-white/20 transform -scale-x-100" size={40} />
          <p className="text-lg md:text-xl font-serif italic leading-relaxed mb-4 relative z-10">
            "{quote.text}"
          </p>
          <p className="text-sm font-bold uppercase tracking-widest text-white/60 text-right">
            — {quote.author}
          </p>
        </div>

        <button 
          onClick={onEnter}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-purple-700 text-lg font-bold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <span>App Starten</span>
          <div className="bg-purple-100 rounded-full p-1 group-hover:translate-x-1 transition-transform">
            <ArrowRight size={20} className="text-purple-600" />
          </div>
        </button>

        <p className="mt-8 text-sm text-white/40 font-medium">
          26 TI G2 • Studienkolleg Coburg
        </p>

      </div>
    </div>
  );
};

export default WelcomeScreen;
