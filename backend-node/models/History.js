const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  email: { type: String, required: true },
  prompt: { type: String, required: true },
  emotion: { type: String, required: true },
  recommendations: [
    {
      name: String,
      url: String,
      image: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);
