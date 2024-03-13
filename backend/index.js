import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Import Routes
import { userRoutes } from './routes/userRoute.js';
import { followRoutes } from './routes/followRoute.js';
import { postRoutes } from './routes/postRoute.js';
import { adminRoutes } from './routes/adminRoute.js';

const PORT = process.env.PORT;

// Routes
app.use('/api/user', userRoutes);
app.use('/api/user', followRoutes);
app.use('/api/post', postRoutes);
app.use('/api/admin', adminRoutes);

const connect = async () => {
    await mongoose.connect(process.env.DB_URL);
    try {
        console.log('Connected to Database');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error(`Error connecting to the database: ${err.message}`);
        throw new Error(`Error connecting to the database: ${err.message}`);
    }
}

connect();

// Error Handling
app.use = (err, req, res, next) => {
    res.status(500).send({ message: err.message });
};