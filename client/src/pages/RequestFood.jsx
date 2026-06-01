import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Users, Phone, ClipboardList, MapPin, AlertTriangle, Send } from 'lucide-react';

const RequestFood = () => {
  const { user, addRequest, triggerAlert } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    organizationName: '', contactPerson: '', phone: '', foodRequirement: '',
    quantityNeeded: '', beneficiaries: '', deliveryAddress: '', emergencyLevel: 'Medium'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { triggerAlert('error', 'Please log in as a receiver to submit requests.'); navigate('/login'); return; }
    if (!form.contactPerson || !form.foodRequirement || !form.quantityNeeded || !form.beneficiaries || !form.deliveryAddress) {
      triggerAlert('error', 'Please fill all required fields.'); return;
    }
    setSubmitting(true);
    try {
      await addRequest({
        ...form,
        organizationName: form.organizationName || user.name,
        coordinates: user.coordinates || { lat: 28.6139, lng: 77.2090 }
      });
      navigate(user.role === 'receiver' ? '/receiver-dashboard' : '/');
    } catch (err) { /* handled in context */ }
    setSubmitting(false);
  };

  const emergencyColors = {
    Low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    High: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    Critical: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Need Food?</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-3">
            Request <span className="text-gradient">Food</span>
          </h1>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto text-sm">
            Submit your food requirement and we'll match you with nearby donors and volunteers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel-glow rounded-2xl p-6 sm:p-10 space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 block">Organization Name</label>
            <input name="organizationName" value={form.organizationName} onChange={handleChange} placeholder="e.g. Hope Foundation NGO" className="glass-input w-full" />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-emerald-400" /> Contact Person *
              </label>
              <input name="contactPerson" value={form.contactPerson} onChange={handleChange} placeholder="Full name" className="glass-input w-full" required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-400" /> Phone Number *
              </label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className="glass-input w-full" required />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
              <ClipboardList className="h-3.5 w-3.5 text-emerald-400" /> Food Requirement *
            </label>
            <textarea name="foodRequirement" value={form.foodRequirement} onChange={handleChange} rows="3" placeholder="Describe the type of food needed (e.g. Cooked Rice & Dal, Bread, Milk, Packaged Snacks...)" className="glass-input w-full resize-none" required />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 block">Quantity Needed *</label>
              <input name="quantityNeeded" value={form.quantityNeeded} onChange={handleChange} placeholder="e.g. 100 Meals, 50 kg" className="glass-input w-full" required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 block">Number of Beneficiaries *</label>
              <input name="beneficiaries" type="number" min="1" value={form.beneficiaries} onChange={handleChange} placeholder="e.g. 120" className="glass-input w-full" required />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" /> Delivery Address *
            </label>
            <input name="deliveryAddress" value={form.deliveryAddress} onChange={handleChange} placeholder="Full delivery address" className="glass-input w-full" required />
          </div>

          {/* Emergency Level Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> Emergency Level *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Low', 'Medium', 'High', 'Critical'].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setForm({ ...form, emergencyLevel: level })}
                  className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all duration-300 ${
                    form.emergencyLevel === level
                      ? emergencyColors[level]
                      : 'bg-white/3 border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-accent w-full py-4 text-base">
            {submitting ? (
              <span className="animate-pulse">Submitting Request...</span>
            ) : (
              <><Send className="h-5 w-5" /> Submit Food Request</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestFood;
