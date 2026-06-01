import React, { useState } from 'react';
import { MapPin, Navigation, Truck, User, Building2 } from 'lucide-react';

const InteractiveMap = ({ donors = [], receivers = [], volunteers = [], selectedRoute = null }) => {
  const [hoveredPin, setHoveredPin] = useState(null);

  // Simulated map area bounds (Delhi region)
  const mapBounds = { minLat: 28.45, maxLat: 28.75, minLng: 77.05, maxLng: 77.35 };

  const latToY = (lat) => {
    const range = mapBounds.maxLat - mapBounds.minLat;
    return ((mapBounds.maxLat - lat) / range) * 100;
  };

  const lngToX = (lng) => {
    const range = mapBounds.maxLng - mapBounds.minLng;
    return ((lng - mapBounds.minLng) / range) * 100;
  };

  const allPins = [
    ...donors.map(d => ({ ...d, type: 'donor', x: lngToX(d.coordinates?.lng || 77.2), y: latToY(d.coordinates?.lat || 28.6) })),
    ...receivers.map(r => ({ ...r, type: 'receiver', x: lngToX(r.coordinates?.lng || 77.22), y: latToY(r.coordinates?.lat || 28.65) })),
    ...volunteers.map(v => ({ ...v, type: 'volunteer', x: lngToX(v.coordinates?.lng || 77.18), y: latToY(v.coordinates?.lat || 28.55) })),
  ];

  const pinColors = {
    donor: { fill: '#10b981', stroke: '#059669', icon: Building2 },
    receiver: { fill: '#3b82f6', stroke: '#2563eb', icon: User },
    volunteer: { fill: '#f59e0b', stroke: '#d97706', icon: Truck },
  };

  return (
    <div className="glass-card p-0 overflow-hidden relative" style={{ minHeight: '400px' }}>
      {/* Map Header */}
      <div className="absolute top-4 left-4 z-10 glass-panel rounded-xl px-4 py-2 flex items-center gap-3">
        <Navigation className="h-4 w-4 text-emerald-400" />
        <span className="text-xs font-bold text-slate-200">Live Tracking Map</span>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 glass-panel rounded-xl px-3 py-2 space-y-1.5">
        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Donors
        </div>
        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Receivers
        </div>
        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Volunteers
        </div>
      </div>

      {/* SVG Map */}
      <svg viewBox="0 0 100 100" className="w-full h-full" style={{ minHeight: '400px', background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #0b132b 100%)' }}>
        {/* Grid Lines */}
        {[...Array(11)].map((_, i) => (
          <React.Fragment key={i}>
            <line x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.15" />
            <line x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="rgba(255,255,255,0.03)" strokeWidth="0.15" />
          </React.Fragment>
        ))}

        {/* Road Network (Simulated) */}
        <path d="M 10,50 Q 30,45 50,50 T 90,48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" strokeDasharray="2,1" />
        <path d="M 50,10 Q 48,30 50,50 T 52,90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" strokeDasharray="2,1" />
        <path d="M 20,20 Q 40,35 60,30 T 85,70" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="1.5,1" />

        {/* Route Line (if selected) */}
        {selectedRoute && selectedRoute.from && selectedRoute.to && (
          <line
            x1={lngToX(selectedRoute.from.lng)}
            y1={latToY(selectedRoute.from.lat)}
            x2={lngToX(selectedRoute.to.lng)}
            y2={latToY(selectedRoute.to.lat)}
            stroke="#10b981"
            strokeWidth="0.4"
            strokeDasharray="1.5,0.8"
            opacity="0.8"
          >
            <animate attributeName="stroke-dashoffset" values="0;4.6" dur="1.5s" repeatCount="indefinite" />
          </line>
        )}

        {/* Pins */}
        {allPins.map((pin, idx) => {
          const pc = pinColors[pin.type];
          return (
            <g
              key={idx}
              onMouseEnter={() => setHoveredPin(idx)}
              onMouseLeave={() => setHoveredPin(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Pulse ring */}
              <circle cx={pin.x} cy={pin.y} r="2.5" fill="none" stroke={pc.fill} strokeWidth="0.2" opacity="0.4">
                <animate attributeName="r" values="1.5;3.5" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Pin body */}
              <circle cx={pin.x} cy={pin.y} r="1.5" fill={pc.fill} stroke={pc.stroke} strokeWidth="0.3" />

              {/* Tooltip */}
              {hoveredPin === idx && (
                <g>
                  <rect
                    x={pin.x - 12}
                    y={pin.y - 7}
                    width="24"
                    height="5"
                    rx="1"
                    fill="rgba(11,19,43,0.9)"
                    stroke={pc.fill}
                    strokeWidth="0.2"
                  />
                  <text
                    x={pin.x}
                    y={pin.y - 3.7}
                    textAnchor="middle"
                    fill="white"
                    fontSize="1.8"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {pin.name?.substring(0, 20) || pin.type}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 glass-panel border-t border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            {allPins.length} Active Points
          </span>
        </div>
        <span className="text-[10px] text-slate-500">Interactive SVG Map • Delhi NCR Region</span>
      </div>
    </div>
  );
};

export default InteractiveMap;
