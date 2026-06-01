const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['donor', 'receiver', 'volunteer', 'admin'],
    required: [true, 'Please select a role'],
  },
  phone: {
    type: String,
    required: [true, 'Please add a contact number'],
  },
  address: {
    type: String,
    required: [true, 'Please add a physical address'],
  },
  coordinates: {
    lat: { type: Number, default: 28.6139 }, // Default coordinates (e.g. New Delhi)
    lng: { type: Number, default: 77.2090 }
  },
  // Sub-profiles based on roles
  donorDetails: {
    donorType: {
      type: String,
      enum: ['individual', 'restaurant', 'hotel', 'caterer', 'other'],
      default: 'individual'
    }
  },
  receiverDetails: {
    organizationName: { type: String },
    beneficiariesCount: { type: Number, default: 0 }
  },
  volunteerDetails: {
    experience: { type: String, default: '' },
    idProofUrl: { type: String, default: '' },
    availability: { type: [String], default: [] }, // Days/Times
    serviceArea: { type: String, default: '' },
    isVerified: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
