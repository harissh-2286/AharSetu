import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import LiveFood from './pages/LiveFood';
import Gallery from './pages/Gallery';
import Testimonials from './pages/Testimonials';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import DonateFood from './pages/DonateFood';
import RequestFood from './pages/RequestFood';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import ReceiverDashboard from './pages/ReceiverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';

// Custom icons for notification alerts
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const App = () => {
  const { alert, user, loading } = useApp();

  // Role-based route protectors
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const alertIcons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />,
    info: <Info className="h-5 w-5 text-sky-400 shrink-0" />
  };

  const alertBorders = {
    success: 'border-emerald-500/20 bg-emerald-500/5 text-slate-100',
    error: 'border-rose-500/20 bg-rose-500/5 text-slate-100',
    info: 'border-sky-500/20 bg-sky-500/5 text-slate-100'
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen relative">
        {/* Navigation Sticky Bar */}
        <Navbar />

        {/* Global Loading Spinner */}
        {loading && (
          <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 z-50 animate-pulse" />
        )}

        {/* Global Alert Notification Toast */}
        {alert && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] alert-in">
            <div className={`glass-panel border p-4 rounded-2xl flex items-start gap-3 shadow-2xl ${alertBorders[alert.type] || alertBorders.info}`}>
              {alertIcons[alert.type] || alertIcons.info}
              <div className="flex-1 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">System Notification</p>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">{alert.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Page Content Container */}
        <div className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/live-listings" element={<LiveFood />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/donate"
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <DonateFood />
                </ProtectedRoute>
              }
            />
            <Route
              path="/request"
              element={
                <ProtectedRoute allowedRoles={['receiver']}>
                  <RequestFood />
                </ProtectedRoute>
              }
            />

            {/* Dashboards */}
            <Route
              path="/donor-dashboard"
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <DonorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/receiver-dashboard"
              element={
                <ProtectedRoute allowedRoles={['receiver']}>
                  <ReceiverDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer-dashboard"
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <VolunteerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Brand footer details */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
