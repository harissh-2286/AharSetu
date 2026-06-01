import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../utils/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(api.getCurrentUser());
  const [token, setToken] = useState(sessionStorage.getItem('aharsetu_token'));
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success'|'error'|'info', message: '' }

  // Trigger global system notifications/alerts
  const triggerAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // Fetch initial collections
  const loadData = async () => {
    try {
      setLoading(true);
      const allDons = await api.getDonations();
      const allReqs = await api.getRequests();
      const allFeed = await api.getFeedback();
      
      setDonations(allDons);
      setRequests(allReqs);
      setFeedback(allFeed);

      if (user) {
        const myNotifs = await api.getNotifications(user.id);
        setNotifications(myNotifs);

        if (user.role === 'admin') {
          const allUsers = await api.getUsersList();
          setUsersList(allUsers);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Auth Functions
  const loginUser = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.login(email, password);
      setUser(res.user);
      setToken(res.token);
      triggerAlert('success', `Welcome back, ${res.user.name}!`);
      return res.user;
    } catch (err) {
      triggerAlert('error', err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData) => {
    try {
      setLoading(true);
      const res = await api.register(userData);
      setUser(res.user);
      setToken(res.token);
      triggerAlert('success', `Account created successfully, welcome ${res.user.name}!`);
      return res.user;
    } catch (err) {
      triggerAlert('error', err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    await api.logout();
    setUser(null);
    setToken(null);
    setNotifications([]);
    setUsersList([]);
    triggerAlert('info', 'Logged out successfully');
  };

  // Donation Actions
  const addDonation = async (donationData) => {
    try {
      setLoading(true);
      const newDon = await api.createDonation(donationData);
      setDonations(prev => [newDon, ...prev]);
      triggerAlert('success', 'Your donation has been listed! Nearby volunteers will be notified.');
      return newDon;
    } catch (err) {
      triggerAlert('error', 'Failed to publish donation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const claimFood = async (donationId) => {
    if (!user) {
      triggerAlert('error', 'Please log in to claim food');
      return;
    }
    try {
      setLoading(true);
      const updated = await api.claimDonation(donationId, user.id);
      
      // Update local state
      setDonations(prev => prev.map(d => d.id === donationId ? updated : d));
      triggerAlert('success', 'Donation claimed successfully! A volunteer is arriving shortly.');
      loadData(); // reload collections to refresh notifications
    } catch (err) {
      triggerAlert('error', err.message || 'Failed to claim food');
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (donationId, status) => {
    try {
      const updated = await api.updateDonationStatus(donationId, status);
      setDonations(prev => prev.map(d => d.id === donationId ? updated : d));
      triggerAlert('success', `Delivery status updated to ${status.replace('_', ' ')}`);
      loadData();
    } catch (err) {
      triggerAlert('error', 'Failed to update delivery status');
    }
  };

  const cancelDonation = async (donationId) => {
    try {
      await api.deleteDonation(donationId);
      setDonations(prev => prev.filter(d => d.id !== donationId));
      triggerAlert('info', 'Donation cancelled successfully');
    } catch (err) {
      triggerAlert('error', 'Failed to cancel donation');
    }
  };

  // Request Actions
  const addRequest = async (requestData) => {
    try {
      setLoading(true);
      const newReq = await api.createRequest(requestData);
      setRequests(prev => [newReq, ...prev]);
      triggerAlert('success', 'Emergency food request posted successfully.');
      return newReq;
    } catch (err) {
      triggerAlert('error', 'Failed to post request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFoodRequestStatus = async (requestId, status) => {
    try {
      const updated = await api.updateRequestStatus(requestId, status);
      setRequests(prev => prev.map(r => r.id === requestId ? updated : r));
      triggerAlert('success', `Request status marked as ${status}`);
      loadData();
    } catch (err) {
      triggerAlert('error', 'Failed to update request');
    }
  };

  const cancelRequest = async (requestId) => {
    try {
      await api.deleteRequest(requestId);
      setRequests(prev => prev.filter(r => r.id !== requestId));
      triggerAlert('info', 'Emergency request retracted');
    } catch (err) {
      triggerAlert('error', 'Failed to cancel request');
    }
  };

  // Notification Actions
  const markAsRead = async (notifId) => {
    try {
      await api.markNotificationRead(notifId);
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  // Feedback Actions
  const submitReview = async (reviewData) => {
    try {
      const res = await api.submitFeedback(reviewData);
      setFeedback(prev => [res, ...prev]);
      triggerAlert('success', 'Thank you for your feedback!');
      return res;
    } catch (err) {
      triggerAlert('error', 'Could not post feedback');
      throw err;
    }
  };

  // Admin Actions
  const toggleUserVerification = async (userId, isVerified) => {
    try {
      const updatedUser = await api.verifyUser(userId, isVerified);
      setUsersList(prev => prev.map(u => u.id === userId ? updatedUser : u));
      triggerAlert('success', `User verification status updated to: ${isVerified ? 'VERIFIED' : 'PENDING'}`);
    } catch (err) {
      triggerAlert('error', 'Could not verify user');
    }
  };

  const removeUserAccount = async (userId) => {
    try {
      await api.deleteUser(userId);
      setUsersList(prev => prev.filter(u => u.id !== userId));
      triggerAlert('info', 'User account permanently removed');
    } catch (err) {
      triggerAlert('error', 'Could not remove user account');
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      token,
      donations,
      requests,
      notifications,
      feedback,
      usersList,
      loading,
      alert,
      triggerAlert,
      loadData,
      loginUser,
      registerUser,
      logoutUser,
      addDonation,
      claimFood,
      updateDeliveryStatus,
      cancelDonation,
      addRequest,
      updateFoodRequestStatus,
      cancelRequest,
      markAsRead,
      submitReview,
      toggleUserVerification,
      removeUserAccount
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
