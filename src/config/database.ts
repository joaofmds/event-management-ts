import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/meudb',
    );
  } catch (error) {
    if (error) {
      console.error('Error to connect:', error);
      if (process.env.NODE_ENV === 'test') {
        throw error;
      }
    }
    process.exit(1);
  }
};
