import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import InteractiveMap from '../components/InteractiveMap';
import { ClipboardList, Package, Clock, MapPin, Truck, AlertTriangle, Plus, CheckCircle2, Phone, Building2 } from 'lucide-react';

const ReceiverDashboard = () => {
  const { user, donations, requests, addRequest, cancelRequest, notifications, markAsRead } = useApp();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'overview';

  // Requirements Modal state
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [foodRequirement, setFoodRequirement] = useState('');
  const [quantityNeeded, setQuantityNeeded] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [emergencyLevel, setEmergencyLevel] = useState('Low');
  const [submitting, setSubmitting] = useState(false);

  // Active tracking state
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Filter receiver-specific collections
  const myRequests = requests.filter(r => r.receiverId === user?.id);
  const myClaims = donations.filter(d => d.claimedByReceiverId === user?.id);
  const activeClaims = myClaims.filter(d => d.status !== 'delivered');
  const pastClaims = myClaims.filter(d => d.status === 'delivered');

  // Compute metrics
  const totalReceivedMeals = pastClaims.reduce((acc, curr) => {
    return acc + (parseInt(curr.quantity) || 0);
  }, 0);

  const activeClaimedMeals = activeClaims.reduce((acc, curr) => {
    return acc + (parseInt(curr.quantity) || 0);
  }, 0);

  const handlePostRequest = async (e) => {
    e.preventDefault();
    if (!foodRequirement || !quantityNeeded || !beneficiaries) return;

    try {
      setSubmitting(true);
      await addRequest({
        organizationName: user?.name || 'NGO Partner',
        contactPerson: user?.name,
        phone: user?.phone,
        foodRequirement,
        quantityNeeded,
        beneficiaries,
        deliveryAddress,
        emergencyLevel,
        coordinates: user?.coordinates
      });
      setShowRequestForm(false);
      setFoodRequirement('');
      setQuantityNeeded('');
      setBeneficiaries('');
      setEmergencyLevel('Low');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Mock users database to feed to InteractiveMap
  // We can fetch this or construct coordinate sets from active listings
  const getMapPoints = () => {
    const donors = myClaims.map(d => ({
      name: d.donorName,
      coordinates: d.coordinates,
      role: 'donor'
    }));

    const receivers = [
      {
        name: user?.name || 'My NGO Center',
        coordinates: user?.coordinates || { lat: 28.6948, lng: 77.2085 },
        role: 'receiver'
      }
    ];

    const volunteers = myClaims
      .filter(d => d.assignedVolunteerId)
      .map((d, i) => ({
        name: `Volunteer Kabir Mehta`,
        coordinates: { 
          lat: (d.coordinates.lat + (user?.coordinates?.lat || 28.6948)) / 2 + (i * 0.01 - 0.005),
          lng: (d.coordinates.lng + (user?.coordinates?.lng || 77.2085)) / 2 + (i * 0.01 - 0.005)
        },
        role: 'volunteer'
      }));

    return { donors, receivers, volunteers };
  };

  const { donors: mapDonors, receivers: mapReceivers, volunteers: mapVolunteers } = getMapPoints();

  const handleTrackDelivery = (claim) => {
    setSelectedRoute({
      from: claim.coordinates,
      to: user?.coordinates || { lat: 28.6948, lng: 77.2085 }
    });
  };

  const myNotifications = notifications.filter(n => n.userId === user?.id);

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Sidebar Navigation */}
      <Sidebar role="receiver" />

      {/* Main Panel */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Mobile quick header */}
        <div className="lg:hidden flex flex-wrap items-center justify-between mb-6 gap-3 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-slate-100">{user?.name}</h2>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">NGO Dashboard</p>
          </div>
          <button onClick={() => setShowRequestForm(true)} className="btn-primary text-xs py-2 px-4 shadow-sm">
            <Plus className="h-4 w-4" /> Post Requirement
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Greetings Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel-glow p-8 rounded-3xl">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Welcome NGO Partner, <span className="text-gradient">{user?.name}</span></h1>
                <p className="text-sm text-slate-400">Claim surplus listings or publish emergency food requests for your shelter branches.</p>
              </div>
              <button onClick={() => setShowRequestForm(true)} className="btn-primary py-3 px-6 hidden sm:flex font-bold">
                <Plus className="h-5 w-5" /> Request Emergency Food
              </button>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Meals Received', value: totalReceivedMeals, desc: 'Shared dining history', color: 'emerald' },
                { label: 'Active Claims', value: activeClaims.length, desc: 'Deliveries in-transit', color: 'sky' },
                { label: 'Requirements Posted', value: myRequests.length, desc: 'Local shelter broadcasts', color: 'amber' },
                { label: 'In-Transit Meals', value: activeClaimedMeals, desc: 'Dispatched volunteer weight', color: 'violet' }
              ].map((m, i) => (
                <div key={i} className="glass-card hover:border-emerald-500/20 transition-all duration-300">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{m.label}</span>
                  <p className="text-2xl sm:text-3xl font-black text-slate-100 mt-2">{m.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{m.desc}</p>
                </div>
              ))}
            </div>

            {/* Map and Active claims split */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Active claims routing (Left 2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel p-6 rounded-3xl space-y-4">
                  <h3 className="font-bold text-slate-100 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-emerald-400 animate-pulse" />
                    Live Logistics Routing
                  </h3>
                  <InteractiveMap
                    donors={mapDonors}
                    receivers={mapReceivers}
                    volunteers={mapVolunteers}
                    selectedRoute={selectedRoute}
                  />
                </div>
              </div>

              {/* Claims tracking details (Right 1 col) */}
              <div className="glass-panel p-6 rounded-3xl space-y-6">
                <h3 className="font-bold text-slate-100 flex items-center gap-2">
                  <Package className="h-5 w-5 text-sky-400" />
                  Active Shipments
                </h3>

                {activeClaims.length > 0 ? (
                  <div className="space-y-4">
                    {activeClaims.map(claim => (
                      <div
                        key={claim.id}
                        onClick={() => handleTrackDelivery(claim)}
                        className="glass-card p-4 border border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/5 transition-all cursor-pointer space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                            {claim.status.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Active
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-200 text-xs">{claim.foodName}</h4>
                        <p className="text-[11px] text-slate-400">{claim.quantity} • From: {claim.donorName}</p>

                        <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px]">
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> Tap to track route
                          </span>
                          <span className="text-slate-500">Carrier: Kabir Mehta</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 space-y-4">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500/20 mx-auto" />
                    <p className="text-xs text-slate-500 font-semibold">No active shipments in transit. Browse listings to claim.</p>
                    <Link to="/live-listings" className="btn-secondary text-xs w-fit mx-auto mt-2">Browse Marketplace</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: My Requests (Emergency requirements) */}
        {activeTab === 'requests' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Emergency Requirements</h1>
                <p className="text-xs text-slate-500 mt-1">Audit log of emergency requests broadcasted for your branches.</p>
              </div>
              <button onClick={() => setShowRequestForm(true)} className="btn-primary text-xs py-2 px-4">
                <Plus className="h-4 w-4" /> Add Request
              </button>
            </div>

            {myRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-500 uppercase tracking-widest font-bold">
                      <th className="py-4 px-2">Requirement Description</th>
                      <th className="py-4 px-2">Quantity</th>
                      <th className="py-4 px-2">Beneficiaries</th>
                      <th className="py-4 px-2">Severity</th>
                      <th className="py-4 px-2">Status</th>
                      <th className="py-4 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRequests.map(req => (
                      <tr key={req.id} className="border-b border-white/5 text-slate-300 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-2">
                          <div className="space-y-1">
                            <span className="font-bold text-slate-200">{req.foodRequirement}</span>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" /> {req.deliveryAddress}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-2 font-bold text-slate-200">{req.quantityNeeded}</td>
                        <td className="py-4 px-2 text-slate-400">{req.beneficiaries} Residents</td>
                        <td className="py-4 px-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            req.emergencyLevel === 'Critical'
                              ? 'bg-rose-500/20 text-rose-400'
                              : req.emergencyLevel === 'High'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {req.emergencyLevel}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-slate-400 uppercase">
                            {req.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <button
                            onClick={() => cancelRequest(req.id)}
                            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-400 hover:text-rose-400"
                            title="Retract Post"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 space-y-4">
                <ClipboardList className="h-12 w-12 text-slate-600 mx-auto" />
                <p className="text-slate-400 font-semibold">No emergency requests active. Publish if you experience sudden deficit.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Claimed History */}
        {activeTab === 'claimed' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Claimed Food History</h1>
              <p className="text-xs text-slate-500 mt-1">Audit log of all surplus hotel and bistro listings claimed by your NGO.</p>
            </div>

            {pastClaims.length > 0 ? (
              <div className="space-y-4">
                {pastClaims.map(claim => (
                  <div key={claim.id} className="glass-card p-5 hover:border-emerald-500/20 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 uppercase tracking-wider">
                          Delivered
                        </span>
                        <span className="text-[10px] text-slate-500">Received on: {new Date(claim.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-slate-200 text-sm sm:text-base">{claim.foodName}</h4>
                      <p className="text-xs text-slate-400">Listed by donor: {claim.donorName} • Contact: {claim.donorPhone}</p>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-sm font-bold text-slate-100">{claim.quantity}</p>
                      <p className="text-[10px] text-slate-500 mt-1">Status: Logged successfully</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 space-y-4">
                <Package className="h-12 w-12 text-slate-600 mx-auto" />
                <p className="text-slate-400 font-semibold">No food delivery history available.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Notifications */}
        {activeTab === 'notifications' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">NGO Notifications</h1>
              <p className="text-xs text-slate-500 mt-1">Audit log of listing claims alerts and logistics dispatches.</p>
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
                <p className="text-slate-400 font-semibold">No notifications available.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Emergency Request Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass-panel-glow rounded-3xl p-8 space-y-6 animate-alert-in">
            {/* Modal header */}
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-100">Post Emergency Food Request</h3>
              <p className="text-xs text-slate-400">Broadcast your food requirements to all nearby corporate kitchen donors.</p>
            </div>

            <form onSubmit={handlePostRequest} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Food Requirement Description</label>
                <input
                  type="text"
                  required
                  value={foodRequirement}
                  onChange={(e) => setFoodRequirement(e.target.value)}
                  placeholder="e.g. Prepared Rice & Dal, Milk packets, Packaged snacks"
                  className="glass-input text-sm py-2.5"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Quantity Needed</label>
                  <input
                    type="text"
                    required
                    value={quantityNeeded}
                    onChange={(e) => setQuantityNeeded(e.target.value)}
                    placeholder="e.g. 100 Meals, 30 Liters"
                    className="glass-input text-sm py-2.5"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Target Beneficiary Count</label>
                  <input
                    type="number"
                    required
                    value={beneficiaries}
                    onChange={(e) => setBeneficiaries(e.target.value)}
                    placeholder="e.g. 120 residents"
                    className="glass-input text-sm py-2.5"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Emergency Severity Level</label>
                  <select
                    value={emergencyLevel}
                    onChange={(e) => setEmergencyLevel(e.target.value)}
                    className="glass-input text-sm py-2.5 bg-darkblue-900 border-white/10 text-slate-200"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Severity</option>
                    <option value="Critical">🚨 CRITICAL EMERGENCY</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Delivery Address</label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="glass-input text-sm py-2.5"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 text-sm font-extrabold py-3"
                >
                  {submitting ? 'Broadcasting...' : 'Broadcast Broadcast'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="btn-secondary flex-1 text-sm font-semibold py-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiverDashboard;
