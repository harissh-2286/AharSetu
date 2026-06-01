const mongoose = require('mongoose');

const FoodRequestSchema = new mongoose.Schema({
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  organizationName: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  foodRequirement: {
    type: String,
    required: [true, 'Please add food requirement details'],
  },
  quantityNeeded: {
    type: String,
    required: [true, 'Please specify quantity needed'],
  },
  beneficiaries: {
    type: Number,
    required: [true, 'Please specify number of beneficiaries'],
    min: [1, 'Must be at least 1 beneficiary']
  },
  deliveryAddress: {
    type: String,
    required: [true, 'Please specify delivery address'],
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  emergencyLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'assigned', 'fulfilled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FoodRequest', FoodRequestSchema);
