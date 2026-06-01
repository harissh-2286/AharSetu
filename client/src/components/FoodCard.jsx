import React from 'react';
import { MapPin, Clock, Users, ChevronRight, Leaf, Drumstick } from 'lucide-react';

const FoodCard = ({ donation, onClaim, showClaim = false }) => {
  const statusColors = {
    available: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Available' },
    claimed: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Claimed' },
    picked_up: { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30', label: 'In Transit' },
    delivered: { bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/30', label: 'Delivered' },
  };

  const foodTypeIcons = {
    'Veg': <Leaf className="h-3.5 w-3.5 text-emerald-400" />,
    'Vegan': <Leaf className="h-3.5 w-3.5 text-lime-400" />,
    'Non-Veg': <Drumstick className="h-3.5 w-3.5 text-rose-400" />,
    'Dry Ration': <Users className="h-3.5 w-3.5 text-amber-400" />,
  };

  const st = statusColors[donation.status] || statusColors.available;

  const timeLeft = () => {
    const exp = new Date(donation.expiryTime);
    const now = new Date();
    const diff = exp - now;
    if (diff <= 0) return 'Expired';
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return hrs > 0 ? `${hrs}h ${mins}m left` : `${mins}m left`;
  };

  return (
    <div className="glass-card group overflow-hidden hover:border-emerald-500/30 transition-all duration-500">
      {/* Image */}
      <div className="relative h-44 -mx-6 -mt-6 mb-4 overflow-hidden">
        <img
          src={donation.imageUrl || 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=600&auto=format&fit=crop'}
          alt={donation.foodName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold ${st.bg} ${st.text} border ${st.border} backdrop-blur-md`}>
          {st.label}
        </div>

        {/* Food Type Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-slate-200">
          {foodTypeIcons[donation.foodType] || foodTypeIcons['Veg']}
          {donation.foodType}
        </div>

        {/* Expiry Timer */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-bold text-slate-200">
          <Clock className="h-3.5 w-3.5 text-amber-400" />
          {timeLeft()}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-base font-bold text-slate-100 mb-1.5 line-clamp-1 group-hover:text-emerald-400 transition-colors">
        {donation.foodName}
      </h3>
      <p className="text-xs text-slate-400 mb-3 line-clamp-2">
        {donation.additionalNotes || `${donation.quantity} fresh servings ready for immediate pickup.`}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Users className="h-3.5 w-3.5 text-emerald-500/70" />
          <span className="font-medium">{donation.donorName}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <MapPin className="h-3.5 w-3.5 text-emerald-500/70" />
          <span className="truncate">{donation.pickupAddress}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className="text-sm font-extrabold text-emerald-400">{donation.quantity}</span>
        {showClaim && donation.status === 'available' && (
          <button
            onClick={() => onClaim && onClaim(donation.id)}
            className="btn-primary py-1.5 px-4 text-xs font-bold"
          >
            Claim <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
