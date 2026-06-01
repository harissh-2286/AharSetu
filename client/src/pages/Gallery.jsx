import React, { useState } from 'react';
import { Image, Heart, Shield, Users, Calendar, Award } from 'lucide-react';

const Gallery = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const galleryItems = [
    {
      id: 1,
      title: 'Taj Hotel Mega Donation Drive',
      description: 'Over 200 high-quality gourmet buffet surplus meals distributed to hope shelters.',
      category: 'donations',
      imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop',
      date: 'May 28, 2026',
      location: 'Connaught Place, New Delhi'
    },
    {
      id: 2,
      title: 'Nanhi Jaan Daily Milk Feed',
      description: 'Daily fresh milk and baked bread distribution drive for under-privileged kids.',
      category: 'drives',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
      date: 'May 29, 2026',
      location: 'Lajpat Nagar, New Delhi'
    },
    {
      id: 3,
      title: 'Volunteer Onboarding & Briefing Session',
      description: 'Training community volunteers on hygiene standards, temperature controls, and route navigation.',
      category: 'volunteers',
      imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&auto=format&fit=crop',
      date: 'May 15, 2026',
      location: 'AharSetu Central HQ, Delhi'
    },
    {
      id: 4,
      title: 'Community Green Kitchen Project',
      description: 'Volunteers preparing organic packed soups from slightly bruised but fresh recovery vegetables.',
      category: 'events',
      imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop',
      date: 'May 20, 2026',
      location: 'Okhla Industrial Area, Delhi'
    },
    {
      id: 5,
      title: 'Organic Gourmet Bistro Surplus Claim',
      description: 'Verified volunteers loading biodegradable containers containing fresh pasta salads.',
      category: 'volunteers',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
      date: 'May 26, 2026',
      location: 'Khan Market, New Delhi'
    },
    {
      id: 6,
      title: 'Hope NGO Night Shelters Buffet',
      description: 'Surplus food from corporate gala recovery serving hot dinner to 100+ homeless elders.',
      category: 'drives',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
      date: 'May 27, 2026',
      location: 'Kingsway Camp, Delhi'
    },
    {
      id: 7,
      title: 'CSR Social Impact Award Ceremony',
      description: 'AharSetu receiving Delhi CSR Impact award for saving 8,500+ kg food in New Delhi region.',
      category: 'events',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
      date: 'April 30, 2026',
      location: 'Vigyan Bhawan, New Delhi'
    },
    {
      id: 8,
      title: 'Weekly Mega Ration Recovery Drive',
      description: 'Corporate partners donating 500kg of unexpired premium Basmati rice and flour packets.',
      category: 'donations',
      imageUrl: 'https://images.unsplash.com/photo-1488459718432-01055e67e44d?q=80&w=800&auto=format&fit=crop',
      date: 'May 10, 2026',
      location: 'Noida Sector 62'
    }
  ];

  const filteredItems = selectedFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedFilter);

  const filters = [
    { label: 'All Activities', value: 'all', icon: <Image className="h-4 w-4" /> },
    { label: 'Food Donations', value: 'donations', icon: <Heart className="h-4 w-4 text-rose-400" /> },
    { label: 'NGO Food Drives', value: 'drives', icon: <Users className="h-4 w-4 text-sky-400" /> },
    { label: 'Volunteers in Action', value: 'volunteers', icon: <Shield className="h-4 w-4 text-emerald-400" /> },
    { label: 'Platform Events', value: 'events', icon: <Calendar className="h-4 w-4 text-amber-400" /> }
  ];

  return (
    <div className="min-h-screen py-16 sm:py-24 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Impact in Action</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Our <span className="text-gradient">Gallery</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
            Explore pictures of our community distributions, active volunteers, emergency donation drops, and major milestones in our fight against hunger and food waste.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                selectedFilter === filter.value
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 shadow-lg shadow-emerald-500/25 scale-[1.03]'
                  : 'glass-panel text-slate-300 hover:text-emerald-400 hover:border-emerald-500/20'
              }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-card p-0 overflow-hidden group hover:border-emerald-500/20 hover:scale-[1.02] flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="h-56 overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-darkblue-950 via-darkblue-950/20 to-transparent opacity-60" />
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              {/* Details */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 pt-3 border-t border-white/5 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-600" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-slate-600" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Standalone Statistics Bar */}
        <div className="mt-20 glass-panel rounded-3xl p-8 sm:p-12 text-center max-w-5xl mx-auto border border-emerald-500/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-3xl font-extrabold text-gradient">240+</p>
              <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Drives Conducted</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gradient-blue">54,000</p>
              <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Photos Logged</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gradient">180+</p>
              <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Volunteers Mapped</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gradient-blue">15+</p>
              <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Awards & Grants</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
