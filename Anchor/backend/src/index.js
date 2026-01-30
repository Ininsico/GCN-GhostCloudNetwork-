import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import { rateLimiter } from './middleware/rateLimit.middleware.js';

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting (Global)
const globalLimiter = rateLimiter(100, 15); // 100 requests per 15 minutes
app.use('/api', globalLimiter);

// Routes
app.use('/api/v1/auth', authRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
