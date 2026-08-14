import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[Server] AI Prompt Library API server running on port ${PORT}`);
    console.log(`[Server] API Base URL: http://localhost:${PORT}/api/prompts`);
  });
};

startServer();
