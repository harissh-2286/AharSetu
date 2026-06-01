import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail, Lock, LogIn, HeartHandshake, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { loginUser } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'donor') navigate('/donor-dashboard');
      else if (user.role === 'volunteer') navigate('/volunteer-dashboard');
      else navigate('/receiver-dashboard');
    } catch (err) { /* handled in context */ }
    setLoading(false);
  };

  const quickLogin = (role) => {
    const creds = {
      admin: { email: 'admin@aharsetu.org', pass: 'password123' },
      donor: { email: 'donor@taj.com', pass: 'password123' },
      receiver: { email: 'receiver@hope.org', pass: 'password123' },
      volunteer: { email: 'volunteer@gmail.com', pass: 'password123' },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].pass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/25 to-teal-500/25 border border-emerald-500/30">
              <HeartHandshake className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">Welcome Back</h1>
          <p className="text-sm text-slate-400 mt-2">Sign in to your AharSetu account</p>
        </div>

        <div className="glass-panel-glow rounded-2xl p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-emerald-400" /> Email Address
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="glass-input w-full" required />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-emerald-400" /> Password
              </label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="glass-input w-full pr-12" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500" />
                Remember me
              </label>
              <a href="#" className="text-emerald-400 hover:text-emerald-300 font-semibold">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? <span className="animate-pulse">Signing in...</span> : <><LogIn className="h-5 w-5" /> Sign In</>}
            </button>
          </form>

          <div className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-bold">Register here</Link>
          </div>

          {/* Quick Login Buttons */}
          <div className="pt-4 border-t border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: 'admin', label: 'Admin', color: 'bg-violet-500/10 border-violet-500/20 text-violet-400 hover:bg-violet-500/20' },
                { role: 'donor', label: 'Donor', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' },
                { role: 'receiver', label: 'Receiver', color: 'bg-sky-500/10 border-sky-500/20 text-sky-400 hover:bg-sky-500/20' },
                { role: 'volunteer', label: 'Volunteer', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20' },
              ].map(item => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => quickLogin(item.role)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${item.color}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
