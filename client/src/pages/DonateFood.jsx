import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Upload, MapPin, Clock, Utensils, FileText, Send, Image as ImageIcon } from 'lucide-react';

const DonateFood = () => {
  const { user, addDonation, triggerAlert } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    foodName: '', foodType: 'Veg', quantity: '', prepTime: '', expiryTime: '',
    pickupAddress: '', additionalNotes: '', imageUrl: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm({ ...form, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { triggerAlert('error', 'Please log in as a donor to submit donations.'); navigate('/login'); return; }
    if (!form.foodName || !form.quantity || !form.prepTime || !form.expiryTime || !form.pickupAddress) {
      triggerAlert('error', 'Please fill in all required fields.'); return;
    }
    setSubmitting(true);
    try {
      await addDonation({
        ...form,
        coordinates: user.coordinates || { lat: 28.6139, lng: 77.2090 }
      });
      navigate(user.role === 'donor' ? '/donor-dashboard' : '/');
    } catch (err) { /* handled in context */ }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Share Your Surplus</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-3">
            Donate <span className="text-gradient">Food</span>
          </h1>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto text-sm">
            Fill in details about the surplus food you'd like to donate. Our volunteers will handle the pickup.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel-glow rounded-2xl p-6 sm:p-10 space-y-6">
          {/* Donor Info */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 block">Donor Name</label>
              <input value={user?.name || ''} disabled className="glass-input w-full opacity-60 cursor-not-allowed" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 block">Contact Number</label>
              <input value={user?.phone || ''} disabled className="glass-input w-full opacity-60 cursor-not-allowed" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 block">Email</label>
            <input value={user?.email || ''} disabled className="glass-input w-full opacity-60 cursor-not-allowed" />
          </div>

          <hr className="border-white/5" />

          {/* Food Details */}
          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
              <Utensils className="h-3.5 w-3.5 text-emerald-400" /> Food Title *
            </label>
            <input name="foodName" value={form.foodName} onChange={handleChange} placeholder="e.g. Premium Basmati Rice & Mixed Dal" className="glass-input w-full" required />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 block">Food Type *</label>
              <select name="foodType" value={form.foodType} onChange={handleChange} className="glass-input w-full">
                <option value="Veg">🥬 Vegetarian</option>
                <option value="Non-Veg">🍗 Non-Vegetarian</option>
                <option value="Vegan">🌱 Vegan</option>
                <option value="Dry Ration">📦 Dry Ration / Packaged</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 block">Quantity *</label>
              <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="e.g. 50 Meals or 20 kg" className="glass-input w-full" required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-emerald-400" /> Preparation Time *
              </label>
              <input name="prepTime" type="datetime-local" value={form.prepTime} onChange={handleChange} className="glass-input w-full" required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-rose-400" /> Expiry Time *
              </label>
              <input name="expiryTime" type="datetime-local" value={form.expiryTime} onChange={handleChange} className="glass-input w-full" required />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" /> Pickup Address *
            </label>
            <input name="pickupAddress" value={form.pickupAddress} onChange={handleChange} placeholder="Full street address for volunteer pickup" className="glass-input w-full" required />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
              <ImageIcon className="h-3.5 w-3.5 text-emerald-400" /> Upload Food Image
            </label>
            <div className="relative">
              <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="food-image-upload" />
              <label
                htmlFor="food-image-upload"
                className="glass-input w-full flex items-center justify-center gap-3 cursor-pointer py-8 border-dashed hover:border-emerald-500/40"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-xl" />
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-slate-500" />
                    <span className="text-sm text-slate-400">Click to upload food photo</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-emerald-400" /> Additional Notes
            </label>
            <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange} rows="3" placeholder="Storage instructions, allergen info, packaging details..." className="glass-input w-full resize-none" />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-base">
            {submitting ? (
              <span className="animate-pulse">Submitting Donation...</span>
            ) : (
              <><Send className="h-5 w-5" /> Submit Donation</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonateFood;
