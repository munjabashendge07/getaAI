import express, { Application } from 'express';
import cors from 'cors';
import promptRoutes from './routes/promptRoutes';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: '*', // Allow client connections
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/prompts', promptRoutes);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Error Middleware
app.use(errorHandler);

export default app;
