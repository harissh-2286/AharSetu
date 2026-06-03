import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Menu, X, Bell, LogOut, User as UserIcon, HeartHandshake } from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';

const Navbar = () => {
  const { user, logoutUser, notifications } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutUser();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Live Listings', path: '/live-listings' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/25 to-teal-500/25 border border-emerald-500/30 group-hover:scale-110 transition-all duration-300">
                  <HeartHandshake className="h-6 w-6 text-emerald-400" />
                </div>
                <span className="font-extrabold text-xl sm:text-2xl tracking-wider text-slate-100 font-sans">
                  Ahar<span className="text-emerald-400">Setu</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]'
                      : 'text-slate-300 hover:text-emerald-400 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions (Desktop) */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <>
                  {/* Notifications */}
                  <button
                    onClick={() => setNotifDrawerOpen(true)}
                    className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-emerald-400 transition-all duration-300"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 ring-2 ring-darkblue-950 animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dashboard link */}
                  <Link
                    to={
                      user.role === 'admin'
                        ? '/admin'
                        : user.role === 'donor'
                        ? '/donor-dashboard'
                        : user.role === 'volunteer'
                        ? '/volunteer-dashboard'
                        : '/receiver-dashboard'
                    }
                    className="px-4 py-2 rounded-xl text-sm font-bold bg-white/5 border border-white/10 hover:border-emerald-500/30 text-slate-100 hover:text-emerald-400 flex items-center gap-2 transition-all duration-300"
                  >
                    <UserIcon className="h-4 w-4" />
                    Dashboard ({user.role.toUpperCase()})
                  </Link>

                  {/* Donate/Request CTAs based on roles */}
                  {user.role === 'donor' && (
                    <Link to="/donate" className="btn-primary py-2 px-4 text-sm font-extrabold shadow-sm">
                      Donate Food
                    </Link>
                  )}
                  {user.role === 'receiver' && (
                    <Link to="/request" className="btn-accent py-2 px-4 text-sm font-extrabold shadow-sm">
                      Request Food
                    </Link>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/15 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-all duration-300"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn-primary py-2.5 px-6 text-sm">
                  Join Platform
                </Link>
              )}
            </div>

            {/* Mobile Actions Right Column */}
            <div className="flex items-center gap-3 lg:hidden">
              {user && (
                <button
                  onClick={() => setNotifDrawerOpen(true)}
                  className="relative p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-emerald-400"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-slate-950 animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-emerald-400 focus:outline-none transition-all duration-300"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-panel border-t border-white/5 absolute top-full left-0 w-full backdrop-blur-xl animate-alert-in">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                      : 'text-slate-300 hover:text-emerald-400 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <hr className="border-white/10 my-4" />

              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-400 font-medium">
                    <span>Active Account:</span>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {user.role.toUpperCase()}
                    </span>
                  </div>

                  <Link
                    to={
                      user.role === 'admin'
                        ? '/admin'
                        : user.role === 'donor'
                        ? '/donor-dashboard'
                        : user.role === 'volunteer'
                        ? '/volunteer-dashboard'
                        : '/receiver-dashboard'
                    }
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-base font-bold bg-white/5 border border-white/10 hover:border-emerald-500/30 text-slate-100 hover:text-emerald-400"
                  >
                    <UserIcon className="h-5 w-5" />
                    Dashboard
                  </Link>

                  {user.role === 'donor' && (
                    <Link
                      to="/donate"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-primary w-full text-center py-3"
                    >
                      Donate Food
                    </Link>
                  )}
                  {user.role === 'receiver' && (
                    <Link
                      to="/request"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-accent w-full text-center py-3"
                    >
                      Request Food
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-base font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/25"
                  >
                    <LogOut className="h-5 w-5" />
                    Log Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full text-center py-3"
                >
                  Join AharSetu
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Slide-out notifications Panel */}
      <NotificationDrawer isOpen={notifDrawerOpen} onClose={() => setNotifDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
