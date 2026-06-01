import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import { BarChart3, Users, Package, ClipboardList, MessageSquare, ShieldCheck, Check, Trash2, Clock, MapPin, AlertCircle, Heart } from 'lucide-react';

const AdminDashboard = () => {
  const {
    usersList,
    donations,
    requests,
    feedback,
    toggleUserVerification,
    removeUserAccount,
    updateDeliveryStatus,
    updateFoodRequestStatus,
    cancelDonation,
    cancelRequest
  } = useApp();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'overview';

  // Compute metrics
  const donorCount = usersList.filter(u => u.role === 'donor').length;
  const receiverCount = usersList.filter(u => u.role === 'receiver').length;
  const volunteerCount = usersList.filter(u => u.role === 'volunteer').length;

  const totalMealsShared = donations
    .filter(d => d.status === 'delivered')
    .reduce((acc, curr) => acc + (parseInt(curr.quantity) || 0), 0);

  const totalFoodSavedKg = Math.round(totalMealsShared * 0.25);

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Sidebar Consol */}
      <Sidebar role="admin" />

      {/* Main Panel */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Aditya Sharma</h2>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">AharSetu Admin Console</p>
          </div>
        </div>

        {/* Tab Content: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-alert-in">
            {/* Greetings Banner */}
            <div className="glass-panel-glow p-8 rounded-3xl space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Admin Command Center</h1>
              <p className="text-sm text-slate-400">Audit system database, manage community credentials, inspect logistics metrics, and review user support reports.</p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Registered Users', value: usersList.length, icon: <Users className="h-5 w-5 text-emerald-400" /> },
                { label: 'Meals Saved', value: `${totalMealsShared} meals`, icon: <Heart className="h-5 w-5 text-rose-400" /> },
                { label: 'Food Saved (Est.)', value: `${totalFoodSavedKg} kg`, icon: <Package className="h-5 w-5 text-sky-400" /> },
                { label: 'Support Inquiries', value: feedback.length, icon: <MessageSquare className="h-5 w-5 text-amber-400" /> }
              ].map((m, i) => (
                <div key={i} className="glass-card flex items-center justify-between hover:border-emerald-500/20 transition-all duration-300">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{m.label}</span>
                    <p className="text-xl sm:text-2xl font-black text-slate-100 mt-2">{m.value}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
                    {m.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Layout Split: Analytics + Live Activity */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Custom SVG/CSS Charts (Left 2 cols) */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-6">
                <h3 className="font-bold text-slate-100 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                  System Metrics & Activity Distribution
                </h3>

                {/* SVG/CSS Progress Meters */}
                <div className="space-y-6">
                  {/* User Role Distribution */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>User Demographics</span>
                      <span className="text-slate-500">Donors: {donorCount} • NGOs: {receiverCount} • Volunteers: {volunteerCount}</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex">
                      <div style={{ width: `${(donorCount / usersList.length) * 100}%` }} className="h-full bg-emerald-500" title="Donors" />
                      <div style={{ width: `${(receiverCount / usersList.length) * 100}%` }} className="h-full bg-blue-500" title="NGOs" />
                      <div style={{ width: `${(volunteerCount / usersList.length) * 100}%` }} className="h-full bg-amber-500" title="Volunteers" />
                    </div>
                  </div>

                  {/* Listings Severity / Urgency */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Food Listings Urgency Status</span>
                      <span className="text-slate-500">Available: {donations.filter(d => d.status === 'available').length} • Claimed: {donations.filter(d => d.status === 'claimed').length} • Delivered: {donations.filter(d => d.status === 'delivered').length}</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex">
                      <div style={{ width: `${(donations.filter(d => d.status === 'available').length / donations.length) * 100}%` }} className="h-full bg-emerald-400" />
                      <div style={{ width: `${(donations.filter(d => d.status === 'claimed').length / donations.length) * 100}%` }} className="h-full bg-amber-400" />
                      <div style={{ width: `${(donations.filter(d => d.status === 'delivered').length / donations.length) * 100}%` }} className="h-full bg-sky-400" />
                    </div>
                  </div>

                  {/* Emergency Level Requests */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Emergency Request Severity</span>
                      <span className="text-slate-500">Critical: {requests.filter(r => r.emergencyLevel === 'Critical').length} • High: {requests.filter(r => r.emergencyLevel === 'High').length}</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex">
                      <div style={{ width: `${(requests.filter(r => r.emergencyLevel === 'Critical').length / requests.length) * 100}%` }} className="h-full bg-rose-500" />
                      <div style={{ width: `${(requests.filter(r => r.emergencyLevel === 'High').length / requests.length) * 100}%` }} className="h-full bg-amber-500" />
                      <div style={{ width: `${(requests.filter(r => r.emergencyLevel !== 'Critical' && r.emergencyLevel !== 'High').length / requests.length) * 100}%` }} className="h-full bg-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedbacks / Contacts previews (Right 1 col) */}
              <div className="glass-panel p-6 rounded-3xl space-y-6">
                <h3 className="font-bold text-slate-100 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-sky-400" />
                  Support Tickets Preview
                </h3>

                {feedback.length > 0 ? (
                  <div className="space-y-4">
                    {feedback.slice(0, 3).map(fbItem => (
                      <div key={fbItem.id} className="glass-card p-4 space-y-2 border border-white/5 hover:border-emerald-500/20 transition-all">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-slate-200">{fbItem.name}</span>
                          <span className="text-slate-500 font-mono">{new Date(fbItem.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">"{fbItem.message}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-xs text-slate-500">
                    No active support messages logged.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Users Console */}
        {activeTab === 'users' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 animate-alert-in">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Registered Accounts</h1>
              <p className="text-xs text-slate-500 mt-1">Audit credentials, edit profiles, verified volunteers, or disable bad actors.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 uppercase tracking-widest font-bold">
                    <th className="py-4 px-2">User Name</th>
                    <th className="py-4 px-2">Email</th>
                    <th className="py-4 px-2">Role</th>
                    <th className="py-4 px-2">Address / Contact</th>
                    <th className="py-4 px-2">Status</th>
                    <th className="py-4 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(usr => (
                    <tr key={usr.id} className="border-b border-white/5 text-slate-300 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-2 font-bold text-slate-200">{usr.name}</td>
                      <td className="py-4 px-2 text-slate-400">{usr.email}</td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          usr.role === 'admin'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : usr.role === 'donor'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : usr.role === 'volunteer'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {usr.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-2 max-w-[200px] truncate">
                        <div className="space-y-0.5">
                          <p className="font-semibold">{usr.phone}</p>
                          <p className="text-[10px] text-slate-500 truncate">{usr.address}</p>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        {usr.role === 'volunteer' ? (
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                            usr.volunteerDetails?.isVerified
                              ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400'
                              : 'bg-amber-500/15 border border-amber-500/25 text-amber-400'
                          }`}>
                            {usr.volunteerDetails?.isVerified ? 'VERIFIED' : 'PENDING'}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex justify-end gap-2">
                          {usr.role === 'volunteer' && (
                            <button
                              onClick={() => toggleUserVerification(usr.id, !usr.volunteerDetails?.isVerified)}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-400"
                              title="Toggle Verification"
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </button>
                          )}
                          {usr.role !== 'admin' && (
                            <button
                              onClick={() => removeUserAccount(usr.id)}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-400 hover:text-rose-400"
                              title="Delete User"
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
          </div>
        )}

        {/* Tab Content: Donations Manager */}
        {activeTab === 'donations' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 animate-alert-in">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Surplus Listings Manager</h1>
              <p className="text-xs text-slate-500 mt-1">Directly monitor listings state, modify delivery phases, or delete outdated records.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 uppercase tracking-widest font-bold">
                    <th className="py-4 px-2">Donation Details</th>
                    <th className="py-4 px-2">Quantity</th>
                    <th className="py-4 px-2">Donor</th>
                    <th className="py-4 px-2">Logistics Phase</th>
                    <th className="py-4 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map(don => (
                    <tr key={don.id} className="border-b border-white/5 text-slate-300 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-2">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-slate-400 uppercase mr-2">
                            {don.foodType}
                          </span>
                          <span className="font-bold text-slate-200">{don.foodName}</span>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" /> {don.pickupAddress}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-200">{don.quantity}</td>
                      <td className="py-4 px-2 text-slate-400 font-semibold">{don.donorName}</td>
                      <td className="py-4 px-2">
                        <select
                          value={don.status}
                          onChange={(e) => updateDeliveryStatus(don.id, e.target.value)}
                          className="glass-input text-[11px] py-1 px-2.5 bg-darkblue-900 border-white/10"
                        >
                          <option value="available">Available</option>
                          <option value="claimed">Claimed</option>
                          <option value="picked_up">Picked Up</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button
                          onClick={() => cancelDonation(don.id)}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Requests Manager */}
        {activeTab === 'requests' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 animate-alert-in">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Emergency Requests Manager</h1>
              <p className="text-xs text-slate-500 mt-1">Directly monitor local branch deficits, verify urgency levels, and modify approvals.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 uppercase tracking-widest font-bold">
                    <th className="py-4 px-2">NGO Requirement</th>
                    <th className="py-4 px-2">Quantity Needed</th>
                    <th className="py-4 px-2">Beneficiaries</th>
                    <th className="py-4 px-2">Crisis Severity</th>
                    <th className="py-4 px-2">Status</th>
                    <th className="py-4 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req.id} className="border-b border-white/5 text-slate-300 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-2">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-200">{req.foodRequirement}</span>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" /> {req.organizationName} - {req.deliveryAddress}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-2 font-bold text-slate-200">{req.quantityNeeded}</td>
                      <td className="py-4 px-2 text-slate-400">{req.beneficiaries} residents</td>
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
                        <select
                          value={req.status}
                          onChange={(e) => updateFoodRequestStatus(req.id, e.target.value)}
                          className="glass-input text-[11px] py-1 px-2.5 bg-darkblue-900 border-white/10"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="assigned">Assigned</option>
                          <option value="fulfilled">Fulfilled</option>
                        </select>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button
                          onClick={() => cancelRequest(req.id)}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Feedbacks / Support Tickets */}
        {activeTab === 'feedback' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 animate-alert-in">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Customer Support Inquiries</h1>
              <p className="text-xs text-slate-500 mt-1">Audit log of support inquiries, feedback, and testimonials submitted by AharSetu users.</p>
            </div>

            {feedback.length > 0 ? (
              <div className="space-y-4">
                {feedback.map(fb => (
                  <div key={fb.id} className="glass-card p-6 flex flex-col sm:flex-row justify-between gap-6 hover:border-emerald-500/20 transition-all duration-300">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-slate-900 text-xs shadow-sm">
                          {fb.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-200 text-sm">{fb.name}</h4>
                          <p className="text-xs text-slate-500">{fb.email}</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                        "{fb.message}"
                      </p>
                    </div>
                    <div className="flex flex-col justify-between items-left sm:items-end shrink-0 text-left sm:text-right">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${i < fb.rating ? 'text-amber-400' : 'text-slate-700'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-3 font-mono">{new Date(fb.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500">
                <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="font-semibold text-xs">No customer support messages logged in the database.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Verification */}
        {activeTab === 'verify' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 animate-alert-in">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Volunteer & NGO Verification</h1>
              <p className="text-xs text-slate-500 mt-1">Audit identity documents, verify logistics area compliance, and grant credentials.</p>
            </div>

            {usersList.filter(u => u.role === 'volunteer').length > 0 ? (
              <div className="space-y-4">
                {usersList.filter(u => u.role === 'volunteer').map(vol => (
                  <div key={vol.id} className="glass-card p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6 hover:border-emerald-500/20">
                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                        {vol.name}
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          vol.volunteerDetails?.isVerified
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {vol.volunteerDetails?.isVerified ? 'VERIFIED' : 'PENDING'}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">Phone: {vol.phone} • Range: {vol.volunteerDetails?.serviceArea}</p>
                      <p className="text-xs text-slate-500 italic">"Experience: {vol.volunteerDetails?.experience}"</p>
                      
                      {/* Document Download Mock */}
                      <div className="p-3 rounded-lg bg-white/5 border border-white/5 w-fit flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        <ClipboardList className="h-4 w-4 text-emerald-400" />
                        <span>ID_PROOF_DOCUMENT: {vol.volunteerDetails?.idProofUrl}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex gap-2">
                      <button
                        onClick={() => toggleUserVerification(vol.id, !vol.volunteerDetails?.isVerified)}
                        className={`btn-primary text-xs py-2 px-4 ${
                          vol.volunteerDetails?.isVerified
                            ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-amber-500/20'
                            : 'bg-emerald-500 text-slate-900 shadow-emerald-500/20'
                        }`}
                      >
                        {vol.volunteerDetails?.isVerified ? 'Suspend Credentials' : 'Verify Credentials'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500">
                <ShieldCheck className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="font-semibold text-xs">No pending verification credentials logged.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
