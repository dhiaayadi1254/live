import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WorldMap from './components/WorldMap';
import LeaguesGrid from './components/LeaguesGrid';
import MatchList from './components/MatchList';
import VideoPlayer from './components/VideoPlayer'; // تأكد إنك صنعت الملف هذا

const MOCK_DATA = {
  "Germany": [
    { 
      id: 1, name: "Bundesliga", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Bundesliga_logo_%282017%29.svg/1200px-Bundesliga_logo_%282017%29.svg.png",
      matches: [{ id: 101, home: "Bayern", away: "Dortmund", time: "20:00", status: "LIVE", homeLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png", awayLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/67/Borussia_Dortmund_logo.svg/1200px-Borussia_Dortmund_logo.svg.png", streamUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }]
    },
  ],
  "Tunisia": [
    { 
      id: 4, name: "Ligue Professionnelle 1", logo: "public/logole/7c3e461023ad3f76837beb01cbe67805.jpg",
      matches: [{ id: 201, home: "EST", away: "CA", time: "16:00", status: "LIVE", homeLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Esp%C3%A9rance_Sportive_de_Tunis.svg/1200px-Esp%C3%A9rance_Sportive_de_Tunis.svg.png", awayLogo: "https://upload.wikimedia.org/wikipedia/ar/thumb/d/d4/Logo_Club_Africain.svg/1200px-Logo_Club_Africain.svg.png", streamUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }]
    },
    { 
      id: 5, name: "Ligue 2", logo: "https://upload.wikimedia.org/wikipedia/ar/7/7a/FTF_logo.png",
      matches: [{ id: 202, home: "Jendouba", away: "Keff", time: "18:00", status: "LIVE", homeLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4d/CS_Sfax_logo.svg/1200px-CS_Sfax_logo.svg.png", awayLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e9/Etoile_Sportif_de_Sousse_logo.svg/1200px-Etoile_Sportif_de_Sousse_logo.svg.png", streamUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }]
    }
  ]
};

function App() {
  const [view, setView] = useState('map'); 
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [activeMatch, setActiveMatch] = useState(null); // حالة جديدة للمباراة المختارة

  const handleCountrySelect = (countryName) => {
    setSelectedCountry(countryName);
    setView('leagues');
  };

  const handleLeagueSelect = (leagueId) => {
    const league = MOCK_DATA[selectedCountry]?.find(l => l.id === leagueId);
    setSelectedLeague(league);
    setView('matches');
  };

  return (
    <div className="min-h-screen bg-[#01040f] text-slate-50 font-sans selection:bg-blue-500 selection:text-white">
      <AnimatePresence mode="wait">
        
        {view === 'map' && (
          <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 md:p-12">
             <div className="text-center mb-12">
               <h1 className="text-5xl font-black italic bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter uppercase mb-2">KORA WORLD LIVE</h1>
               <p className="text-slate-500 font-mono text-xs tracking-[0.5em] uppercase">Select Territory to Start Stream</p>
             </div>
             <WorldMap onSelectCountry={handleCountrySelect} />
          </motion.div>
        )}

        {view === 'leagues' && (
          <motion.div key="leagues" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}>
            <LeaguesGrid 
              selectedCountry={selectedCountry}
              leagues={MOCK_DATA[selectedCountry] || []}
              onBack={() => setView('map')}
              onSelectLeague={handleLeagueSelect}
            />
          </motion.div>
        )}

        {view === 'matches' && selectedLeague && (
          <motion.div key="matches" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <MatchList 
              leagueName={selectedLeague.name}
              matches={selectedLeague.matches || []}
              onBack={() => setView('leagues')}
              onSelectMatch={(match) => setActiveMatch(match)} // غيّرنا الـ Alert بفتح الـ Match
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* استدعاء الـ Player كـ Overlay */}
      <AnimatePresence>
        {activeMatch && (
          <VideoPlayer 
            streamUrl={activeMatch.streamUrl}
            matchTitle={`${activeMatch.home} vs ${activeMatch.away}`}
            onClose={() => setActiveMatch(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;