import React from 'react';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';

const VideoPlayer = ({ streamUrl, matchTitle, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-10"
    >
      {/* Header المشغل */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl md:text-3xl font-black italic text-white uppercase tracking-tighter">
            Watching: <span className="text-blue-500">{matchTitle}</span>
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-mono text-red-500 uppercase font-bold tracking-widest">Live Broadcast</span>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="bg-white/5 hover:bg-white/10 p-3 rounded-full border border-white/10 transition-all group"
        >
          <span className="text-xl group-hover:rotate-90 block transition-transform">✕</span>
        </button>
      </div>

      {/* منطقة الفيديو */}
      <div className="relative w-full max-w-5xl aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)] border border-white/5">
        <ReactPlayer
          url={streamUrl}
          controls={true}
          playing={true}
          width="100%"
          height="100%"
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload'
              }
            }
          }}
        />
      </div>

      {/* Footer المشغل */}
      <div className="w-full max-w-5xl mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
        <div className="px-6 py-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
          <p className="text-xs text-blue-400 font-mono italic">Quality: Auto (Up to 1080p)</p>
        </div>
        <div className="px-6 py-3 bg-white/5 border border-white/5 rounded-2xl">
          <p className="text-xs text-slate-400 font-mono italic">Server: Primary Gold</p>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoPlayer;