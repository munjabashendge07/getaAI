import mongoose from 'mongoose';

export const connectDB = async (): Promise<boolean> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/prompt_library';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB: ${(error as Error).message}`);
    console.warn(`[MongoDB Warning] Server will run in in-memory fallback mode for API endpoints if DB is unavailable.`);
    return false;
  }
};
