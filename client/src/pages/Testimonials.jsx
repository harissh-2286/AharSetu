import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, MessageSquare, Quote, ThumbsUp, Send } from 'lucide-react';

const Testimonials = () => {
  const { feedback, submitReview } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
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
        message,
        rating,
        isTestimonial: true
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      setRating(5);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const testimonialList = feedback.filter(f => f.isTestimonial);

  return (
    <div className="min-h-screen py-16 sm:py-24 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Community Reviews</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Partner <span className="text-gradient">Testimonials</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
            Read inspiring stories and reviews from verified hotel donors, receiving shelters, non-profit groups, and dedicated volunteers who use AharSetu to make an impact daily.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* Left Column: Form */}
          <div className="glass-panel-glow p-8 rounded-3xl space-y-6">
            <div className="space-y-2">
              <div className="p-2 w-fit bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">Write a Review</h2>
              <p className="text-xs text-slate-400">Share your experience to help improve AharSetu's food recovery service.</p>
            </div>

            {success ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium animate-alert-in">
                Thank you! Your testimonial has been posted successfully and will help guide new community members.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform duration-200 hover:scale-125"
                      >
                        <Star
                          className={`h-7 w-7 ${
                            star <= (hoverRating || rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chef Rajesh Khanna"
                    className="glass-input text-sm py-2.5"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rajesh@taj.com"
                    className="glass-input text-sm py-2.5"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Your Story / Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What difference did AharSetu make for you?"
                    className="glass-input text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full text-sm font-extrabold py-3 mt-2"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? 'Posting...' : 'Submit Testimonial'}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Testimonial Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400">Showing {testimonialList.length} reviews</span>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>Average 4.8 Rating</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {testimonialList.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="glass-card flex flex-col justify-between space-y-6 hover:border-emerald-500/20 hover:scale-[1.01] animate-alert-in"
                >
                  {/* Quote & Stars */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <Quote className="h-8 w-8 text-emerald-500/20" />
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4.5 w-4.5 ${
                              i < item.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed italic">
                      "{item.message}"
                    </p>
                  </div>

                  {/* Profile info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-slate-900 shadow-md">
                      {item.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-100">{item.name}</p>
                      <p className="text-[11px] text-slate-500">Verified User</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
