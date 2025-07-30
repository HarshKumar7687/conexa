// backend/index.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './utils/db.js';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js';
import { app, server } from './socket/socket.js';
import path from 'path';

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// 1. Middleware Setup
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 2. CORS Setup
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000'  // production built frontend served from same server
  ],
  credentials: true,
};
app.use(cors(corsOptions));

// 3. API Routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/message', messageRoute);

// 4. Static File Serving (Production)
app.use(express.static(path.join(__dirname, '/frontend/dist')));

// 5. Catch-all for frontend routes (React Router support)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
});

// 6. Server + DB Startup
server.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
