import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import {
  contactRoutes,
  duplicateRoutes,
  groupRoutes,
  interactionRoutes,
  notificationRoutes,
  relationshipRoutes,
  tagRoutes,
  taskRoutes,
} from './routes/resourceRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config({
  path: fileURLToPath(new URL('../.env', import.meta.url)),
});

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigins = new Set([
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
].filter(Boolean));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS.'));
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'sethusphere-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/duplicates', duplicateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/relationships', relationshipRoutes);

app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => app.listen(port, () => console.log(`Sethusphere API listening on port ${port}`)))
    .catch((error) => {
      console.error('Unable to start Sethusphere API:', error.message);
      process.exitCode = 1;
    });
}

export default app;
