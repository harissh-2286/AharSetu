import React from 'react';
import { Target, Eye, Lightbulb, Heart, Users, Building2, Award, Globe, ShieldCheck, TrendingUp, Utensils } from 'lucide-react';
import StatsCard from '../components/StatsCard';

const About = () => {
  const teamMembers = [
    { name: 'Aditya Sharma', role: 'Founder & CEO', initials: 'AS', color: 'from-emerald-500 to-teal-600' },
    { name: 'Dr. Priya Menon', role: 'Head of Operations', initials: 'PM', color: 'from-sky-500 to-blue-600' },
    { name: 'Vikram Desai', role: 'Technology Lead', initials: 'VD', color: 'from-violet-500 to-purple-600' },
    { name: 'Ananya Iyer', role: 'Community Manager', initials: 'AI', color: 'from-amber-500 to-orange-600' },
    { name: 'Kabir Mehta', role: 'Volunteer Coordinator', initials: 'KM', color: 'from-rose-500 to-pink-600' },
    { name: 'Riya Sen', role: 'Outreach Director', initials: 'RS', color: 'from-teal-500 to-cyan-600' },
  ];

  const partners = [
    'Hope Foundation NGO', 'Nanhi Jaan Welfare', 'Akshaya Patra Foundation',
    'Robin Hood Army', 'Feeding India', 'No Food Waste',
    'Rise Against Hunger', 'Zomato Feeding India', 'Swiggy Foundation',
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-10 right-20 w-72 h-72 bg-emerald-500/8 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">About Us</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 mt-4 mb-6">
            Building a <span className="text-gradient">Hunger-Free</span> Future
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            AharSetu is India's first AI-driven surplus food recovery platform, connecting communities to eliminate food waste and feed every hungry soul.
          </p>
        </div>
      </section>

      {/* Mission / Vision / Objectives */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Target className="h-8 w-8 text-emerald-400" />, title: 'Our Mission', desc: 'To create a seamless bridge between surplus food generators and food-insecure communities using technology, ensuring zero edible food goes to waste.' },
              { icon: <Eye className="h-8 w-8 text-sky-400" />, title: 'Our Vision', desc: 'A world where no person goes hungry while food goes to waste. We envision technology-driven food equity across every city in India by 2030.' },
              { icon: <Lightbulb className="h-8 w-8 text-amber-400" />, title: 'Our Objectives', desc: 'Reduce food waste by 80% in partner cities, onboard 10,000+ food establishments, train 50,000 volunteers, and serve 1 million meals monthly.' },
            ].map((item, i) => (
              <div key={i} className="glass-card group hover:border-emerald-500/20 hover:scale-[1.02]">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 w-fit mb-5 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Our Impact</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-3">Numbers That <span className="text-gradient">Matter</span></h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatsCard icon={<Utensils className="h-6 w-6 text-emerald-400" />} label="Meals Delivered" value={15240} suffix="+" color="emerald" />
            <StatsCard icon={<Users className="h-6 w-6 text-sky-400" />} label="Lives Impacted" value={8500} suffix="+" color="sky" />
            <StatsCard icon={<Building2 className="h-6 w-6 text-amber-400" />} label="Partner NGOs" value={48} color="amber" />
            <StatsCard icon={<TrendingUp className="h-6 w-6 text-violet-400" />} label="Tons Food Saved" value={12} suffix="+" color="violet" />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Leadership</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-3">Meet Our <span className="text-gradient">Team</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <div key={i} className="glass-card text-center group hover:border-emerald-500/20 hover:scale-[1.02]">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-2xl font-extrabold text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {member.initials}
                </div>
                <h3 className="text-base font-bold text-slate-100">{member.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners & NGOs */}
      <section className="py-16 sm:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Ecosystem</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-3">Partners & <span className="text-gradient">NGOs</span></h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {partners.map((partner, i) => (
              <div key={i} className="glass-card text-center py-6 group hover:border-emerald-500/20">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Globe className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="text-sm font-bold text-slate-200">{partner}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
