import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import connectDB from './config/db.js';
import Cow from './src/models/Cow.js';
import { predictCowBreed } from './src/utils/aiBreedDetection.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file upload (store in memory)
const upload = multer({ storage: multer.memoryStorage() });

// ===== TESTING ROUTES (No authentication for now) =====

// POST /api/add-cow - Create a new cow with AI breed detection
app.post('/api/add-cow', upload.single('image'), async (req, res) => {
  try {
    const { cowName, breed, age, milkProduction, price, latitude, longitude } = req.body;

    // Validate required fields
    if (!cowName || !breed || !age || !milkProduction || !price) {
      return res.status(400).json({ 
        message: 'Required fields: cowName, breed, age, milkProduction, price' 
      });
    }

    let aiBreedPrediction = {
      breed: 'Unknown',
      confidence: 0
    };

    // If image is provided, send to AI for breed prediction
    if (req.file) {
      console.log(`Processing image: ${req.file.originalname}`);
      
      const aiResult = await predictCowBreed(req.file.buffer, req.file.originalname);
      
      if (aiResult.success) {
        aiBreedPrediction = {
          breed: aiResult.breed,
          confidence: aiResult.confidence
        };
        console.log(`AI Prediction: ${aiResult.breed} (${aiResult.confidence}% confidence)`);
      } else {
        console.log(`AI prediction failed: ${aiResult.error} - Continuing with Unknown`);
      }
    }

    // Create location object if coordinates provided
    const location = latitude && longitude ? {
      type: 'Point',
      coordinates: [Number(longitude), Number(latitude)]
    } : undefined;

    // Create and save cow to MongoDB
    const cow = await Cow.create({
      cowName,
      breed,
      aiBreedPrediction,
      age: Number(age),
      milkProduction: Number(milkProduction),
      price: Number(price),
      imageURL: req.file?.filename || null,
      cloudinaryId: null,
      ...(location && { location })
    });

    res.status(201).json({ 
      message: 'Cow added successfully with AI breed detection', 
      cow 
    });
  } catch (error) {
    console.error('Error adding cow:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/cows - Fetch all cows
app.get('/api/cows', async (req, res) => {
  try {
    const cows = await Cow.find().sort({ createdAt: -1 });
    res.json({ 
      count: cows.length, 
      cows 
    });
  } catch (error) {
    console.error('Error fetching cows:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/cow/:id - Fetch single cow
app.get('/api/cow/:id', async (req, res) => {
  try {
    const cow = await Cow.findById(req.params.id);
    if (!cow) {
      return res.status(404).json({ message: 'Cow not found' });
    }
    res.json(cow);
  } catch (error) {
    console.error('Error fetching cow:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== ROOT ENDPOINT =====

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Cow Buying and Selling Marketplace API' });
});

// ===== ERROR HANDLING =====

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});