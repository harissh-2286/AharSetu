import { seedMockDatabase } from './mockData';

// Ensure the local database has seed records
seedMockDatabase();

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
let isBackendOnline = false;

// Dynamic API connectivity test with real browser-compatible timeout
const checkServerHealth = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1500);

  try {
    const res = await fetch(`${BACKEND_URL.replace('/api', '')}/health`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      isBackendOnline = true;
      console.log('🔗 Connected to Express Server at Port 5000. Operating in Live Full-Stack mode.');
    }
  } catch (err) {
    clearTimeout(timeoutId);
    isBackendOnline = false;
    console.log('💾 Express Server offline. Operating in High-Fidelity Local Mock mode.');
  }
};
checkServerHealth();

// Helper to interact with Mock Local DB
const getMockData = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setMockData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const api = {
  // --- AUTH OPERATIONS ---
  login: async (email, password) => {
    if (isBackendOnline) {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
      return await res.json();
    } else {
      // Local Authentication Intercept
      const users = getMockData('aharsetu_users');
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) throw new Error('Invalid email or password');
      
      const sessionUser = { ...user };
      delete sessionUser.password;
      sessionStorage.setItem('aharsetu_token', `mock_jwt_token_${user.id}`);
      sessionStorage.setItem('aharsetu_user', JSON.stringify(sessionUser));
      return { token: `mock_jwt_token_${user.id}`, user: sessionUser };
    }
  },

  register: async (userData) => {
    if (isBackendOnline) {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
      return await res.json();
    } else {
      const users = getMockData('aharsetu_users');
      if (users.find(u => u.email === userData.email)) {
        throw new Error('Email is already registered');
      }
      const newUser = {
        id: `usr_${Date.now()}`,
        ...userData,
        coordinates: userData.coordinates || { lat: 28.6139, lng: 77.2090 } // Center of Delhi
      };
      users.push(newUser);
      setMockData('aharsetu_users', users);

      const sessionUser = { ...newUser };
      delete sessionUser.password;
      sessionStorage.setItem('aharsetu_token', `mock_jwt_token_${newUser.id}`);
      sessionStorage.setItem('aharsetu_user', JSON.stringify(sessionUser));
      return { token: `mock_jwt_token_${newUser.id}`, user: sessionUser };
    }
  },

  logout: async () => {
    sessionStorage.removeItem('aharsetu_token');
    sessionStorage.removeItem('aharsetu_user');
    return { success: true };
  },

  getCurrentUser: () => {
    const userStr = sessionStorage.getItem('aharsetu_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // --- FOOD DONATION OPERATIONS ---
  createDonation: async (donationData) => {
    if (isBackendOnline) {
      const token = sessionStorage.getItem('aharsetu_token');
      const res = await fetch(`${BACKEND_URL}/donations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(donationData)
      });
      if (!res.ok) throw new Error('Could not create donation');
      return await res.json();
    } else {
      const donations = getMockData('aharsetu_donations');
      const user = JSON.parse(sessionStorage.getItem('aharsetu_user'));
      
      const newDonation = {
        id: `don_${Date.now()}`,
        donorId: user.id,
        donorName: user.name,
        donorPhone: user.phone,
        foodName: donationData.foodName,
        foodType: donationData.foodType,
        quantity: donationData.quantity,
        prepTime: donationData.prepTime,
        expiryTime: donationData.expiryTime,
        pickupAddress: donationData.pickupAddress,
        coordinates: donationData.coordinates || user.coordinates || { lat: 28.601, lng: 77.210 },
        imageUrl: donationData.imageUrl || 'https://images.unsplash.com/photo-1488459718432-01055e67e44d?q=80&w=600&auto=format&fit=crop',
        additionalNotes: donationData.additionalNotes,
        status: 'available',
        claimedByReceiverId: null,
        assignedVolunteerId: null,
        createdAt: new Date().toISOString()
      };

      donations.unshift(newDonation);
      setMockData('aharsetu_donations', donations);

      // Create a notification for admins
      const notifications = getMockData('aharsetu_notifications');
      notifications.unshift({
        id: `not_${Date.now()}`,
        userId: 'usr_admin',
        title: 'New Donation Listed!',
        message: `${user.name} listed ${donationData.quantity} of ${donationData.foodName}.`,
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString()
      });
      setMockData('aharsetu_notifications', notifications);

      return newDonation;
    }
  },

  getDonations: async () => {
    if (isBackendOnline) {
      const res = await fetch(`${BACKEND_URL}/donations`);
      return await res.json();
    } else {
      return getMockData('aharsetu_donations');
    }
  },

  claimDonation: async (donationId, receiverId) => {
    if (isBackendOnline) {
      const token = sessionStorage.getItem('aharsetu_token');
      const res = await fetch(`${BACKEND_URL}/donations/${donationId}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return await res.json();
    } else {
      const donations = getMockData('aharsetu_donations');
      const donIndex = donations.findIndex(d => d.id === donationId);
      if (donIndex === -1) throw new Error('Donation not found');

      donations[donIndex].status = 'claimed';
      donations[donIndex].claimedByReceiverId = receiverId;

      // Assign a random mock volunteer to complete the loop
      const users = getMockData('aharsetu_users');
      const volunteers = users.filter(u => u.role === 'volunteer');
      if (volunteers.length > 0) {
        donations[donIndex].assignedVolunteerId = volunteers[0].id;
      }

      setMockData('aharsetu_donations', donations);

      // Send notifications to donor and volunteer
      const donorId = donations[donIndex].donorId;
      const notifications = getMockData('aharsetu_notifications');
      
      notifications.unshift({
        id: `not_d_${Date.now()}`,
        userId: donorId,
        title: 'Food Donation Claimed',
        message: `Your food "${donations[donIndex].foodName}" has been claimed by a nearby NGO and assigned to a volunteer.`,
        type: 'success',
        isRead: false,
        createdAt: new Date().toISOString()
      });

      if (donations[donIndex].assignedVolunteerId) {
        notifications.unshift({
          id: `not_v_${Date.now()}`,
          userId: donations[donIndex].assignedVolunteerId,
          title: 'New Delivery Task',
          message: `Please pick up "${donations[donIndex].foodName}" from ${donations[donIndex].donorName} and deliver to the NGO.`,
          type: 'info',
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }

      setMockData('aharsetu_notifications', notifications);
      return donations[donIndex];
    }
  },

  updateDonationStatus: async (donationId, status) => {
    if (isBackendOnline) {
      const token = sessionStorage.getItem('aharsetu_token');
      const res = await fetch(`${BACKEND_URL}/donations/${donationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } else {
      const donations = getMockData('aharsetu_donations');
      const donIndex = donations.findIndex(d => d.id === donationId);
      if (donIndex === -1) throw new Error('Donation not found');

      donations[donIndex].status = status;
      setMockData('aharsetu_donations', donations);

      // Send alert to the receiver
      if (donations[donIndex].claimedByReceiverId) {
        const notifications = getMockData('aharsetu_notifications');
        notifications.unshift({
          id: `not_st_${Date.now()}`,
          userId: donations[donIndex].claimedByReceiverId,
          title: `Delivery status: ${status.replace('_', ' ').toUpperCase()}`,
          message: `The delivery status of "${donations[donIndex].foodName}" has been updated to "${status}".`,
          type: status === 'delivered' ? 'success' : 'info',
          isRead: false,
          createdAt: new Date().toISOString()
        });
        setMockData('aharsetu_notifications', notifications);
      }

      return donations[donIndex];
    }
  },

  deleteDonation: async (donationId) => {
    if (isBackendOnline) {
      const token = sessionStorage.getItem('aharsetu_token');
      await fetch(`${BACKEND_URL}/donations/${donationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return true;
    } else {
      let donations = getMockData('aharsetu_donations');
      donations = donations.filter(d => d.id !== donationId);
      setMockData('aharsetu_donations', donations);
      return true;
    }
  },

  // --- FOOD REQUEST OPERATIONS ---
  createRequest: async (requestData) => {
    if (isBackendOnline) {
      const token = sessionStorage.getItem('aharsetu_token');
      const res = await fetch(`${BACKEND_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });
      return await res.json();
    } else {
      const requests = getMockData('aharsetu_requests');
      const user = JSON.parse(sessionStorage.getItem('aharsetu_user'));

      const newRequest = {
        id: `req_${Date.now()}`,
        receiverId: user.id,
        organizationName: requestData.organizationName || user.name,
        contactPerson: requestData.contactPerson,
        phone: requestData.phone,
        foodRequirement: requestData.foodRequirement,
        quantityNeeded: requestData.quantityNeeded,
        beneficiaries: Number(requestData.beneficiaries),
        deliveryAddress: requestData.deliveryAddress,
        coordinates: requestData.coordinates || user.coordinates || { lat: 28.568, lng: 77.243 },
        emergencyLevel: requestData.emergencyLevel,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      requests.unshift(newRequest);
      setMockData('aharsetu_requests', requests);

      // Create an admin alert
      const notifications = getMockData('aharsetu_notifications');
      notifications.unshift({
        id: `not_req_${Date.now()}`,
        userId: 'usr_admin',
        title: `🚨 Emergency Food Request: ${requestData.emergencyLevel}`,
        message: `${newRequest.organizationName} requested ${requestData.quantityNeeded} for ${requestData.beneficiaries} people.`,
        type: 'alert',
        isRead: false,
        createdAt: new Date().toISOString()
      });
      setMockData('aharsetu_notifications', notifications);

      return newRequest;
    }
  },

  getRequests: async () => {
    if (isBackendOnline) {
      const res = await fetch(`${BACKEND_URL}/requests`);
      return await res.json();
    } else {
      return getMockData('aharsetu_requests');
    }
  },

  updateRequestStatus: async (requestId, status) => {
    if (isBackendOnline) {
      const token = sessionStorage.getItem('aharsetu_token');
      const res = await fetch(`${BACKEND_URL}/requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } else {
      const requests = getMockData('aharsetu_requests');
      const index = requests.findIndex(r => r.id === requestId);
      if (index === -1) throw new Error('Request not found');

      requests[index].status = status;
      setMockData('aharsetu_requests', requests);

      // Notify the receiver
      const notifications = getMockData('aharsetu_notifications');
      notifications.unshift({
        id: `not_req_st_${Date.now()}`,
        userId: requests[index].receiverId,
        title: `Food Request: ${status.toUpperCase()}`,
        message: `Your emergency food request has been updated to "${status}".`,
        type: status === 'fulfilled' ? 'success' : 'info',
        isRead: false,
        createdAt: new Date().toISOString()
      });
      setMockData('aharsetu_notifications', notifications);

      return requests[index];
    }
  },

  deleteRequest: async (requestId) => {
    if (isBackendOnline) {
      const token = sessionStorage.getItem('aharsetu_token');
      await fetch(`${BACKEND_URL}/requests/${requestId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return true;
    } else {
      let requests = getMockData('aharsetu_requests');
      requests = requests.filter(r => r.id !== requestId);
      setMockData('aharsetu_requests', requests);
      return true;
    }
  },

  // --- NOTIFICATION OPERATIONS ---
  getNotifications: async (userId) => {
    if (isBackendOnline) {
      const token = sessionStorage.getItem('aharsetu_token');
      const res = await fetch(`${BACKEND_URL}/notifications/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await res.json();
    } else {
      const notifications = getMockData('aharsetu_notifications');
      return notifications.filter(n => n.userId === userId || n.userId === 'all');
    }
  },

  markNotificationRead: async (notifId) => {
    if (isBackendOnline) {
      const token = sessionStorage.getItem('aharsetu_token');
      await fetch(`${BACKEND_URL}/notifications/${notifId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return true;
    } else {
      const notifications = getMockData('aharsetu_notifications');
      const index = notifications.findIndex(n => n.id === notifId);
      if (index !== -1) {
        notifications[index].isRead = true;
        setMockData('aharsetu_notifications', notifications);
      }
      return true;
    }
  },

  // --- FEEDBACK & CONTACT OPERATIONS ---
  submitFeedback: async (feedbackData) => {
    if (isBackendOnline) {
      const res = await fetch(`${BACKEND_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });
      return await res.json();
    } else {
      const feedback = getMockData('aharsetu_feedback');
      const newFeedback = {
        id: `fb_${Date.now()}`,
        ...feedbackData,
        createdAt: new Date().toISOString()
      };
      feedback.unshift(newFeedback);
      setMockData('aharsetu_feedback', feedback);
      return newFeedback;
    }
  },

  getFeedback: async () => {
    if (isBackendOnline) {
      const res = await fetch(`${BACKEND_URL}/feedback`);
      return await res.json();
    } else {
      return getMockData('aharsetu_feedback');
    }
  },

  // --- ADMIN ADMIN OPERATIONS ---
  getUsersList: async () => {
    if (isBackendOnline) {
      const token = sessionStorage.getItem('aharsetu_token');
      const res = await fetch(`${BACKEND_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await res.json();
    } else {
      return getMockData('aharsetu_users');
    }
  },

  verifyUser: async (userId, isVerified) => {
    if (isBackendOnline) {
      const token = sessionStorage.getItem('aharsetu_token');
      const res = await fetch(`${BACKEND_URL}/admin/users/${userId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isVerified })
      });
      return await res.json();
    } else {
      const users = getMockData('aharsetu_users');
      const index = users.findIndex(u => u.id === userId);
      if (index === -1) throw new Error('User not found');
      
      if (users[index].volunteerDetails) {
        users[index].volunteerDetails.isVerified = isVerified;
      }
      setMockData('aharsetu_users', users);
      return users[index];
    }
  },

  deleteUser: async (userId) => {
    if (isBackendOnline) {
      const token = sessionStorage.getItem('aharsetu_token');
      await fetch(`${BACKEND_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return true;
    } else {
      let users = getMockData('aharsetu_users');
      users = users.filter(u => u.id !== userId);
      setMockData('aharsetu_users', users);
      return true;
    }
  }
};
