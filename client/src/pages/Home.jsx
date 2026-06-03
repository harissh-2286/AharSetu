import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatsCard from '../components/StatsCard';
import FoodCard from '../components/FoodCard';
import { Heart, Utensils, Users, TrendingUp, Truck, Search, ShieldCheck, ArrowRight, Star, ChevronDown, ChevronUp, Send, MapPin, Phone, Mail, Sparkles, HandHeart, Building2, Clock } from 'lucide-react';

const Home = () => {
  const { donations, requests, feedback, claimFood, user } = useApp();
  const [activeFaq, setActiveFaq] = useState(null);
  const availableDonations = donations.filter(d => d.status === 'available');

  // Compute real stats from actual data
  const totalMealsShared = donations
    .filter(d => d.status === 'delivered' || d.status === 'claimed' || d.status === 'picked_up')
    .reduce((acc, d) => acc + (parseInt(d.quantity) || 0), 0);

  // Unique donors + receivers + volunteers from donations data
  const uniqueDonorIds = new Set(donations.map(d => d.donorId).filter(Boolean));
  const uniqueReceiverIds = new Set(donations.map(d => d.claimedByReceiverId).filter(Boolean));
  const uniqueVolunteerIds = new Set(donations.map(d => d.assignedVolunteerId).filter(Boolean));
  const activeUsersCount = uniqueDonorIds.size + uniqueReceiverIds.size + uniqueVolunteerIds.size || donations.length;

  // NGO partners: unique receiver orgs from requests
  const ngoPartnersCount = new Set(requests.map(r => r.receiverId || r.organizationName).filter(Boolean)).size || requests.length;

  // Food saved in kg: estimate 0.4 kg per meal
  const foodSavedKg = Math.round(totalMealsShared * 0.4);

  // Show real numbers if data is loaded, otherwise fall back to sensible defaults
  const statMeals = totalMealsShared > 0 ? totalMealsShared : 0;
  const statUsers = activeUsersCount > 0 ? activeUsersCount : 0;
  const statNGOs = ngoPartnersCount > 0 ? ngoPartnersCount : 0;
  const statKg = foodSavedKg > 0 ? foodSavedKg : 0;

  const faqs = [
    { q: 'How does AharSetu work?', a: 'AharSetu connects food donors (restaurants, hotels, individuals) with receivers (shelters, NGOs) through a volunteer logistics network. Donors post surplus food, receivers claim it, and verified volunteers handle the pickup and delivery.' },
    { q: 'Is the food safe to consume?', a: 'All food listings include preparation time, expiry time, and storage instructions. Our platform enforces strict food safety timelines and only lists food within safe consumption windows.' },
    { q: 'How do I register as a volunteer?', a: 'Click "Join Platform," select the Volunteer role, fill in your details including ID proof and service area. After admin verification, you can start accepting delivery tasks.' },
    { q: 'Is there any cost involved?', a: 'AharSetu is completely free for all users. Donors, receivers, volunteers, and NGOs can all use the platform at zero cost. We are funded through CSR partnerships and grants.' },
    { q: 'How quickly is food picked up?', a: 'Our average pickup time is under 45 minutes within city limits. Critical emergency requests are prioritized and typically fulfilled within 30 minutes.' },
    { q: 'Can I donate dry rations or packaged food?', a: 'Yes! We accept cooked food, dry rations, canned goods, packaged snacks, beverages, and more. Simply select the appropriate food type when creating your listing.' },
  ];

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/8 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider animate-pulse-glow">
                <Sparkles className="h-3.5 w-3.5" />
                AI-POWERED FOOD RECOVERY PLATFORM
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Good Food Deserves{' '}
                <span className="text-gradient">a Second Chance</span>
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
                AharSetu bridges the gap between surplus food and hungry communities. Our smart logistics network ensures every meal finds someone who needs it — before it goes to waste.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={user?.role === 'donor' ? '/donate' : '/register'} className="btn-primary text-base px-8 py-4">
                  <Heart className="h-5 w-5" />
                  Donate Food
                </Link>
                <Link to={user?.role === 'receiver' ? '/request' : '/register'} className="btn-secondary text-base px-8 py-4">
                  <HandHeart className="h-5 w-5" />
                  Request Food
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {['bg-emerald-500', 'bg-teal-500', 'bg-sky-500', 'bg-violet-500'].map((bg, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full ${bg} border-2 border-darkblue-950 flex items-center justify-center text-[10px] font-bold text-white`}>
                      {['TJ', 'HF', 'NJ', 'KM'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">2,500+ Active Members</p>
                  <p className="text-xs text-slate-500">across Delhi NCR region</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden lg:block relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/10 backdrop-blur-md" />
                <div className="absolute inset-4 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop"
                    alt="Food Donation Drive"
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-darkblue-950/80 to-transparent" />
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 glass-panel rounded-xl px-4 py-3 animate-float">
                  <div className="flex items-center gap-2">
                    <div className="glow-dot"><span className="glow-dot-ring" /><span className="glow-dot-center" /></div>
                    <span className="text-xs font-bold text-emerald-400">Live: 12 Donations Active</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 glass-panel rounded-xl px-4 py-3 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-200">3 Volunteers En Route</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATISTICS ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatsCard icon={<Utensils className="h-6 w-6 text-emerald-400" />} label="Meals Shared" value={statMeals} suffix="+" color="emerald" />
            <StatsCard icon={<Users className="h-6 w-6 text-sky-400" />} label="Active Users" value={statUsers} suffix="+" color="sky" />
            <StatsCard icon={<Building2 className="h-6 w-6 text-amber-400" />} label="NGO Partners" value={statNGOs} color="amber" />
            <StatsCard icon={<TrendingUp className="h-6 w-6 text-violet-400" />} label="Food Saved (kg)" value={statKg} suffix="+" color="violet" />
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Platform Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-3">Why Choose <span className="text-gradient">AharSetu</span>?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Clock className="h-7 w-7 text-emerald-400" />, title: 'Real-Time Matching', desc: 'AI instantly connects surplus food with nearby receivers, minimizing waste and response time.' },
              { icon: <Truck className="h-7 w-7 text-sky-400" />, title: 'Volunteer Logistics', desc: 'Verified volunteers are auto-assigned for pickup and delivery with GPS-tracked routes.' },
              { icon: <ShieldCheck className="h-7 w-7 text-amber-400" />, title: 'Food Safety Verified', desc: 'Every listing shows prep time, expiry, and storage conditions. Expired items auto-delist.' },
              { icon: <Search className="h-7 w-7 text-rose-400" />, title: 'Smart Search & Filters', desc: 'Find food by type, distance, quantity, or urgency level with powerful search filters.' },
              { icon: <MapPin className="h-7 w-7 text-violet-400" />, title: 'Live Map Tracking', desc: 'Interactive map visualization shows donor locations, receiver pins, and volunteer routes.' },
              { icon: <Users className="h-7 w-7 text-teal-400" />, title: 'NGO Dashboard', desc: 'Dedicated dashboards for NGOs to manage beneficiary needs, request food, and track impact.' },
            ].map((f, i) => (
              <div key={i} className="glass-card group hover:border-emerald-500/30 hover:scale-[1.02]">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 sm:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-3">How It <span className="text-gradient">Works</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'List Surplus Food', desc: 'Donor posts available food with details, photos, and pickup location.', color: 'emerald' },
              { step: '02', title: 'Match & Claim', desc: 'AI matches food with nearby NGOs/receivers who can claim instantly.', color: 'sky' },
              { step: '03', title: 'Volunteer Pickup', desc: 'Assigned volunteer picks up the food using optimized route navigation.', color: 'amber' },
              { step: '04', title: 'Deliver & Impact', desc: 'Food reaches beneficiaries. Impact metrics logged and shared.', color: 'violet' },
            ].map((s, i) => (
              <div key={i} className="glass-card text-center group hover:scale-[1.03]">
                <div className={`text-5xl font-black text-${s.color}-500/20 group-hover:text-${s.color}-500/40 transition-colors mb-4`}>
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.desc}</p>
                {i < 3 && (
                  <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LIVE FOOD AVAILABILITY ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Live Feed</span>
              <h2 className="text-3xl font-extrabold text-slate-100 mt-2">Available <span className="text-gradient">Donations</span></h2>
            </div>
            <Link to="/live-listings" className="btn-secondary text-sm">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {availableDonations.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableDonations.slice(0, 3).map(d => (
                <FoodCard key={d.id} donation={d} showClaim={!!user && user.role === 'receiver'} onClaim={claimFood} />
              ))}
            </div>
          ) : (
            <div className="glass-card text-center py-16">
              <Utensils className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No active donations at the moment. Be the first to list!</p>
              <Link to="/donate" className="btn-primary mt-6 mx-auto w-fit">
                <Heart className="h-4 w-4" /> Post a Donation
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 sm:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Community Voices</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-3">What People <span className="text-gradient">Say</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedback.filter(f => f.isTestimonial).slice(0, 3).map((review, idx) => (
              <div key={review.id || idx} className="glass-card group hover:border-emerald-500/20">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-5 italic">"{review.message}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white">
                    {review.name?.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-100">{review.name}</p>
                    <p className="text-xs text-slate-500">{review.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUCCESS STORIES ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Impact Reports</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-3">Success <span className="text-gradient">Stories</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'Taj Palace Saves 500+ Meals Weekly', desc: 'By partnering with AharSetu, Taj Palace Hotel now redirects all surplus buffet food to 3 nearby shelters instead of disposal. Over 26,000 meals saved in the first year.', stat: '26,000 meals', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop' },
              { title: 'Hope Foundation: Zero Hunger Days', desc: 'Hope Foundation NGO reported achieving zero hunger days for their 150 shelter residents after joining the AharSetu platform, with consistent daily food deliveries.', stat: '0 hunger days', img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop' },
            ].map((story, i) => (
              <div key={i} className="glass-card p-0 overflow-hidden group">
                <div className="h-48 overflow-hidden relative">
                  <img src={story.img} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                      {story.stat}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-100 mb-2">{story.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{story.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALLERY PREVIEW ===== */}
      <section className="py-16 sm:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Visuals</span>
              <h2 className="text-3xl font-extrabold text-slate-100 mt-2">Impact <span className="text-gradient">Gallery</span></h2>
            </div>
            <Link to="/gallery" className="btn-secondary text-sm">
              Full Gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=400&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=400&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=400&auto=format&fit=crop',
            ].map((src, i) => (
              <div key={i} className="group relative h-40 sm:h-52 rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all duration-500">
                <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Support</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-3">Frequently Asked <span className="text-gradient">Questions</span></h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card cursor-pointer" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-slate-100">{faq.q}</h3>
                  {activeFaq === i ? <ChevronUp className="h-5 w-5 text-emerald-400 shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-500 shrink-0" />}
                </div>
                {activeFaq === i && (
                  <p className="mt-4 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT CTA ===== */}
      <section className="py-16 sm:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-panel-glow rounded-3xl p-10 sm:p-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mb-4">
              Ready to Make a <span className="text-gradient">Difference</span>?
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Whether you have surplus food to share or beneficiaries who need meals, join AharSetu today and become part of the solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-base px-8 py-4">
                <Heart className="h-5 w-5" />
                Join AharSetu Today
              </Link>
              <Link to="/contact" className="btn-secondary text-base px-8 py-4">
                <Send className="h-5 w-5" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
