import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

import chatRoutes from './routes/chatRoutes';
import systemControlRoutes from './routes/systemControlRoutes';
import productivityRoutes from './routes/productivityRoutes';
import authRoutes from './routes/authRoutes';

// Basic Route
app.get('/api', (req: Request, res: Response) => {
  res.send('Jarvis Backend is running!');
});

// API Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/chat', chatRoutes);
app.use('/api/system', systemControlRoutes);
app.use('/api/productivity', productivityRoutes);


// MongoDB Connection
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
