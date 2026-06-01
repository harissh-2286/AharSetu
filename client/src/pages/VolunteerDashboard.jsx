import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import InteractiveMap from '../components/InteractiveMap';
import {
  Truck, Package, Clock, MapPin, CheckCircle2, AlertTriangle,
  ShieldCheck, Star, Phone, Building2, Navigation, ArrowRight,
  Bell, UserCheck, Zap
} from 'lucide-react';

const VolunteerDashboard = () => {
  const { user, donations, requests, notifications, markAsRead, updateDeliveryStatus } = useApp();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'overview';

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Filter deliveries assigned to this volunteer
  const myDeliveries = donations.filter(d => d.assignedVolunteerId === user?.id);
  const activeDeliveries = myDeliveries.filter(d => d.status === 'claimed' || d.status === 'picked_up');
  const completedDeliveries = myDeliveries.filter(d => d.status === 'delivered');

  // All available donations not yet claimed (marketplace)
  const availableDonations = donations.filter(d => d.status === 'available');

  // Notifications for this volunteer
  const myNotifications = notifications.filter(n => n.userId === user?.id);
  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  // Compute map pins for the active delivery view
  const getMapPoints = () => {
    const donors = activeDeliveries.map(d => ({
      name: d.donorName,
      coordinates: d.coordinates,
      role: 'donor'
    }));

    const receivers = [];
    activeDeliveries.forEach(d => {
      // Try to find the receiver's coordinates from requests
      const matchingRequest = requests.find(r => r.receiverId === d.claimedByReceiverId);
      if (matchingRequest) {
        receivers.push({
          name: matchingRequest.organizationName || 'NGO Partner',
          coordinates: matchingRequest.coordinates || { lat: 28.65, lng: 77.22 },
          role: 'receiver'
        });
      }
    });

    const volunteers = user?.coordinates ? [{
      name: user.name || 'You',
      coordinates: user.coordinates,
      role: 'volunteer'
    }] : [];

    return { donors, receivers, volunteers };
  };

  const { donors: mapDonors, receivers: mapReceivers, volunteers: mapVolunteers } = getMapPoints();

  const handleViewRoute = (delivery) => {
    setSelectedRoute({
      from: delivery.coordinates,
      to: user?.coordinates || { lat: 28.6139, lng: 77.2090 }
    });
  };

  const handleStatusUpdate = async (donationId, newStatus) => {
    setUpdatingId(donationId);
    try {
      await updateDeliveryStatus(donationId, newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusConfig = {
    claimed: {
      label: 'Awaiting Pickup',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      next: 'picked_up',
      nextLabel: 'Mark as Picked Up',
      nextColor: 'bg-amber-500 text-slate-900 border-amber-500 shadow-amber-500/20'
    },
    picked_up: {
      label: 'In Transit',
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20',
      next: 'delivered',
      nextLabel: 'Mark as Delivered',
      nextColor: 'bg-emerald-500 text-slate-900 border-emerald-500 shadow-emerald-500/20'
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Sidebar Navigation */}
      <Sidebar role="volunteer" />

      {/* Main Panel */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Mobile quick header */}
        <div className="lg:hidden flex flex-wrap items-center justify-between mb-6 gap-3 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-slate-100">{user?.name}</h2>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Volunteer Dashboard</p>
          </div>
          {unreadCount > 0 && (
            <Link to="/volunteer-dashboard?tab=notifications" className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <Bell className="h-3.5 w-3.5" />
              {unreadCount} new
            </Link>
          )}
        </div>

        {/* =================== OVERVIEW TAB =================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-alert-in">
            {/* Welcome Banner */}
            <div className="glass-panel-glow p-8 rounded-3xl space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                      Welcome, <span className="text-gradient">{user?.name}</span>
                    </h1>
                    {user?.volunteerDetails?.isVerified && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">
                    You are powering the AharSetu delivery network. Accept tasks, pick up surplus food, and deliver it to hungry beneficiaries.
                  </p>
                </div>
                <Link to="/volunteer-dashboard?tab=deliveries" className="btn-primary py-3 px-6 hidden sm:flex font-bold shrink-0">
                  <Truck className="h-5 w-5" /> View Active Tasks
                </Link>
              </div>

              {/* Volunteer Details Pill Row */}
              <div className="flex flex-wrap gap-2 pt-2">
                {user?.volunteerDetails?.serviceArea && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[11px] font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                    {user.volunteerDetails.serviceArea}
                  </span>
                )}
                {user?.phone && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[11px] font-semibold">
                    <Phone className="h-3.5 w-3.5 text-emerald-400" />
                    {user.phone}
                  </span>
                )}
                {user?.volunteerDetails?.availability?.map((av, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[11px] font-semibold">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    {av}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Completed Deliveries', value: completedDeliveries.length, desc: 'Total meals ferried', color: 'emerald', icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" /> },
                { label: 'Active Tasks', value: activeDeliveries.length, desc: 'Pending pickup/delivery', color: 'amber', icon: <Truck className="h-5 w-5 text-amber-400" /> },
                { label: 'Meals Delivered', value: completedDeliveries.reduce((acc, d) => acc + (parseInt(d.quantity) || 0), 0), desc: 'Estimated count', color: 'sky', icon: <Package className="h-5 w-5 text-sky-400" /> },
                { label: 'Impact Score', value: `${completedDeliveries.length * 10} pts`, desc: 'Community ranking', color: 'violet', icon: <Star className="h-5 w-5 text-violet-400" /> },
              ].map((m, i) => (
                <div key={i} className="glass-card hover:border-emerald-500/20 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{m.label}</span>
                      <p className="text-2xl sm:text-3xl font-black text-slate-100 mt-2">{m.value}</p>
                      <p className="text-xs text-slate-500 mt-1">{m.desc}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
                      {m.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map + Active Tasks Split */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Interactive Delivery Map */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
                <h3 className="font-bold text-slate-100 flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-emerald-400 animate-pulse" />
                  Live Delivery Route Tracker
                </h3>
                <InteractiveMap
                  donors={mapDonors}
                  receivers={mapReceivers}
                  volunteers={mapVolunteers}
                  selectedRoute={selectedRoute}
                />
              </div>

              {/* Active Tasks Quick Panel */}
              <div className="glass-panel p-6 rounded-3xl space-y-4">
                <h3 className="font-bold text-slate-100 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-400" />
                  Active Tasks
                </h3>

                {activeDeliveries.length > 0 ? (
                  <div className="space-y-4">
                    {activeDeliveries.map(delivery => {
                      const cfg = statusConfig[delivery.status];
                      return (
                        <div
                          key={delivery.id}
                          onClick={() => handleViewRoute(delivery)}
                          className={`glass-card p-4 border cursor-pointer hover:border-emerald-500/30 transition-all space-y-3 ${cfg?.bg}`}
                        >
                          <div className="flex justify-between items-start">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${cfg?.color} bg-white/5`}>
                              {cfg?.label}
                            </span>
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> Tap to route
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-200 text-xs leading-snug">{delivery.foodName}</h4>
                          <p className="text-[11px] text-slate-400">{delivery.quantity} • From: {delivery.donorName}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500/20 mx-auto" />
                    <p className="text-xs text-slate-500 font-semibold">No active tasks. Browse the delivery marketplace!</p>
                    <Link to="/volunteer-dashboard?tab=deliveries" className="btn-secondary text-xs w-fit mx-auto mt-2">
                      Browse Marketplace
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =================== MY DELIVERIES TAB =================== */}
        {activeTab === 'deliveries' && (
          <div className="space-y-8 animate-alert-in">
            {/* Active Deliveries */}
            {activeDeliveries.length > 0 && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-3">
                    <Truck className="h-6 w-6 text-amber-400" />
                    Active Delivery Tasks
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">Manage your pickup and delivery assignments in real-time.</p>
                </div>

                <div className="space-y-6">
                  {activeDeliveries.map(delivery => {
                    const cfg = statusConfig[delivery.status];
                    return (
                      <div key={delivery.id} className={`rounded-2xl border p-6 space-y-5 ${cfg?.bg}`}>
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div className="space-y-1">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${cfg?.color} ${cfg?.bg}`}>
                              {cfg?.label}
                            </span>
                            <h3 className="text-lg font-extrabold text-slate-100">{delivery.foodName}</h3>
                          </div>
                          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 w-fit">
                            {delivery.quantity}
                          </span>
                        </div>

                        {/* Pickup → Delivery Route */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="glass-card p-4 space-y-2">
                            <div className="flex items-center gap-2 text-emerald-400">
                              <Building2 className="h-4 w-4" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Pickup (Donor)</span>
                            </div>
                            <p className="text-sm font-bold text-slate-200">{delivery.donorName}</p>
                            <p className="text-xs text-slate-400 flex items-start gap-1.5">
                              <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-500" />
                              {delivery.pickupAddress}
                            </p>
                            {delivery.donorPhone && (
                              <a href={`tel:${delivery.donorPhone}`} className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold">
                                <Phone className="h-3.5 w-3.5" />
                                {delivery.donorPhone}
                              </a>
                            )}
                          </div>

                          <div className="glass-card p-4 space-y-2">
                            <div className="flex items-center gap-2 text-sky-400">
                              <UserCheck className="h-4 w-4" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Deliver To (NGO)</span>
                            </div>
                            <p className="text-sm font-bold text-slate-200">
                              {delivery.claimedByReceiverId ? 'NGO Partner' : 'Unassigned'}
                            </p>
                            <p className="text-xs text-slate-400">
                              Food type: <span className="font-semibold text-slate-300">{delivery.foodType}</span>
                            </p>
                            <p className="text-xs text-slate-500">
                              Expires: {new Date(delivery.expiryTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        {/* Notes */}
                        {delivery.additionalNotes && (
                          <div className="px-4 py-3 rounded-xl bg-white/3 border border-white/5 text-xs text-slate-400 italic">
                            📝 {delivery.additionalNotes}
                          </div>
                        )}

                        {/* Action Button */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-white/5">
                          <button
                            onClick={() => handleStatusUpdate(delivery.id, cfg?.next)}
                            disabled={updatingId === delivery.id}
                            className={`btn-primary flex-1 py-3 text-sm font-extrabold ${cfg?.nextColor}`}
                          >
                            {updatingId === delivery.id ? (
                              <span className="animate-pulse">Updating...</span>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4" />
                                {cfg?.nextLabel}
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleViewRoute(delivery)}
                            className="btn-secondary flex-1 py-3 text-sm font-semibold"
                          >
                            <Navigation className="h-4 w-4" />
                            View Route
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Marketplace Donations */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-3">
                  <Package className="h-6 w-6 text-emerald-400" />
                  Donation Marketplace
                </h1>
                <p className="text-xs text-slate-500 mt-1">All available surplus food listings needing volunteer pickup and delivery.</p>
              </div>

              {availableDonations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-500 uppercase tracking-widest font-bold">
                        <th className="py-4 px-2">Food Details</th>
                        <th className="py-4 px-2">Quantity</th>
                        <th className="py-4 px-2">Donor</th>
                        <th className="py-4 px-2">Expires</th>
                        <th className="py-4 px-2">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableDonations.map(don => (
                        <tr key={don.id} className="border-b border-white/5 text-slate-300 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-2">
                            <div className="space-y-1">
                              <span className="font-bold text-slate-200">{don.foodName}</span>
                              <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" /> {don.pickupAddress}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-2 font-bold text-slate-200">{don.quantity}</td>
                          <td className="py-4 px-2 text-slate-400">{don.donorName}</td>
                          <td className="py-4 px-2 text-slate-400">
                            {new Date(don.expiryTime).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="py-4 px-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              don.foodType === 'Veg' ? 'bg-emerald-500/20 text-emerald-400'
                              : don.foodType === 'Vegan' ? 'bg-teal-500/20 text-teal-400'
                              : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {don.foodType}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <Package className="h-12 w-12 text-slate-600 mx-auto" />
                  <p className="text-slate-400 font-semibold">No active donations awaiting pickup right now.</p>
                  <p className="text-xs text-slate-500">Check back shortly or refresh to see new listings.</p>
                </div>
              )}
            </div>

            {/* Completed Deliveries */}
            {completedDeliveries.length > 0 && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    Completed Delivery History
                  </h2>
                </div>
                <div className="space-y-3">
                  {completedDeliveries.map(del => (
                    <div key={del.id} className="glass-card p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-emerald-500/20">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 uppercase">Delivered</span>
                          <span className="text-[10px] text-slate-500">{new Date(del.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-bold text-slate-200 text-sm">{del.foodName}</h4>
                        <p className="text-xs text-slate-400">From: {del.donorName}</p>
                      </div>
                      <div className="shrink-0 text-left sm:text-right">
                        <p className="text-sm font-bold text-slate-100">{del.quantity}</p>
                        <p className="text-[10px] text-emerald-400 mt-1 font-semibold">+10 pts earned</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================== NOTIFICATIONS TAB =================== */}
        {activeTab === 'notifications' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 animate-alert-in">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Volunteer Notifications</h1>
              <p className="text-xs text-slate-500 mt-1">Dispatch alerts, delivery assignments, and admin broadcasts.</p>
            </div>

            {myNotifications.length > 0 ? (
              <div className="space-y-3">
                {myNotifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex justify-between items-start gap-4 ${
                      notif.isRead
                        ? 'glass-card hover:border-white/15 opacity-60'
                        : 'glass-panel-glow border-emerald-500/25 bg-emerald-500/5 hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className={`text-sm font-bold ${notif.isRead ? 'text-slate-300' : 'text-slate-100'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] text-slate-500 pt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 animate-pulse mt-1.5" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 space-y-4">
                <AlertTriangle className="h-12 w-12 text-slate-600 mx-auto" />
                <p className="text-slate-400 font-semibold">No notifications yet.</p>
                <p className="text-xs text-slate-500">You will be notified when food deliveries are assigned to you.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default VolunteerDashboard;
