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

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/* ================= Stars (FIXED) ================= */
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
    <circle
      key={i}
      cx={s.x}
      cy={s.y}
      r={s.r}
      fill="white"
      opacity={s.o}
    />
  ));
};

/* ================= Satellite ================= */
const Satellite = ({ angle, radius = 150 }) => {
  const rad = (angle * Math.PI) / 180;

  return (
    <Marker
      coordinates={[
        Math.cos(rad) * radius,
        Math.sin(rad) * radius,
      ]}
    >
      <g>
        <circle r={2} fill="#38bdf8" />
        <rect x={-6} y={-1} width={3} height={2} fill="#94a3b8" />
        <rect x={3} y={-1} width={3} height={2} fill="#94a3b8" />
      </g>
    </Marker>
  );
};

const WorldMap = ({ onSelectCountry }) => {
  const [rotation, setRotation] = useState([-15, -30, 0]);
  const [zoom, setZoom] = useState(
    window.innerWidth < 768 ? 450 : 350
  );
  const [isDragging, setIsDragging] = useState(false);
  const [satAngle, setSatAngle] = useState(0);

  const lastTouch = useRef(null);
  const lastDistance = useRef(null);

  /* ========== Satellite animation ========== */
  useEffect(() => {
    const i = setInterval(() => {
      setSatAngle((a) => (a + 0.4) % 360);
    }, 30);
    return () => clearInterval(i);
  }, []);

  /* ========== Desktop rotation ========== */
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setRotation((prev) => [
      prev[0] + (e.movementX || 0) * 0.3,
      prev[1] - (e.movementY || 0) * 0.3,
      0,
    ]);
  };

  /* ========== Mobile ========== */
  const handleTouchStart = (e) => {
    setIsDragging(true);
    if (e.touches.length === 1) {
      const t = e.touches[0];
      lastTouch.current = { x: t.clientX, y: t.clientY };
    }
  };

  const handleTouchMove = (e) => {
    // Rotate
    if (e.touches.length === 1 && lastTouch.current) {
      const t = e.touches[0];
      const dx = t.clientX - lastTouch.current.x;
      const dy = t.clientY - lastTouch.current.y;

      setRotation((prev) => [
        prev[0] + dx * 0.25,
        prev[1] - dy * 0.25,
        0,
      ]);

      lastTouch.current = { x: t.clientX, y: t.clientY };
    }

    // Pinch zoom
    if (e.touches.length === 2) {
      const dx =
        e.touches[0].clientX - e.touches[1].clientX;
      const dy =
        e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (lastDistance.current) {
        const delta = distance - lastDistance.current;
        setZoom((prev) =>
          Math.min(1200, Math.max(250, prev + delta * 2))
        );
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
      className="relative w-full h-screen bg-gradient-to-b from-black via-slate-950 to-black
      overflow-hidden select-none touch-pan-y"
      onWheel={(e) => {
        const step = 40;
        setZoom((prev) =>
          e.deltaY < 0
            ? Math.min(prev + step, 1200)
            : Math.max(prev - step, 250)
        );
      }}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Title */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <h2 className="text-2xl md:text-5xl font-black italic text-white">
          Kora <span className="text-blue-600">Global</span>
        </h2>
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <ComposableMap
          projection="geoOrthographic"
          projectionConfig={{ scale: zoom, rotate: rotation }}
          width={800}
          height={800}
          style={{ width: "140%", height: "140%" }}
        >
          <Sphere fill="#020617" stroke="#1e293b" />
          <Graticule stroke="#1e293b" opacity={0.15} />

          {/* Stars FIXED */}
          <g opacity={0.8}>
            <Stars />
          </g>

          {/* Satellites */}
          <Satellite angle={satAngle} radius={140} />
          <Satellite angle={satAngle + 120} radius={160} />
          <Satellite angle={satAngle + 240} radius={180} />

          {/* Countries */}
          <Geographies geography={geoUrl}>
            {({ geographies }) => (
              <>
                {geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() =>
                      !isDragging &&
                      onSelectCountry?.(geo.properties.name)
                    }
                    style={{
                      default: {
                        fill: "#1e293b",
                        stroke: "#020617",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: {
                        fill: "#2563eb",
                        stroke: "#60a5fa",
                        outline: "none",
                      },
                      pressed: {
                        fill: "#1d4ed8",
                        outline: "none",
                      },
                    }}
                  />
                ))}

                {geographies.map((geo) => {
                  if (zoom < 600) return null;
                  const c = geoCentroid(geo);
                  return (
                    <Marker key={geo.rsmKey} coordinates={c}>
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

      <div className="absolute bottom-8 w-full flex justify-center pointer-events-none">
        <div className="bg-blue-600/20 backdrop-blur-md border border-blue-500/30 px-5 py-2 rounded-full">
          <p className="text-[10px] text-blue-400 font-mono uppercase animate-pulse">
            One finger rotate · Two fingers zoom
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
