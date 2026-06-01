import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import FoodCard from '../components/FoodCard';
import InteractiveMap from '../components/InteractiveMap';
import { Search, Filter, MapPin, Utensils } from 'lucide-react';

const LiveFood = () => {
  const { donations, claimFood, user } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('available');
  const [showMap, setShowMap] = useState(false);

  const filtered = donations.filter(d => {
    const matchSearch = d.foodName.toLowerCase().includes(search.toLowerCase()) ||
      d.donorName.toLowerCase().includes(search.toLowerCase()) ||
      d.pickupAddress.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || d.foodType === filterType;
    const matchStatus = filterStatus === 'All' || d.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const donors = donations.filter(d => d.status === 'available').map(d => ({
    name: d.donorName,
    coordinates: d.coordinates
  }));

  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4">
            <span className="glow-dot"><span className="glow-dot-ring" /><span className="glow-dot-center" /></span>
            LIVE FEED
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
            Food <span className="text-gradient">Availability</span>
          </h1>
        </div>

        {/* Search & Filters */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by food name, donor, or location..."
                className="glass-input w-full pl-11"
              />
            </div>
            <div className="flex gap-3">
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="glass-input text-sm">
                <option value="All">All Types</option>
                <option value="Veg">🥬 Veg</option>
                <option value="Non-Veg">🍗 Non-Veg</option>
                <option value="Vegan">🌱 Vegan</option>
                <option value="Dry Ration">📦 Dry Ration</option>
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="glass-input text-sm">
                <option value="available">Available</option>
                <option value="claimed">Claimed</option>
                <option value="All">All Status</option>
              </select>
              <button
                onClick={() => setShowMap(!showMap)}
                className={`btn-secondary py-2 px-4 text-sm ${showMap ? 'border-emerald-500/30 text-emerald-400' : ''}`}
              >
                <MapPin className="h-4 w-4" />
                Map
              </button>
            </div>
          </div>
        </div>

        {/* Map View */}
        {showMap && (
          <div className="mb-8">
            <InteractiveMap donors={donors} />
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-400">
            Showing <span className="text-emerald-400 font-bold">{filtered.length}</span> listings
          </p>
        </div>

        {/* Listings Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(d => (
              <FoodCard
                key={d.id}
                donation={d}
                showClaim={!!user && (user.role === 'receiver' || user.role === 'admin')}
                onClaim={claimFood}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card text-center py-20">
            <Utensils className="h-16 w-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-300">No listings found</h3>
            <p className="text-sm text-slate-500 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveFood;
