const mongoose = require('mongoose');

module.exports = async function connectDb() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI not set in environment');
  }
  await mongoose.connect(uri);
  console.log('MongoDB connected');
};
