import React, { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Sphere, Graticule, Marker } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { geoCentroid } from "d3-geo";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = ({ onSelectCountry }) => {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [rotation, setRotation] = useState([-15, -30, 0]);
  const [zoom, setZoom] = useState(window.innerWidth < 768 ? 240 : 350);
  const [isDragging, setIsDragging] = useState(false);

  // حساب حركة الماوس للتدوير
  const handleMouseMove = (e) => {
    if (isDragging) {
      setRotation([
        rotation[0] + (e.movementX || 0) * 0.5,
        rotation[1] - (e.movementY || 0) * 0.5,
        0
      ]);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomStep = 40;
    if (e.deltaY < 0) setZoom(prev => Math.min(prev + zoomStep, 1200));
    else setZoom(prev => Math.max(prev - zoomStep, 180));
  };

  return (
    <div 
      className="relative w-full h-[85vh] md:h-[90vh] bg-[#020617] md:rounded-[3rem] overflow-hidden touch-none select-none shadow-2xl border border-white/5"
      onWheel={handleWheel}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Title HUD */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20 pointer-events-none">
        <h2 className="text-xl md:text-5xl font-black italic text-white uppercase tracking-tighter">
          Kora <span className="text-blue-600">Global</span>
        </h2>
        <div className="h-1 w-8 bg-blue-600 mt-1 rounded-full animate-pulse"></div>
      </div>

      <div className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
        <ComposableMap 
          projection="geoOrthographic" 
          projectionConfig={{ scale: zoom, rotate: rotation }} 
          className="w-full h-full outline-none"
        >
          <Sphere stroke="#1e293b" strokeWidth={0.5} fill="#0a0f1d" />
          <Graticule stroke="#1e293b" strokeWidth={0.3} opacity={0.2} />
          
          <Geographies geography={geoUrl}>
            {({ geographies }) => (
              <>
                {geographies.map((geo) => (
                  <Geography 
                    key={geo.rsmKey} 
                    geography={geo}
                    onClick={() => !isDragging && onSelectCountry(geo.properties.name)}
                    onMouseEnter={() => setHoveredCountry(geo.rsmKey)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{
                      default: { fill: "#1e293b", stroke: "#0f172a", strokeWidth: 0.5, outline: "none" },
                      hover: { fill: "#2563eb", stroke: "#60a5fa", strokeWidth: 0.8, outline: "none" },
                      pressed: { fill: "#1d4ed8", outline: "none" },
                    }}
                  />
                ))}

                {/* رسم الأسامي بطريقة ذكية */}
                {geographies.map((geo) => {
                  const centroid = geoCentroid(geo);
                  const name = geo.properties.name;
                  const isHovered = hoveredCountry === geo.rsmKey;

                  // إظهار الاسم إذا:
                  // 1. الماوس فوق البلاد
                  // 2. أو الزوم كبُر (بدأنا نقربو)
                  const shouldShow = isHovered || zoom > 500;
                  if (!shouldShow) return null;

                  return (
                    <Marker key={geo.rsmKey + "-label"} coordinates={centroid}>
                      <text
                        textAnchor="middle"
                        fill={isHovered ? "#60a5fa" : "white"}
                        style={{
                          fontFamily: "sans-serif",
                          fontSize: isHovered ? (zoom/20) : (zoom/45),
                          fontWeight: "bold",
                          pointerEvents: "none",
                          textShadow: "0 0 8px black",
                          opacity: isHovered ? 1 : 0.6,
                        }}
                      >
                        {name}
                      </text>
                    </Marker>
                  );
                })}
              </>
            )}
          </Geographies>
        </ComposableMap>
      </div>

      {/* Footer Info for Mobile */}
      <div className="absolute bottom-6 w-full flex justify-center pointer-events-none px-4 text-center">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
           <p className="text-[9px] md:text-xs text-slate-300 font-mono tracking-widest uppercase">
             {zoom > 500 ? "Labels Visible • Explore" : "Zoom in to see country names"}
           </p>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;