const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // We will use a local database for simplicity. 
    // If you have MongoDB Compass installed, this works instantly.
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/career-ai');
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;