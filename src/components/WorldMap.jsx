import React, { useState, useRef } from "react";
import { ComposableMap, Geographies, Geography, Sphere, Graticule, Marker } from "react-simple-maps";
import { geoCentroid } from "d3-geo";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = ({ onSelectCountry }) => {
  const [rotation, setRotation] = useState([-15, -30, 0]);
  const [zoom, setZoom] = useState(window.innerWidth < 768 ? 280 : 350); // كبرنا الـ scale للتلفون
  const [isDragging, setIsDragging] = useState(false);
  
  // مرجع لتخزين آخر نقطة لمس (ضروري للتلفون)
  const lastTouch = useRef(null);

  // تدوير بالماوس (Desktop)
  const handleMouseMove = (e) => {
    if (isDragging) {
      setRotation([
        rotation[0] + (e.movementX || 0) * 0.5,
        rotation[1] - (e.movementY || 0) * 0.5,
        0
      ]);
    }
  };

  // تدوير باللمس (Mobile) - هذا هو السحر اللي كان ناقص
  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (lastTouch.current) {
        const dx = touch.clientX - lastTouch.current.x;
        const dy = touch.clientY - lastTouch.current.y;
        
        setRotation(prev => [
          prev[0] + dx * 0.5,
          prev[1] - dy * 0.5,
          0
        ]);
      }
      lastTouch.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    lastTouch.current = { x: touch.clientX, y: touch.clientY };
  };

  return (
    <div 
      className="relative w-full h-[80vh] md:h-[90vh] bg-[#020617] overflow-hidden touch-none select-none shadow-2xl"
      onWheel={(e) => {
        const zoomStep = 40;
        setZoom(prev => e.deltaY < 0 ? Math.min(prev + zoomStep, 1200) : Math.max(prev - zoomStep, 200));
      }}
      // أحداث الكمبيوتر
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      // أحداث التلفون
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => { setIsDragging(false); lastTouch.current = null; }}
    >
      {/* HUD UI */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <h2 className="text-2xl md:text-5xl font-black italic text-white uppercase tracking-tighter">
          Kora <span className="text-blue-600">Global</span>
        </h2>
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <ComposableMap 
          projection="geoOrthographic" 
          projectionConfig={{ 
            scale: zoom, 
            rotate: rotation 
          }} 
          // عرض الخريطة يملى الحاوية
          width={800}
          height={800}
          style={{ width: "120%", height: "120%" }} // كبرنا العرض الفعلي للـ SVG
          className="outline-none"
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
                    style={{
                      default: { fill: "#1e293b", stroke: "#0f172a", strokeWidth: 0.5, outline: "none" },
                      hover: { fill: "#2563eb", stroke: "#60a5fa", outline: "none" },
                      pressed: { fill: "#1d4ed8", outline: "none" },
                    }}
                  />
                ))}

                {geographies.map((geo) => {
                  if (zoom < 600) return null; // الأسامي تظهر كان كي تزومي بالباهي
                  const centroid = geoCentroid(geo);
                  return (
                    <Marker key={geo.rsmKey + "-label"} coordinates={centroid}>
                      <text
                        textAnchor="middle"
                        fill="white"
                        style={{
                          fontSize: zoom / 40,
                          fontWeight: "bold",
                          pointerEvents: "none",
                          textShadow: "0 0 5px black",
                        }}
                      >
                        {geo.properties.name}
                      </text>
                    </Marker>
                  );
                })}
              </>
            )}
          </Geographies>
        </ComposableMap>
      </div>

      {/* تعليمات التلفون */}
      <div className="absolute bottom-10 w-full flex justify-center pointer-events-none px-4">
        <div className="bg-blue-600/20 backdrop-blur-md border border-blue-500/30 px-6 py-2 rounded-full">
           <p className="text-[10px] text-blue-400 font-mono tracking-widest uppercase animate-pulse">
             Use one finger to rotate
           </p>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;