import React, { useState, useEffect } from 'react';

const StatsCard = ({ icon, label, value, suffix = '', color = 'emerald' }) => {
  const [count, setCount] = useState(0);
  const target = typeof value === 'number' ? value : parseInt(value) || 0;

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  const colorMap = {
    emerald: { bg: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
    sky: { bg: 'from-sky-500/20 to-blue-500/20', border: 'border-sky-500/20', text: 'text-sky-400', glow: 'shadow-sky-500/10' },
    amber: { bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/20', text: 'text-amber-400', glow: 'shadow-amber-500/10' },
    rose: { bg: 'from-rose-500/20 to-pink-500/20', border: 'border-rose-500/20', text: 'text-rose-400', glow: 'shadow-rose-500/10' },
    violet: { bg: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/20', text: 'text-violet-400', glow: 'shadow-violet-500/10' },
  };

  const c = colorMap[color] || colorMap.emerald;

  return (
    <div className={`glass-card group hover:scale-[1.03] cursor-default`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${c.bg} border ${c.border} shadow-lg ${c.glow} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            {count.toLocaleString()}{suffix}
          </p>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
