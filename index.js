import "express-async-errors";
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/authRoutes.js';
import { authenticateToken } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

const CONNECTION_URL = process.env.MONGODB_URI;

app.get('/', authenticateToken, (req, res) => {
    res.send('Hello!');
});

app.use('/user', userRoutes);

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).send('Server Error');
});

(async function () {
    try {
        await mongoose.connect(CONNECTION_URL);
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`)
        });
    } catch (error) {
        console.error(error.message)
    }
})()
