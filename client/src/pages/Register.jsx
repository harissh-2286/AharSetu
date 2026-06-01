import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User, Phone, MapPin, HeartHandshake, Upload, Briefcase, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const { registerUser } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState('donor');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', address: '',
    donorType: 'individual', organizationName: '', beneficiariesCount: '',
    experience: '', availability: '', serviceArea: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = {
        name: form.name, email: form.email, password: form.password,
        phone: form.phone, address: form.address, role
      };

      if (role === 'donor') userData.donorDetails = { donorType: form.donorType };
      if (role === 'receiver') userData.receiverDetails = { organizationName: form.organizationName, beneficiariesCount: Number(form.beneficiariesCount) || 0 };
      if (role === 'volunteer') userData.volunteerDetails = {
        experience: form.experience,
        availability: form.availability.split(',').map(s => s.trim()),
        serviceArea: form.serviceArea, isVerified: false
      };

      const user = await registerUser(userData);
      if (user.role === 'donor') navigate('/donor-dashboard');
      else if (user.role === 'receiver') navigate('/receiver-dashboard');
      else if (user.role === 'volunteer') navigate('/volunteer-dashboard');
      else navigate('/');
    } catch (err) { /* handled in context */ }
    setLoading(false);
  };

  const roles = [
    { id: 'donor', label: 'Food Donor', desc: 'Share surplus food', color: 'emerald' },
    { id: 'receiver', label: 'Receiver / NGO', desc: 'Request food for beneficiaries', color: 'sky' },
    { id: 'volunteer', label: 'Volunteer', desc: 'Help with pickup & delivery', color: 'amber' },
  ];

  const roleStyles = {
    donor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    receiver: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    volunteer: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  };
  const roleStylesInactive = 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10';

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/25 to-teal-500/25 border border-emerald-500/30">
              <HeartHandshake className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">Join AharSetu</h1>
          <p className="text-sm text-slate-400 mt-2">Create your account and start making an impact</p>
        </div>

        <div className="glass-panel-glow rounded-2xl p-8 space-y-6">
          {/* Role Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 mb-3 block">Select Your Role</label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`p-3 rounded-xl text-center border transition-all duration-300 ${
                    role === r.id ? roleStyles[r.id] : roleStylesInactive
                  }`}
                >
                  <p className="text-xs font-bold">{r.label}</p>
                  <p className="text-[10px] mt-0.5 opacity-70">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-emerald-400" /> Full Name *
                </label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className="glass-input w-full" required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-emerald-400" /> Phone *
                </label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className="glass-input w-full" required />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-emerald-400" /> Email *
              </label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="glass-input w-full" required />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-emerald-400" /> Password *
              </label>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min 6 characters" className="glass-input w-full pr-12" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" /> Address *
              </label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="Full street address" className="glass-input w-full" required />
            </div>

            {/* Role-Specific Fields */}
            {role === 'donor' && (
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 block">Donor Type</label>
                <select name="donorType" value={form.donorType} onChange={handleChange} className="glass-input w-full">
                  <option value="individual">👤 Individual</option>
                  <option value="restaurant">🍽️ Restaurant</option>
                  <option value="hotel">🏨 Hotel</option>
                  <option value="caterer">🎪 Caterer / Event</option>
                  <option value="other">📋 Other</option>
                </select>
              </div>
            )}

            {role === 'receiver' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-2 block">Organization Name</label>
                  <input name="organizationName" value={form.organizationName} onChange={handleChange} placeholder="NGO / Shelter name" className="glass-input w-full" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-2 block">Beneficiaries Count</label>
                  <input name="beneficiariesCount" type="number" value={form.beneficiariesCount} onChange={handleChange} placeholder="e.g. 150" className="glass-input w-full" />
                </div>
              </div>
            )}

            {role === 'volunteer' && (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-emerald-400" /> Experience
                  </label>
                  <textarea name="experience" value={form.experience} onChange={handleChange} rows="2" placeholder="Brief description of volunteer experience..." className="glass-input w-full resize-none" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-2 block">Availability</label>
                    <input name="availability" value={form.availability} onChange={handleChange} placeholder="e.g. Weekends, Evenings" className="glass-input w-full" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-2 block">Service Area</label>
                    <input name="serviceArea" value={form.serviceArea} onChange={handleChange} placeholder="e.g. South Delhi" className="glass-input w-full" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                    <Upload className="h-3.5 w-3.5 text-emerald-400" /> ID Proof Upload
                  </label>
                  <input type="file" accept="image/*,.pdf" className="glass-input w-full text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400" />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? <span className="animate-pulse">Creating Account...</span> : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
