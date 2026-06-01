import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

const NotificationDrawer = ({ isOpen, onClose }) => {
  const { notifications, markAsRead } = useApp();

  const typeIcons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
    info: <Info className="h-5 w-5 text-sky-400" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
    alert: <AlertOctagon className="h-5 w-5 text-rose-400" />,
  };

  const typeBorderColors = {
    success: 'border-l-emerald-500',
    info: 'border-l-sky-500',
    warning: 'border-l-amber-500',
    alert: 'border-l-rose-500',
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const diff = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md z-50 glass-panel-glow border-l border-white/10 shadow-2xl transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Bell className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Notifications</h2>
              <p className="text-xs text-slate-400">
                {notifications.filter(n => !n.isRead).length} unread alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-slate-100 transition-all duration-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notification List */}
        <div className="overflow-y-auto h-[calc(100%-80px)] p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Bell className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs mt-1">You'll receive alerts when activity occurs</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`relative p-4 rounded-xl border-l-4 cursor-pointer transition-all duration-300 ${
                  typeBorderColors[notif.type] || 'border-l-slate-500'
                } ${
                  notif.isRead
                    ? 'bg-white/3 border border-white/5 opacity-60'
                    : 'glass-card hover:border-emerald-500/30 animate-pulse-glow'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {typeIcons[notif.type] || typeIcons.info}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-100 truncate">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="shrink-0 flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-3">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-2 block font-medium">
                      {formatTime(notif.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDrawer;
