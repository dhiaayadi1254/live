import React from 'react';
import { motion } from 'framer-motion';

const LeaguesGrid = ({ selectedCountry, leagues, onBack, onSelectLeague }) => {
  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-12 relative overflow-hidden">
      
      {/* خلفية ديناميكية */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-24 gap-8 border-b border-white/5 pb-10">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              <span className="text-blue-400 font-mono tracking-[0.4em] uppercase text-xs font-bold">Satellite Feed: Connected</span>
            </div>
            <h2 className="text-7xl md:text-9xl font-black italic tracking-tighter text-white uppercase leading-none select-none">
              {selectedCountry}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500">PRO LEAGUES</span>
            </h2>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack} 
            className="px-10 py-5 bg-white/5 border border-white/10 rounded-full text-white font-mono text-xs tracking-widest flex items-center gap-4 backdrop-blur-xl shadow-2xl group"
          >
            <span className="group-hover:-translate-x-2 transition-transform text-blue-500 text-lg">←</span> RETURN TO GLOBAL MAP
          </motion.button>
        </div>

        {/* Leagues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {leagues.map((league, index) => (
            <motion.div 
              key={league.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              onClick={() => onSelectLeague(league.id)} 
              className="relative group cursor-pointer"
            >
              {/* Outer Neon Glow */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[3.5rem] blur opacity-0 group-hover:opacity-60 transition duration-700"></div>
              
              <div className="relative bg-[#0a1122]/80 backdrop-blur-3xl border border-white/10 p-12 rounded-[3.5rem] flex flex-col items-center h-[450px] shadow-2xl overflow-hidden group-hover:border-blue-500/50 transition-all duration-500">
                
                {/* HUD Scanning Line Effect */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent top-[-100%] group-hover:top-[110%] transition-all duration-1000 ease-in-out"></div>

                {/* Logo Box - توا خذي الحجم الكبير */}
                <div className="w-56 h-56 rounded-full mb-10 flex items-center justify-center border-4 border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group-hover:border-blue-500/30 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent z-10"></div>
                  {league.logo ? (
                    <img 
                      src={league.logo} 
                      alt={league.name} 
                      className="w-full h-full object-cover relative z-0 transition-transform duration-700 group-hover:scale-125" 
                    />
                  ) : (
                    <span className="text-8xl relative z-10 drop-shadow-2xl">⚽</span>
                  )}
                  {/* Glass Reflection */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 to-transparent opacity-50"></div>
                </div>

                {/* League Name Section */}
                <div className="text-center z-10 mt-auto">
                  <h3 className="text-4xl font-black text-white mb-4 group-hover:text-blue-400 transition-colors uppercase italic tracking-tighter">
                    {league.name}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-4 py-3 px-6 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-blue-600/10 group-hover:border-blue-500/20 transition-all">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-300 uppercase tracking-[0.2em] font-bold">Live Streams Available</span>
                  </div>
                </div>

                {/* Cyberpunk Decorative Corner */}
                <div className="absolute bottom-6 right-8 opacity-20 group-hover:opacity-100 transition-opacity">
                   <div className="text-[10px] font-mono text-blue-500 font-bold">ID: 00{league.id}_SRC</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaguesGrid;