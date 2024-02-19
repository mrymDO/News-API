import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

const CONNECTION_URL = process.env.MONGODB_URI;

app.get('/', (req, res) => {
    res.send('Hello!');
});

mongoose.connect(
    CONNECTION_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
    .then (() => app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`)
    }))
    .catch ((error) => console.log(error.message));

