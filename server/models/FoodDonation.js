const mongoose = require('mongoose');

const FoodDonationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  donorName: {
    type: String,
    required: true,
  },
  donorPhone: {
    type: String,
    required: true,
  },
  foodName: {
    type: String,
    required: [true, 'Please add a food title'],
    trim: true,
  },
  foodType: {
    type: String,
    enum: ['Veg', 'Non-Veg', 'Vegan', 'Dry Ration'],
    required: [true, 'Please select a food type'],
  },
  quantity: {
    type: String,
    required: [true, 'Please add a quantity (e.g. 20 meals, 10kg)'],
  },
  prepTime: {
    type: Date,
    required: [true, 'Please add food preparation time'],
  },
  expiryTime: {
    type: Date,
    required: [true, 'Please add food expiration time'],
  },
  pickupAddress: {
    type: String,
    required: [true, 'Please add a pickup address'],
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  imageUrl: {
    type: String,
    default: ''
  },
  additionalNotes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'picked_up', 'delivered'],
    default: 'available',
  },
  claimedByReceiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  assignedVolunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FoodDonation', FoodDonationSchema);
