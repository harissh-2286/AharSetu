const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyforaharsetu';

// Enable middlewares
app.use(cors());
app.use(express.json());

// Import Mongoose Models
const User = require('./models/User');
const FoodDonation = require('./models/FoodDonation');
const FoodRequest = require('./models/FoodRequest');
const Notification = require('./models/Notification');
const Feedback = require('./models/Feedback');

// Global Database State Tracker
let useMongooseDB = false;

// Mock local arrays for zero-dependency local running fallback
let mockUsers = [
  {
    _id: 'usr_admin',
    name: 'Aditya Sharma',
    email: 'admin@aharsetu.org',
    password: 'password123', // stored as raw or hashed in mock mode
    role: 'admin',
    phone: '+91 98765 43210',
    address: 'AharSetu Central HQ, Connaught Place, New Delhi',
    coordinates: { lat: 28.6289, lng: 77.2150 }
  },
  {
    _id: 'usr_donor1',
    name: 'Taj Palace Culinary Kitchen',
    email: 'donor@taj.com',
    password: 'password123',
    role: 'donor',
    phone: '+91 88888 77777',
    address: 'Sardar Patel Marg, Diplomatic Enclave, New Delhi',
    coordinates: { lat: 28.5990, lng: 77.1780 },
    donorDetails: { donorType: 'hotel' }
  },
  {
    _id: 'usr_donor2',
    name: 'The Organic Gourmet Bistro',
    email: 'bistro@organic.com',
    password: 'password123',
    role: 'donor',
    phone: '+91 99999 88888',
    address: 'Khan Market, Rabindra Nagar, New Delhi',
    coordinates: { lat: 28.6002, lng: 77.2272 },
    donorDetails: { donorType: 'restaurant' }
  },
  {
    _id: 'usr_receiver1',
    name: 'Hope Foundation Shelter',
    email: 'receiver@hope.org',
    password: 'password123',
    role: 'receiver',
    phone: '+91 77777 66666',
    address: 'Sewa Kutir Complex, Kingsway Camp, Delhi',
    coordinates: { lat: 28.6948, lng: 77.2085 },
    receiverDetails: { organizationName: 'Hope Foundation NGO', beneficiariesCount: 150 }
  },
  {
    _id: 'usr_receiver2',
    name: 'Nanhi Jaan Child Welfare',
    email: 'nanhi@childcare.org',
    password: 'password123',
    role: 'receiver',
    phone: '+91 66666 55555',
    address: 'Lajpat Nagar IV, New Delhi',
    coordinates: { lat: 28.5682, lng: 77.2435 },
    receiverDetails: { organizationName: 'Nanhi Jaan Welfare', beneficiariesCount: 85 }
  },
  {
    _id: 'usr_volunteer1',
    name: 'Kabir Mehta',
    email: 'volunteer@gmail.com',
    password: 'password123',
    role: 'volunteer',
    phone: '+91 95555 44444',
    address: 'M-Block, Greater Kailash II, New Delhi',
    coordinates: { lat: 28.5320, lng: 77.2480 },
    volunteerDetails: {
      experience: '3 years in community food drives. Dedicated to local distribution.',
      idProofUrl: 'verified_id.png',
      availability: ['Weekend Morning', 'Weekday Evening'],
      serviceArea: 'South Delhi Range',
      isVerified: true
    }
  },
  {
    _id: 'usr_volunteer2',
    name: 'Riya Sen',
    email: 'riya@volunteer.org',
    password: 'password123',
    role: 'volunteer',
    phone: '+91 94444 33333',
    address: 'Karol Bagh, New Delhi',
    coordinates: { lat: 28.6442, lng: 77.1878 },
    volunteerDetails: {
      experience: 'New volunteer eager to optimize recovery logistics and map routes.',
      idProofUrl: 'verified_id_2.png',
      availability: ['Flexible Hours'],
      serviceArea: 'Central Delhi',
      isVerified: true
    }
  }
];

let mockDonations = [
  {
    _id: 'don_01',
    donorId: 'usr_donor1',
    donorName: 'Taj Palace Culinary Kitchen',
    donorPhone: '+91 88888 77777',
    foodName: 'Premium Basmati Rice & Mixed Vegetable Korma',
    foodType: 'Veg',
    quantity: '60 Meals',
    prepTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    pickupAddress: 'Sardar Patel Marg, Diplomatic Enclave, New Delhi',
    coordinates: { lat: 28.5990, lng: 77.1780 },
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop',
    additionalNotes: 'Fresh surplus packed in standard commercial containers.',
    status: 'available',
    claimedByReceiverId: null,
    assignedVolunteerId: null,
    createdAt: new Date().toISOString()
  }
];

let mockRequests = [
  {
    _id: 'req_01',
    receiverId: 'usr_receiver1',
    organizationName: 'Hope Foundation NGO',
    contactPerson: 'Sister Evelyn',
    phone: '+91 77777 66666',
    foodRequirement: 'Prepared meals for elderly shelter residents.',
    quantityNeeded: '100 Meals',
    beneficiaries: 120,
    deliveryAddress: 'Sewa Kutir Complex, Kingsway Camp, Delhi',
    coordinates: { lat: 28.6948, lng: 77.2085 },
    emergencyLevel: 'High',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

let mockNotifications = [];
let mockFeedback = [
  {
    _id: 'fb_01',
    name: 'Chef Rajesh Khanna',
    email: 'rajesh@tajpalace.com',
    message: 'AharSetu has completely transformed how we handle corporate buffet overflows. Highly efficient!',
    rating: 5,
    isTestimonial: true,
    createdAt: new Date().toISOString()
  }
];

// Initialize local notifications
mockNotifications.unshift({
  _id: `not_${Date.now()}`,
  userId: 'usr_donor1',
  title: 'Donation Completed!',
  message: 'Your surplus food has been successfully delivered. Thank you!',
  type: 'success',
  isRead: false,
  createdAt: new Date().toISOString()
});

// Try to connect to Mongoose Database
const connectDB = async () => {
  const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/aharsetu';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2000 // 2 seconds timeout to trigger fallback
    });
    useMongooseDB = true;
    console.log('✅ Connected to MongoDB. Using Mongoose schemas.');
  } catch (err) {
    useMongooseDB = false;
    console.log('⚠️ MongoDB not detected or timeout reached. Gracefully falling back to zero-dependency Local In-Memory JSON mode.');
  }
};
connectDB();

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    mode: useMongooseDB ? 'mongoose_fullstack' : 'in_memory_fallback',
    time: new Date().toISOString()
  });
});

// Token Authenticator Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Authorization token required' });

  // Handle Mock tokens in in-memory mode
  if (token.startsWith('mock_jwt_token_')) {
    const mockId = token.replace('mock_jwt_token_', '');
    const user = mockUsers.find(u => u._id === mockId);
    if (!user) return res.status(403).json({ message: 'Invalid session token' });
    req.user = { id: user._id, role: user.role, name: user.name, phone: user.phone };
    return next();
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    
    if (useMongooseDB) {
      try {
        const found = await User.findById(decoded.id);
        if (!found) return res.status(404).json({ message: 'User account not found' });
        req.user = { id: found._id, role: found.role, name: found.name, phone: found.phone };
        next();
      } catch (err) {
        res.status(500).json({ message: 'Authentication error' });
      }
    } else {
      const user = mockUsers.find(u => u._id === decoded.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      req.user = { id: user._id, role: user.role, name: user.name, phone: user.phone };
      next();
    }
  });
};

// --- AUTH ROUTER ---
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role, phone, address, coordinates, donorDetails, receiverDetails, volunteerDetails } = req.body;

  if (useMongooseDB) {
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'Email address already registered' });

      user = new User({
        name,
        email,
        password,
        role,
        phone,
        address,
        coordinates,
        donorDetails,
        receiverDetails,
        volunteerDetails
      });

      await user.save();
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      
      const resUser = user.toObject();
      delete resUser.password;
      res.status(201).json({ token, user: { id: resUser._id, ...resUser } });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    // In-memory registration
    if (mockUsers.find(u => u.email === email)) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const newId = `usr_${Date.now()}`;
    const mockUser = {
      _id: newId,
      name,
      email,
      password, // in mock mode we store as raw plaintext for simple console debugging
      role,
      phone,
      address,
      coordinates: coordinates || { lat: 28.6139, lng: 77.2090 },
      donorDetails,
      receiverDetails,
      volunteerDetails: volunteerDetails ? { ...volunteerDetails, isVerified: false } : undefined
    };
    mockUsers.push(mockUser);
    const mockToken = `mock_jwt_token_${newId}`;
    const sessionUser = { ...mockUser };
    delete sessionUser.password;
    res.status(201).json({ token: mockToken, user: { id: sessionUser._id, ...sessionUser } });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (useMongooseDB) {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      const resUser = user.toObject();
      delete resUser.password;
      res.json({ token, user: { id: resUser._id, ...resUser } });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    // In-memory authentication
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const mockToken = `mock_jwt_token_${user._id}`;
    const sessionUser = { ...user };
    delete sessionUser.password;
    res.json({ token: mockToken, user: { id: sessionUser._id, ...sessionUser } });
  }
});

// --- FOOD DONATION ROUTER ---
app.post('/api/donations', authenticateToken, async (req, res) => {
  const { foodName, foodType, quantity, prepTime, expiryTime, pickupAddress, coordinates, imageUrl, additionalNotes } = req.body;

  if (useMongooseDB) {
    try {
      const newDonation = new FoodDonation({
        donorId: req.user.id,
        donorName: req.user.name,
        donorPhone: req.user.phone,
        foodName,
        foodType,
        quantity,
        prepTime,
        expiryTime,
        pickupAddress,
        coordinates,
        imageUrl,
        additionalNotes
      });

      await newDonation.save();

      // Create Admin notification alert
      const alertNotif = new Notification({
        userId: 'usr_admin',
        title: 'New Donation Listed!',
        message: `${req.user.name} listed ${quantity} of ${foodName}.`,
        type: 'info'
      });
      await alertNotif.save();

      res.status(201).json({ id: newDonation._id, ...newDonation.toObject() });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    // In-memory donation post
    const newId = `don_${Date.now()}`;
    const newDonation = {
      _id: newId,
      id: newId,
      donorId: req.user.id,
      donorName: req.user.name,
      donorPhone: req.user.phone,
      foodName,
      foodType,
      quantity,
      prepTime,
      expiryTime,
      pickupAddress,
      coordinates: coordinates || { lat: 28.6, lng: 77.2 },
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      additionalNotes,
      status: 'available',
      claimedByReceiverId: null,
      assignedVolunteerId: null,
      createdAt: new Date().toISOString()
    };
    mockDonations.unshift(newDonation);

    // Dispatch admin notification
    mockNotifications.unshift({
      _id: `not_${Date.now()}`,
      userId: 'usr_admin',
      title: 'New Donation Listed!',
      message: `${req.user.name} listed ${quantity} of ${foodName}.`,
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.status(201).json(newDonation);
  }
});

app.get('/api/donations', async (req, res) => {
  if (useMongooseDB) {
    try {
      const list = await FoodDonation.find().sort({ createdAt: -1 });
      const converted = list.map(d => ({ id: d._id, ...d.toObject() }));
      res.json(converted);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.json(mockDonations.map(d => ({ id: d._id, ...d })));
  }
});

app.post('/api/donations/:id/claim', authenticateToken, async (req, res) => {
  const donationId = req.params.id;

  if (useMongooseDB) {
    try {
      const don = await FoodDonation.findById(donationId);
      if (!don) return res.status(404).json({ message: 'Donation not found' });

      don.status = 'claimed';
      don.claimedByReceiverId = req.user.id;

      // Assign a volunteer if exists
      const volunteer = await User.findOne({ role: 'volunteer', 'volunteerDetails.isVerified': true });
      if (volunteer) {
        don.assignedVolunteerId = volunteer._id;
      }

      await don.save();

      // Trigger notification for Donor
      const notifDonor = new Notification({
        userId: don.donorId,
        title: 'Food Donation Claimed',
        message: `Your food "${don.foodName}" has been claimed by a nearby NGO and assigned to a volunteer.`,
        type: 'success'
      });
      await notifDonor.save();

      if (don.assignedVolunteerId) {
        const notifVolunteer = new Notification({
          userId: don.assignedVolunteerId,
          title: 'New Delivery Task',
          message: `Please pick up "${don.foodName}" from ${don.donorName} and deliver to the NGO.`,
          type: 'info'
        });
        await notifVolunteer.save();
      }

      res.json({ id: don._id, ...don.toObject() });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    // In-memory claim handler
    const don = mockDonations.find(d => d._id === donationId);
    if (!don) return res.status(404).json({ message: 'Donation not found' });

    don.status = 'claimed';
    don.claimedByReceiverId = req.user.id;

    // Assign volunteer
    const vol = mockUsers.find(u => u.role === 'volunteer');
    if (vol) {
      don.assignedVolunteerId = vol._id;
    }

    mockNotifications.unshift({
      _id: `not_${Date.now()}`,
      userId: don.donorId,
      title: 'Food Donation Claimed',
      message: `Your food "${don.foodName}" has been claimed by a nearby NGO and assigned to a volunteer.`,
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    if (don.assignedVolunteerId) {
      mockNotifications.unshift({
        _id: `not_v_${Date.now()}`,
        userId: don.assignedVolunteerId,
        title: 'New Delivery Task',
        message: `Please pick up "${don.foodName}" from ${don.donorName} and deliver to the NGO.`,
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    res.json({ id: don._id, ...don });
  }
});

app.put('/api/donations/:id/status', authenticateToken, async (req, res) => {
  const donationId = req.params.id;
  const { status } = req.body;

  if (useMongooseDB) {
    try {
      const don = await FoodDonation.findById(donationId);
      if (!don) return res.status(404).json({ message: 'Donation not found' });

      don.status = status;
      await don.save();

      if (don.claimedByReceiverId) {
        const notif = new Notification({
          userId: don.claimedByReceiverId,
          title: `Delivery status: ${status.replace('_', ' ').toUpperCase()}`,
          message: `The delivery status of "${don.foodName}" has been updated to "${status}".`,
          type: status === 'delivered' ? 'success' : 'info'
        });
        await notif.save();
      }

      res.json({ id: don._id, ...don.toObject() });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    // In-memory status updating
    const don = mockDonations.find(d => d._id === donationId);
    if (!don) return res.status(404).json({ message: 'Donation not found' });

    don.status = status;

    if (don.claimedByReceiverId) {
      mockNotifications.unshift({
        _id: `not_${Date.now()}`,
        userId: don.claimedByReceiverId,
        title: `Delivery status: ${status.replace('_', ' ').toUpperCase()}`,
        message: `The delivery status of "${don.foodName}" has been updated to "${status}".`,
        type: status === 'delivered' ? 'success' : 'info',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    res.json({ id: don._id, ...don });
  }
});

app.delete('/api/donations/:id', authenticateToken, async (req, res) => {
  const donationId = req.params.id;

  if (useMongooseDB) {
    try {
      await FoodDonation.findByIdAndDelete(donationId);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    mockDonations = mockDonations.filter(d => d._id !== donationId);
    res.json({ success: true });
  }
});

// --- FOOD REQUEST ROUTER ---
app.post('/api/requests', authenticateToken, async (req, res) => {
  const { organizationName, contactPerson, phone, foodRequirement, quantityNeeded, beneficiaries, deliveryAddress, coordinates, emergencyLevel } = req.body;

  if (useMongooseDB) {
    try {
      const newReq = new FoodRequest({
        receiverId: req.user.id,
        organizationName,
        contactPerson,
        phone,
        foodRequirement,
        quantityNeeded,
        beneficiaries: Number(beneficiaries),
        deliveryAddress,
        coordinates,
        emergencyLevel
      });

      await newReq.save();

      // Trigger admin alert
      const adminNotif = new Notification({
        userId: 'usr_admin',
        title: `🚨 Emergency Food Request: ${emergencyLevel}`,
        message: `${organizationName} requested ${quantityNeeded} for ${beneficiaries} residents.`,
        type: 'alert'
      });
      await adminNotif.save();

      res.status(201).json({ id: newReq._id, ...newReq.toObject() });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    // In-memory request post
    const newId = `req_${Date.now()}`;
    const newRequest = {
      _id: newId,
      id: newId,
      receiverId: req.user.id,
      organizationName,
      contactPerson,
      phone,
      foodRequirement,
      quantityNeeded,
      beneficiaries: Number(beneficiaries),
      deliveryAddress,
      coordinates: coordinates || { lat: 28.5, lng: 77.25 },
      emergencyLevel,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    mockRequests.unshift(newRequest);

    mockNotifications.unshift({
      _id: `not_req_${Date.now()}`,
      userId: 'usr_admin',
      title: `🚨 Emergency Food Request: ${emergencyLevel}`,
      message: `${organizationName} requested ${quantityNeeded} for ${beneficiaries} residents.`,
      type: 'alert',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.status(201).json(newRequest);
  }
});

app.get('/api/requests', async (req, res) => {
  if (useMongooseDB) {
    try {
      const list = await FoodRequest.find().sort({ createdAt: -1 });
      res.json(list.map(r => ({ id: r._id, ...r.toObject() })));
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.json(mockRequests.map(r => ({ id: r._id, ...r })));
  }
});

app.put('/api/requests/:id/status', authenticateToken, async (req, res) => {
  const requestId = req.params.id;
  const { status } = req.body;

  if (useMongooseDB) {
    try {
      const reqDoc = await FoodRequest.findById(requestId);
      if (!reqDoc) return res.status(404).json({ message: 'Request not found' });

      reqDoc.status = status;
      await reqDoc.save();

      const notif = new Notification({
        userId: reqDoc.receiverId,
        title: `Food Request: ${status.toUpperCase()}`,
        message: `Your emergency food request has been updated to "${status}".`,
        type: status === 'fulfilled' ? 'success' : 'info'
      });
      await notif.save();

      res.json({ id: reqDoc._id, ...reqDoc.toObject() });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    const reqDoc = mockRequests.find(r => r._id === requestId);
    if (!reqDoc) return res.status(404).json({ message: 'Request not found' });

    reqDoc.status = status;

    mockNotifications.unshift({
      _id: `not_${Date.now()}`,
      userId: reqDoc.receiverId,
      title: `Food Request: ${status.toUpperCase()}`,
      message: `Your emergency food request has been updated to "${status}".`,
      type: status === 'fulfilled' ? 'success' : 'info',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.json({ id: reqDoc._id, ...reqDoc });
  }
});

app.delete('/api/requests/:id', authenticateToken, async (req, res) => {
  const requestId = req.params.id;

  if (useMongooseDB) {
    try {
      await FoodRequest.findByIdAndDelete(requestId);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    mockRequests = mockRequests.filter(r => r._id !== requestId);
    res.json({ success: true });
  }
});

// --- NOTIFICATION ROUTER ---
app.get('/api/notifications/:userId', authenticateToken, async (req, res) => {
  const userId = req.params.userId;

  if (useMongooseDB) {
    try {
      const list = await Notification.find({ userId }).sort({ createdAt: -1 });
      res.json(list.map(n => ({ id: n._id, ...n.toObject() })));
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    const list = mockNotifications.filter(n => n.userId === userId || n.userId === 'all');
    res.json(list.map(n => ({ id: n._id, ...n })));
  }
});

app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  const notifId = req.params.id;

  if (useMongooseDB) {
    try {
      await Notification.findByIdAndUpdate(notifId, { isRead: true });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    const notif = mockNotifications.find(n => n._id === notifId);
    if (notif) notif.isRead = true;
    res.json({ success: true });
  }
});

// --- FEEDBACK ROUTER ---
app.post('/api/feedback', async (req, res) => {
  const { name, email, message, rating, isTestimonial } = req.body;

  if (useMongooseDB) {
    try {
      const newFb = new Feedback({
        name,
        email,
        message,
        rating: Number(rating) || 5,
        isTestimonial: !!isTestimonial
      });
      await newFb.save();
      res.status(201).json({ id: newFb._id, ...newFb.toObject() });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    const newId = `fb_${Date.now()}`;
    const newFb = {
      _id: newId,
      id: newId,
      name,
      email,
      message,
      rating: Number(rating) || 5,
      isTestimonial: !!isTestimonial,
      createdAt: new Date().toISOString()
    };
    mockFeedback.unshift(newFb);
    res.status(201).json(newFb);
  }
});

app.get('/api/feedback', async (req, res) => {
  if (useMongooseDB) {
    try {
      const list = await Feedback.find().sort({ createdAt: -1 });
      res.json(list.map(f => ({ id: f._id, ...f.toObject() })));
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.json(mockFeedback.map(f => ({ id: f._id, ...f })));
  }
});

// --- ADMIN USERS console ---
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden admin utility' });

  if (useMongooseDB) {
    try {
      const list = await User.find();
      res.json(list.map(u => ({ id: u._id, ...u.toObject() })));
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.json(mockUsers.map(u => ({ id: u._id, ...u })));
  }
});

app.put('/api/admin/users/:id/verify', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const userId = req.params.id;
  const { isVerified } = req.body;

  if (useMongooseDB) {
    try {
      const usr = await User.findById(userId);
      if (!usr) return res.status(404).json({ message: 'User not found' });

      if (usr.volunteerDetails) {
        usr.volunteerDetails.isVerified = isVerified;
      }
      await usr.save();
      res.json({ id: usr._id, ...usr.toObject() });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    const usr = mockUsers.find(u => u._id === userId);
    if (!usr) return res.status(404).json({ message: 'User not found' });

    if (usr.volunteerDetails) {
      usr.volunteerDetails.isVerified = isVerified;
    }
    res.json({ id: usr._id, ...usr });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const userId = req.params.id;

  if (useMongooseDB) {
    try {
      await User.findByIdAndDelete(userId);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    mockUsers = mockUsers.filter(u => u._id !== userId);
    res.json({ success: true });
  }
});

// Launch server listener
app.listen(PORT, () => {
  console.log(`🚀 AharSetu Core API Server listening on port ${PORT}`);
});
