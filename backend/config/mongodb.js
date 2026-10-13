import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is required. Add it to the backend environment variables.');
  }

  await mongoose.connect(mongoUri, {
    // Preserve the database used by the original application.
    dbName: process.env.MONGODB_DATABASE || 'quickcare',
    serverSelectionTimeoutMS: 15000,
  });

  console.log('MongoDB connected successfully');
};

export default connectDB;
