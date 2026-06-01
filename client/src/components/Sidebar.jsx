import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, Users, Bell, Settings, LogOut, ShieldCheck, BarChart3, MessageSquare, Image, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar = ({ role = 'admin' }) => {
  const location = useLocation();
  const { logoutUser, notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const adminLinks = [
    { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/admin' },
    { label: 'Users', icon: <Users className="h-5 w-5" />, path: '/admin?tab=users' },
    { label: 'Donations', icon: <Package className="h-5 w-5" />, path: '/admin?tab=donations' },
    { label: 'Requests', icon: <ClipboardList className="h-5 w-5" />, path: '/admin?tab=requests' },
    { label: 'Verification', icon: <ShieldCheck className="h-5 w-5" />, path: '/admin?tab=verify' },
    { label: 'Analytics', icon: <BarChart3 className="h-5 w-5" />, path: '/admin?tab=analytics' },
    { label: 'Feedback', icon: <MessageSquare className="h-5 w-5" />, path: '/admin?tab=feedback' },
    { label: 'Gallery', icon: <Image className="h-5 w-5" />, path: '/admin?tab=gallery' },
    { label: 'FAQs', icon: <HelpCircle className="h-5 w-5" />, path: '/admin?tab=faq' },
  ];

  const donorLinks = [
    { label: 'Overview', icon: <LayoutDashboard className="h-5 w-5" />, path: '/donor-dashboard' },
    { label: 'My Donations', icon: <Package className="h-5 w-5" />, path: '/donor-dashboard?tab=donations' },
    { label: 'Notifications', icon: <Bell className="h-5 w-5" />, path: '/donor-dashboard?tab=notifications', badge: unreadCount },
  ];

  const receiverLinks = [
    { label: 'Overview', icon: <LayoutDashboard className="h-5 w-5" />, path: '/receiver-dashboard' },
    { label: 'My Requests', icon: <ClipboardList className="h-5 w-5" />, path: '/receiver-dashboard?tab=requests' },
    { label: 'Claimed Food', icon: <Package className="h-5 w-5" />, path: '/receiver-dashboard?tab=claimed' },
    { label: 'Notifications', icon: <Bell className="h-5 w-5" />, path: '/receiver-dashboard?tab=notifications', badge: unreadCount },
  ];

  const volunteerLinks = [
    { label: 'Overview', icon: <LayoutDashboard className="h-5 w-5" />, path: '/volunteer-dashboard' },
    { label: 'My Deliveries', icon: <Package className="h-5 w-5" />, path: '/volunteer-dashboard?tab=deliveries' },
    { label: 'Notifications', icon: <Bell className="h-5 w-5" />, path: '/volunteer-dashboard?tab=notifications', badge: unreadCount },
  ];

  const links = role === 'admin' 
    ? adminLinks 
    : role === 'donor' 
    ? donorLinks 
    : role === 'volunteer' 
    ? volunteerLinks 
    : receiverLinks;

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col glass-panel border-r border-white/5 min-h-[calc(100vh-80px)]">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          {role === 'admin' 
            ? 'Admin Console' 
            : role === 'donor' 
            ? 'Donor Panel' 
            : role === 'volunteer' 
            ? 'Volunteer Panel' 
            : 'Receiver Panel'}
        </h3>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname + location.search === link.path || 
            (link.path === location.pathname && !location.search && !link.path.includes('?'));
          return (
            <Link
              key={link.label}
              to={link.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                {link.icon}
                {link.label}
              </div>
              {link.badge > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <button
          onClick={logoutUser}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-300"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
