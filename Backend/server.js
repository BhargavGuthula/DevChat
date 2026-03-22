import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors'

dotenv.config();
connectDB();

const app = express();
app.use(cors());  
app.use(express.json());


app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('DevChat API running...'));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);