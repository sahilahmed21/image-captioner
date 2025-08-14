import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import imageRoutes from '../routes/imageRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/images', imageRoutes);

app.use('/api', imageRoutes);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
    res.send('Welcome to the Image Captioner API');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});