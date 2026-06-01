import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import { Heart, Package, Calendar, Clock, MapPin, Printer, Trash2, CheckCircle2, AlertCircle, Plus, Eye } from 'lucide-react';

const DonorDashboard = () => {
  const { user, donations, cancelDonation, notifications, markAsRead } = useApp();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'overview';

  // State for printable receipt modal
  const [selectedDonation, setSelectedDonation] = useState(null);

  // Filter donor-specific donations
  const myDonations = donations.filter(d => d.donorId === user?.id);
  const activeShares = myDonations.filter(d => d.status === 'available');
  const claimedShares = myDonations.filter(d => d.status === 'claimed' || d.status === 'picked_up');
  const completedShares = myDonations.filter(d => d.status === 'delivered');

  // Compute metrics
  const totalMeals = myDonations.reduce((acc, curr) => {
    const qtyNum = parseInt(curr.quantity) || 0;
    return acc + qtyNum;
  }, 0);

  const foodSavedKg = Math.round(totalMeals * 0.25); // estimate 0.25kg per meal

  // Notifications for this donor
  const myNotifications = notifications.filter(n => n.userId === user?.id);

  const printReceipt = (donation) => {
    setSelectedDonation(donation);
  };

  const handlePrintAction = () => {
    window.print();
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Sidebar navigation */}
      <Sidebar role="donor" />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Mobile Header / Quick Info */}
        <div className="lg:hidden flex flex-wrap items-center justify-between mb-6 gap-3 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-slate-100">{user?.name}</h2>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Donor Dashboard</p>
          </div>
          <Link to="/donate" className="btn-primary text-xs py-2 px-4 shadow-sm">
            <Plus className="h-4 w-4" /> Donate Food
          </Link>
        </div>

        {/* Tab Content Router */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Overview Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel-glow p-8 rounded-3xl">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Welcome, <span className="text-gradient">{user?.name}</span></h1>
                <p className="text-sm text-slate-400">Thank you for sharing your kitchen surplus. Your efforts have significantly fed local community shelters.</p>
              </div>
              <Link to="/donate" className="btn-primary py-3 px-6 hidden sm:flex font-bold">
                <Plus className="h-5 w-5" /> Post New Donation
              </Link>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Listings', value: myDonations.length, desc: 'Shared items count', color: 'emerald' },
                { label: 'Active Listings', value: activeShares.length, desc: 'Awaiting claims', color: 'sky' },
                { label: 'Claimed / In-Transit', value: claimedShares.length, desc: 'Assigned to volunteer', color: 'amber' },
                { label: 'Food Saved (Est.)', value: `${foodSavedKg} kg`, desc: `~${totalMeals} meals shared`, color: 'violet' }
              ].map((m, i) => (
                <div key={i} className="glass-card hover:border-emerald-500/20 transition-all duration-300">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{m.label}</span>
                  <p className="text-2xl sm:text-3xl font-black text-slate-100 mt-2">{m.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{m.desc}</p>
                </div>
              ))}
            </div>

            {/* Layout Split: Active Listings + Alert panel */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Active Listings (Left 2 cols) */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-100 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-500" />
                    Active Surplus Listings
                  </h3>
                  <Link to="/donor-dashboard?tab=donations" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                    View History
                  </Link>
                </div>

                {activeShares.length > 0 ? (
                  <div className="space-y-4">
                    {activeShares.map(item => (
                      <div key={item.id} className="glass-card p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-emerald-500/20">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                              {item.foodType}
                            </span>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Expires in: {new Date(item.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-200 text-sm sm:text-base">{item.foodName}</h4>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-500" />
                            {item.quantity} - {item.pickupAddress}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => printReceipt(item)}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-400 transition-all duration-300"
                            title="Print Token"
                          >
                            <Printer className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => cancelDonation(item.id)}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/15 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-all duration-300"
                            title="Cancel Post"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <Package className="h-10 w-10 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-500 font-semibold">You have no active surplus listings at the moment.</p>
                  </div>
                )}
              </div>

              {/* Live Status & Volunteer Alerts (Right 1 col) */}
              <div className="glass-panel p-6 rounded-3xl space-y-6">
                <h3 className="font-bold text-slate-100 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Claimed / Active Tasks
                </h3>

                {claimedShares.length > 0 ? (
                  <div className="space-y-4">
                    {claimedShares.map(item => (
                      <div key={item.id} className="glass-card p-4 border border-amber-500/20 bg-amber-500/5 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                              {item.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <h4 className="font-bold text-slate-200 text-xs mt-1.5 line-clamp-1">{item.foodName}</h4>
                          </div>
                          <button
                            onClick={() => printReceipt(item)}
                            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-400"
                            title="Print Voucher"
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Route / Volunteer assignment details */}
                        <div className="pt-3 border-t border-white/5 flex gap-3 items-center">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center font-bold text-slate-900 text-xs shrink-0">
                            VM
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-300">Volunteer Assigned</p>
                            <p className="text-[10px] text-slate-500">Pickup route coordinate locked.</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500/20 mx-auto" />
                    <p className="text-xs text-slate-500 font-semibold">No claimed items en-route. All deliveries completed!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: History List */}
        {activeTab === 'donations' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Surplus Listing History</h1>
              <p className="text-xs text-slate-500 mt-1">Audit log of all surplus meal donations shared on the AharSetu network.</p>
            </div>

            {myDonations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-500 uppercase tracking-widest font-bold">
                      <th className="py-4 px-2">Food Detail</th>
                      <th className="py-4 px-2">Quantity</th>
                      <th className="py-4 px-2">Listed Date</th>
                      <th className="py-4 px-2">Status</th>
                      <th className="py-4 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myDonations.map(item => (
                      <tr key={item.id} className="border-b border-white/5 text-slate-300 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-2">
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-slate-400 uppercase mr-2">
                              {item.foodType}
                            </span>
                            <span className="font-bold text-slate-200">{item.foodName}</span>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" /> {item.pickupAddress}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-2 font-bold text-slate-200">{item.quantity}</td>
                        <td className="py-4 px-2 text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            item.status === 'available'
                              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                              : item.status === 'claimed'
                              ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                              : item.status === 'delivered'
                              ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                          }`}>
                            {item.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => printReceipt(item)}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-400"
                              title="Print Token"
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                            {item.status === 'available' && (
                              <button
                                onClick={() => cancelDonation(item.id)}
                                className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-400 hover:text-rose-400"
                                title="Cancel Listing"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 space-y-4">
                <Package className="h-12 w-12 text-slate-600 mx-auto" />
                <p className="text-slate-400 font-semibold">No listing history available. Post your first donation drive!</p>
                <Link to="/donate" className="btn-primary mt-4 mx-auto w-fit">Post a Donation</Link>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Notifications */}
        {activeTab === 'notifications' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Donor Notifications</h1>
              <p className="text-xs text-slate-500 mt-1">Audit log of your donor listings alerts and logistics dispatches.</p>
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
                <AlertCircle className="h-12 w-12 text-slate-600 mx-auto" />
                <p className="text-slate-400 font-semibold">No notifications available.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Printable Receipt Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-8 space-y-6 animate-alert-in print:bg-white print:text-slate-950 print:border-none print:shadow-none">
            {/* Modal close */}
            <button
              onClick={() => setSelectedDonation(null)}
              className="absolute right-6 top-6 p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-all print:hidden"
            >
              Close
            </button>

            {/* Receipt Content */}
            <div id="printable-area" className="space-y-6">
              {/* Receipt Header */}
              <div className="text-center pb-4 border-b border-dashed border-white/10 print:border-slate-300">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">AharSetu Network Voucher</span>
                <h3 className="text-xl font-extrabold text-slate-100 mt-2 print:text-slate-950">Food Donation Pass</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-1">TOKEN: {selectedDonation.id.toUpperCase()}</p>
              </div>

              {/* Receipt Details */}
              <div className="space-y-3 font-mono text-xs text-slate-300 print:text-slate-800">
                <div className="flex justify-between">
                  <span>Donor Name:</span>
                  <span className="font-bold text-slate-100 print:text-slate-950">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Food Item:</span>
                  <span className="font-bold text-slate-100 print:text-slate-950 max-w-[200px] text-right line-clamp-1">{selectedDonation.foodName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-bold text-emerald-400 print:text-emerald-700">{selectedDonation.foodType.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-bold text-slate-100 print:text-slate-950">{selectedDonation.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pickup Spot:</span>
                  <span className="font-bold text-slate-100 print:text-slate-950 max-w-[200px] text-right line-clamp-2">{selectedDonation.pickupAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created At:</span>
                  <span className="font-bold">{new Date(selectedDonation.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Barcode Mock */}
              <div className="pt-4 border-t border-dashed border-white/10 print:border-slate-300 flex flex-col items-center gap-2">
                <div className="h-10 w-full bg-slate-900/60 border border-white/10 rounded flex items-center justify-center font-mono text-[9px] tracking-[6px] text-slate-500 print:bg-slate-200 print:text-slate-950">
                  ||||| | |||| | ||| | ||| |||| | |
                </div>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Present this token to the picking volunteer</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-4 pt-4 border-t border-white/5 print:hidden">
              <button
                onClick={handlePrintAction}
                className="btn-primary flex-1 text-sm font-extrabold py-3"
              >
                <Printer className="h-4.5 w-4.5" />
                Print Ticket
              </button>
              <button
                onClick={() => setSelectedDonation(null)}
                className="btn-secondary flex-1 text-sm font-semibold py-3"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
