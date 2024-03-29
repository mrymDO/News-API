import "express-async-errors";
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import articleRoute from './routes/articleRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import { authenticateToken } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.MONGODB_URI;

(async () => {
    try {
        await mongoose.connect(CONNECTION_URL);

        app.get('/', authenticateToken, (req, res) => {
            res.send('Hello!');
        });

        app.use('/', authRoutes);
        app.use('/user', userRoutes);
        app.use('/article', articleRoute);
        app.use('/category', categoryRoutes);
        app.use('/reviews', reviewRoutes);
        app.use('/likes', likeRoutes);

        // Serve Swagger UI
        app.use('/api-docs', swaggerUi.serve);
        app.get('/api-docs', swaggerUi.setup(swaggerSpec));

        app.use((err, req, res, next) => {
            console.error(err.message);
            res.status(500).send('Server Error');
        });

        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        });
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
})();

export default app;