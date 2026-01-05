import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = ({ onSelectCountry }) => {
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  return (
    <div className="relative w-full h-[75vh] bg-slate-950 rounded-[2.5rem] border border-blue-500/20 shadow-2xl overflow-hidden cursor-crosshair"
         onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}>
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <AnimatePresence>
        {tooltipContent && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
            className="fixed z-[100] pointer-events-none px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg border border-blue-400 text-sm flex items-center gap-2"
            style={{ left: tooltipPos.x + 15, top: tooltipPos.y - 40 }}>
            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
            {tooltipContent}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-8 left-10 z-10 pointer-events-none">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
          <span className="text-blue-400 font-mono text-xs tracking-[0.3em] uppercase">System Online</span>
        </div>
        <h2 className="text-4xl font-black italic bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">KORA LIVE MAP</h2>
      </div>

      <ComposableMap projectionConfig={{ scale: 200 }}>
        <ZoomableGroup center={[20, 0]} maxZoom={3}>
          <Geographies geography={geoUrl}>
            {({ geographies }) => geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo}
                onMouseEnter={() => setTooltipContent(geo.properties.name)}
                onMouseLeave={() => setTooltipContent("")}
                onClick={() => onSelectCountry(geo.properties.name)}
                style={{
                  default: { fill: "#0f172a", stroke: "#1e293b", strokeWidth: 0.5, outline: "none" },
                  hover: { fill: "#2563eb", stroke: "#60a5fa", strokeWidth: 1.5, cursor: "pointer", outline: "none" },
                  pressed: { fill: "#1d4ed8", outline: "none" },
                }}
              />
            ))}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};
export default WorldMap;