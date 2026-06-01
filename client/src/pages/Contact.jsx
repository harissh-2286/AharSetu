import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Phone, Mail, MapPin, MessageSquare, AlertCircle } from 'lucide-react';

const Contact = () => {
  const { submitReview } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('donor');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    try {
      setSubmitting(true);
      await submitReview({
        name,
        email,
        message: `[Subject: ${subject || 'General Contact'}] [Role: ${role}] [Phone: ${phone}] - ${message}`,
        rating: 5,
        isTestimonial: false
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setPhone('');
      setRole('donor');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const contactDetails = [
    { icon: <Phone className="h-5 w-5 text-emerald-400" />, label: 'Emergency Hotline', value: '+91 98765 43210', sub: 'Toll-free 24/7 helpline' },
    { icon: <Mail className="h-5 w-5 text-sky-400" />, label: 'Support Email', value: 'support@aharsetu.org', sub: 'Response in 2 hours' },
    { icon: <MapPin className="h-5 w-5 text-violet-400" />, label: 'Central HQ Office', value: 'AharSetu Central, CP, Delhi', sub: 'Walk-ins: 9 AM - 6 PM' }
  ];

  return (
    <div className="min-h-screen py-16 sm:py-24 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Get In Touch</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Contact <span className="text-gradient">Our Team</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Have questions about integrations, corporate CSR sponsorships, or need emergency logistics assistance? We are here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-stretch">
          {/* Info cards (Left 2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-between gap-6">
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-3">
                <h3 className="font-bold text-slate-100 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-emerald-400" />
                  Surplus Food Emergency?
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  If you are a commercial hotel or banquet hall with sudden surplus food for more than 100 people, skip the online form and dial our priority hotline immediately.
                </p>
              </div>

              <div className="space-y-4">
                {contactDetails.map((item, idx) => (
                  <div key={idx} className="glass-card flex items-start gap-4 hover:border-emerald-500/20 transition-all duration-300">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-bold text-slate-100 mt-0.5">{item.value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro Map Mock */}
            <div className="glass-panel rounded-3xl h-44 overflow-hidden relative border border-white/5">
              <div className="absolute inset-0 bg-slate-950 opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 p-6 z-10 text-center">
                <MapPin className="h-8 w-8 text-emerald-400 animate-bounce" />
                <p className="text-xs font-bold text-slate-200">AharSetu Central Hub Delhi</p>
                <p className="text-[10px] text-slate-400">Map coordinate: 28.6289° N, 77.2150° E</p>
              </div>
            </div>
          </div>

          {/* Form (Right 3 cols) */}
          <div className="lg:col-span-3 glass-panel-glow p-8 sm:p-10 rounded-3xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-100">Send an Inquiry</h3>
                <p className="text-xs text-slate-400">Fill in the details below, and an operations specialist will email you back.</p>
              </div>

              {success ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium animate-alert-in">
                  Message sent successfully! Our administrative team will reach out to you within the next 2 hours.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Your Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aditya Sen"
                        className="glass-input text-sm py-2.5"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. aditya@gmail.com"
                        className="glass-input text-sm py-2.5"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">Contact Number (Optional)</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="glass-input text-sm py-2.5"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">User Role Profile</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="glass-input text-sm py-2.5 bg-darkblue-900 border-white/10"
                      >
                        <option value="donor">Food Donor (Hotel / Restaurant)</option>
                        <option value="receiver">Receiver NGO / Shelter</option>
                        <option value="volunteer">Dedicated Volunteer</option>
                        <option value="csr">CSR Sponsor Partner</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Inquiry Subject</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Technical integrations, Donation verification"
                      className="glass-input text-sm py-2.5"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Detailed Message</label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please clarify details..."
                      className="glass-input text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full text-sm font-extrabold py-3.5 mt-2"
                  >
                    <Send className="h-4.5 w-4.5" />
                    {submitting ? 'Sending...' : 'Send Inquiry Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
