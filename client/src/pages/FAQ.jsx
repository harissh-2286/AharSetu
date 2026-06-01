import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, Heart, Shield, Users, MessageCircle } from 'lucide-react';

const FAQ = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { label: 'All Questions', value: 'all', icon: <HelpCircle className="h-4 w-4" /> },
    { label: 'For Donors', value: 'donors', icon: <Heart className="h-4 w-4 text-rose-400" /> },
    { label: 'For Receivers', value: 'receivers', icon: <Users className="h-4 w-4 text-sky-400" /> },
    { label: 'For Volunteers', value: 'volunteers', icon: <Shield className="h-4 w-4 text-emerald-400" /> },
    { label: 'Food Safety', value: 'safety', icon: <MessageCircle className="h-4 w-4 text-amber-400" /> }
  ];

  const faqs = [
    {
      q: 'How does AharSetu coordinate food distribution?',
      a: 'AharSetu acts as a digital matching platform. Donors list excess food, which triggers alerts for nearby registered NGOs (receivers). Once claimed, nearby registered volunteers accept the task and receive map navigation from donor to receiver.',
      category: 'general'
    },
    {
      q: 'Who can register as a food donor?',
      a: 'Any corporate business, hotel, bakery, restaurant, banquet hall, event organizer, or individual with surplus food can list food. The listing form accommodates vegetable, non-vegetable, vegan, or dry ration categories.',
      category: 'donors'
    },
    {
      q: 'Is there a minimum quantity threshold for listing?',
      a: 'To keep logistics efficient for volunteers, we suggest a minimum donation size of 10 meals (or 4-5 kg of dry rations). For smaller donations, we recommend dropping them off directly at nearby collection bins shown on our live maps.',
      category: 'donors'
    },
    {
      q: 'What quality guarantees are required for listings?',
      a: 'Donors must specify prep time, expiry window, storage guidelines, and any allergenic ingredients. Freshly cooked food must be packed within 2 hours of cooking, and standard insulated delivery containers are highly recommended.',
      category: 'safety'
    },
    {
      q: 'How do NGOs and shelters register to receive food?',
      a: 'NGOs must create a "Receiver" account. During registration, you must provide government registration numbers and details of average beneficiary sizes. Our admins audit and verify accounts within 24 hours to prevent fraud.',
      category: 'receivers'
    },
    {
      q: 'How are emergency food requirements posted?',
      a: 'Receivers can access their private dashboard to list urgent food requirements (e.g. for sudden climate displace, severe dry spells). These are broadcasted as High/Critical emergency requests to nearby donors and volunteers.',
      category: 'receivers'
    },
    {
      q: 'Are volunteers reimbursed for fuel expenses?',
      a: 'AharSetu currently runs as a philanthropic volunteer drive. We are negotiating CSR fuel sponsorship card support for active volunteers who log more than 15 successful deliveries a month.',
      category: 'volunteers'
    },
    {
      q: 'What should a volunteer do if a donor is unreachable?',
      a: 'Volunteers can access donor contact numbers on their delivery details. If a donor remains unreachable for more than 15 minutes, you can tap the "Cancel Pickup" button, resetting the listing status in our network.',
      category: 'volunteers'
    },
    {
      q: 'What types of food are strictly prohibited on AharSetu?',
      a: 'We strictly prohibit leftover food that has been partially consumed by customers, food stored beyond safe refrigeration windows, food showing visible decay, or unpackaged wet foods lacking safe sealed containers.',
      category: 'safety'
    }
  ];

  // Filtering logic
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || 
      faq.category === selectedCategory || 
      (selectedCategory === 'general' && faq.category === 'general');
    
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-16 sm:py-24 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Support Center</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Have questions about operations, safety rules, or dashboard features? Find instant answers below.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="relative mb-10 max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, keywords, or topics..."
            className="w-full glass-input pl-12 pr-6 py-3.5 text-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-300 border ${
                selectedCategory === cat.value
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-sm'
                  : 'glass-panel text-slate-400 border-transparent hover:text-emerald-400 hover:border-white/5'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, i) => (
              <div
                key={i}
                className="glass-card cursor-pointer border hover:border-emerald-500/20 transition-all duration-300"
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm sm:text-base font-bold text-slate-100">{faq.q}</h3>
                  <div className="shrink-0 p-1 rounded-lg bg-white/5 border border-white/5 text-slate-400">
                    {activeFaq === i ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                  </div>
                </div>
                {activeFaq === i && (
                  <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4 animate-alert-in">
                    {faq.a}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="glass-card text-center py-16 space-y-4">
              <HelpCircle className="h-12 w-12 text-slate-600 mx-auto" />
              <p className="text-slate-400 font-semibold">No questions matched your search query.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="btn-secondary text-xs mx-auto"
              >
                Clear Search & Filters
              </button>
            </div>
          )}
        </div>

        {/* Bottom Support Banner */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-xs font-semibold text-slate-500">Still have unanswered questions?</p>
          <p className="text-sm text-slate-300">
            Our technical support team is online 24/7 to resolve operations queries.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 text-emerald-400 hover:text-emerald-300 transition-all duration-300 text-xs font-bold"
          >
            Reach Out to Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
