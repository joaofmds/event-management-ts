import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import userRoutes from './routes/user.routes';
import eventRoutes from './routes/event.routes';

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use('/users', userRoutes);
app.use('/events', eventRoutes);

export default app;
