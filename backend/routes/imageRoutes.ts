import { Router, Request, Response } from 'express';
import axios from 'axios';
import upload from '../middleware/upload';
import { addImage, getAllImages } from '../models/imageModel';
import path from 'path';

const router = Router();
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';

// POST /upload
router.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const imagePath = req.file.path;

    try {
        // 1. Send image path to Python service
        console.log(`Sending request to Python service at ${PYTHON_SERVICE_URL}/caption`);
        const captionResponse = await axios.post(`${PYTHON_SERVICE_URL}/caption`, {
            image_path: imagePath,
        });
        const { caption } = captionResponse.data;

        // 2. Save image URL and caption to the database
        // We serve the 'uploads' folder statically, so the URL is /uploads/<filename>
        const imageUrl = `/uploads/${path.basename(imagePath)}`;
        const newImageRecord = await addImage(imageUrl, caption);

        // 3. Return the complete record to the frontend
        res.status(201).json(newImageRecord);
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Failed to process image and generate caption.' });
    }
});

// GET /images
router.get('/images', async (req: Request, res: Response) => {
    try {
        const images = await getAllImages();
        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Failed to fetch images.' });
    }
});

export default router;