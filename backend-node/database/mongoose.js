const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/moodbeat';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ MongoDB conectado correctamente');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
