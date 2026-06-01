const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  isTestimonial: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
