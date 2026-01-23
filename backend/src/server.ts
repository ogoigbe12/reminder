import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import reminderRoutes from './routes/reminder.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/reminders', reminderRoutes);

app.get('/', (req, res) => {
    res.send('Reminder API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
