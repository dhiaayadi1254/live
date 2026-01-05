import React from 'react';
import { motion } from 'framer-motion';

const MatchList = ({ leagueName, matches, onBack, onSelectMatch }) => {
  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <button 
          onClick={onBack} 
          className="text-slate-500 hover:text-white transition-colors uppercase text-xs tracking-widest font-mono flex items-center gap-2"
        >
          ← Back to Leagues
        </button>
        <div className="text-right">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase text-white tracking-tighter">
            {leagueName} <span className="text-blue-600">Matches</span>
          </h2>
          <div className="h-1 w-20 bg-blue-600 ml-auto mt-2"></div>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {matches.length > 0 ? (
          matches.map((match) => (
            <motion.div 
              key={match.id}
              whileHover={{ scale: 1.01, translateY: -2 }}
              onClick={() => onSelectMatch(match)}
              className="bg-slate-900/40 border border-white/5 p-5 md:p-8 rounded-[2rem] flex items-center justify-between hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden group shadow-xl"
            >
               {/* Background Glow */}
               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               
               {/* Team 1 (Home) */}
               <div className="flex flex-col items-center gap-3 w-1/3 z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-800/50 rounded-full p-3 border border-white/5 group-hover:border-blue-500/30 transition-all">
                    <img src={match.homeLogo} className="w-full h-full object-contain drop-shadow-2xl" alt={match.home} />
                  </div>
                  <span className="font-black uppercase tracking-tight text-sm md:text-base text-center">{match.home}</span>
               </div>

               {/* Match Info (Center) */}
               <div className="flex flex-col items-center justify-center w-1/3 z-10">
                  {match.status === "LIVE" ? (
                    <div className="bg-red-600 px-3 py-1 rounded-full text-[10px] font-black animate-pulse mb-3 shadow-[0_0_15px_rgba(220,38,38,0.4)]">LIVE</div>
                  ) : (
                    <div className="text-slate-500 text-[10px] font-mono mb-2 uppercase tracking-tighter italic">Upcoming</div>
                  )}
                  <div className="text-3xl md:text-5xl font-black italic text-white/10 group-hover:text-blue-500/20 transition-all tracking-tighter">VS</div>
                  <div className="text-xs font-mono text-blue-400/60 mt-3 bg-blue-500/5 px-3 py-1 rounded-md">{match.time}</div>
               </div>

               {/* Team 2 (Away) */}
               <div className="flex flex-col items-center gap-3 w-1/3 z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-800/50 rounded-full p-3 border border-white/5 group-hover:border-blue-500/30 transition-all">
                    <img src={match.awayLogo} className="w-full h-full object-contain drop-shadow-2xl" alt={match.away} />
                  </div>
                  <span className="font-black uppercase tracking-tight text-sm md:text-base text-center">{match.away}</span>
               </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-900/20 rounded-[2rem] border border-dashed border-white/5 text-slate-500 font-mono">
            No matches scheduled for this league yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchList;