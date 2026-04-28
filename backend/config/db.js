import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,        // Connection pool for reuse across requests
      minPoolSize: 2,         // Pre-warmed connections for faster responses
      maxIdleTimeMS: 60000,   // Close idle connections after 1 minute
      connectTimeoutMS: 10000, // 10 second timeout for initial connection
      socketTimeoutMS: 45000, // 45 second socket timeout for operations
      serverSelectionTimeoutMS: 5000, // 5 second timeout for server selection
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;