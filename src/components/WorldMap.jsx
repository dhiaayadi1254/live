import React, { useState, useRef, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  Marker,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/* ================= Stars ================= */
const Stars = () => {
  const starsRef = useRef(
    Array.from({ length: 150 }).map(() => ({
      x: Math.random() * 800,
      y: Math.random() * 800,
      r: Math.random() * 1.5,
      o: Math.random(),
    }))
  );

  return starsRef.current.map((s, i) => (
    <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.o} />
  ));
};

/* ================= Satellite ================= */
const Satellite = ({ angle, radius = 150 }) => {
  const rad = (angle * Math.PI) / 180;
  return (
    <Marker coordinates={[Math.cos(rad) * radius, Math.sin(rad) * radius]}>
      <g>
        <circle r={2} fill="#38bdf8" className="animate-pulse" />
        <rect x={-6} y={-1} width={3} height={2} fill="#94a3b8" opacity={0.6} />
        <rect x={3} y={-1} width={3} height={2} fill="#94a3b8" opacity={0.6} />
      </g>
    </Marker>
  );
};

const WorldMap = ({ onSelectCountry }) => {
  // كبرنا الـ Scale في التلفون لـ 550 باش يظهر الكوكب مالي البلاصة
  const [rotation, setRotation] = useState([-15, -30, 0]);
  const [zoom, setZoom] = useState(window.innerWidth < 768 ? 550 : 380);
  const [isDragging, setIsDragging] = useState(false);
  const [satAngle, setSatAngle] = useState(0);

  const lastTouch = useRef(null);
  const lastDistance = useRef(null);

  /* ========== Satellite animation ========== */
  useEffect(() => {
    const i = setInterval(() => {
      setSatAngle((a) => (a + 0.3) % 360);
    }, 30);
    return () => clearInterval(i);
  }, []);

  /* ========== Handlers ========== */
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setRotation((prev) => [
      prev[0] + (e.movementX || 0) * 0.3,
      prev[1] - (e.movementY || 0) * 0.3,
      0,
    ]);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    if (e.touches.length === 1) {
      const t = e.touches[0];
      lastTouch.current = { x: t.clientX, y: t.clientY };
    }
  };

  const handleTouchMove = (e) => {
    // تدوير بصبع واحد
    if (e.touches.length === 1 && lastTouch.current) {
      const t = e.touches[0];
      const dx = t.clientX - lastTouch.current.x;
      const dy = t.clientY - lastTouch.current.y;
      setRotation((prev) => [prev[0] + dx * 0.3, prev[1] - dy * 0.3, 0]);
      lastTouch.current = { x: t.clientX, y: t.clientY };
    }

    // زوم بصوز صوابع (Pinch)
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (lastDistance.current) {
        const delta = distance - lastDistance.current;
        // سرعة الزوم Delta * 3 تعطي استجابة أسرع في التلفون
        setZoom((prev) => Math.min(1500, Math.max(200, prev + delta * 3)));
      }
      lastDistance.current = distance;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastTouch.current = null;
    lastDistance.current = null;
  };

  return (
    <div
      className="relative w-full h-screen bg-[#020617] overflow-hidden select-none touch-none"
      onWheel={(e) => {
        const step = 50;
        setZoom((prev) => (e.deltaY < 0 ? Math.min(prev + step, 1500) : Math.max(prev - step, 200)));
      }}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* HUD Overlay */}
      <div className="absolute top-10 left-8 z-20 pointer-events-none">
        <h2 className="text-3xl md:text-5xl font-black italic text-white tracking-tighter uppercase">
          Kora <span className="text-blue-500">Vision</span>
        </h2>
        <div className="w-12 h-1 bg-blue-500 mt-2 rounded-full animate-pulse" />
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <ComposableMap
          projection="geoOrthographic"
          projectionConfig={{ scale: zoom, rotate: rotation }}
          width={800}
          height={800}
          // العرض 160% يخلي الكوكب يبان مالي الشاشة في العرض
          style={{ width: "160%", height: "160%" }}
        >
          <Sphere fill="#050a1a" stroke="#1e293b" strokeWidth={0.5} />
          <Graticule stroke="#1e293b" opacity={0.2} strokeWidth={0.5} />

          <g opacity={0.6}>
            <Stars />
          </g>

          {/* Satellites */}
          <Satellite angle={satAngle} radius={150} />
          <Satellite angle={satAngle + 120} radius={170} />
          <Satellite angle={satAngle + 240} radius={190} />

          {/* Geographies */}
          <Geographies geography={geoUrl}>
            {({ geographies }) => (
              <>
                {geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => !isDragging && onSelectCountry?.(geo.properties.name)}
                    style={{
                      default: { fill: "#1e293b", stroke: "#020617", strokeWidth: 0.5, outline: "none" },
                      hover: { fill: "#2563eb", stroke: "#60a5fa", outline: "none", cursor: "pointer" },
                      pressed: { fill: "#1d4ed8", outline: "none" },
                    }}
                  />
                ))}

                {/* Labels with Dynamic Sizing */}
                {geographies.map((geo) => {
                  // تظهر الأسماء فقط عند الزوم القوي لضمان وضوح الخريطة
                  if (zoom < 650) return null;
                  const c = geoCentroid(geo);
                  return (
                    <Marker key={geo.rsmKey + "-label"} coordinates={c}>
                      <text
                        textAnchor="middle"
                        fill="white"
                        style={{
                          fontSize: zoom / 42,
                          fontWeight: "bold",
                          pointerEvents: "none",
                          textShadow: "0 0 4px rgba(0,0,0,0.9)",
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

      {/* Helper Text */}
      <div className="absolute bottom-12 w-full flex justify-center pointer-events-none">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full shadow-2xl">
          <p className="text-[10px] text-white/60 font-mono uppercase tracking-widest">
            Pinch to zoom • Drag to rotate
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;