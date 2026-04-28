import Cow from '../src/models/Cow.js';
import User from '../src/models/User.js';
import cloudinary from '../config/cloudinary.js';
import { predictCowBreed, predictCowHealth } from '../src/utils/aiBreedDetection.js';
import admin from '../src/utils/firebaseAdmin.js';

// Add cow
export const addCow = async (req, res) => {
  try {
    const { cowName, breed, age, milkProduction, price, latitude, longitude } = req.body;

    // Check required fields
    if (!cowName || !breed || !age || !milkProduction || !price || !latitude || !longitude) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // require at least one image or video file for listing
    const images = req.files?.images || [];
    const videoFile = req.files?.video?.[0];

    if (!images.length && !videoFile) {
      return res.status(400).json({ message: 'At least one image or a video is required' });
    }

    const imageUrls = [];
    let videoURL = null;

    // Upload images to Cloudinary (resource_type image)
    for (const file of images) {
      if (!file.mimetype.startsWith('image')) continue;
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'image',
        folder: 'cow-marketplace',
      });
      imageUrls.push(result.secure_url);
    }

    // Upload video (optional)
    if (videoFile && videoFile.mimetype.startsWith('video')) {
      const result = await cloudinary.uploader.upload(videoFile.path, {
        resource_type: 'video',
        folder: 'cow-marketplace',
      });
      videoURL = result.secure_url;
    }

    // AI logic: only for first image
    let aiBreedPrediction = { breed: 'Not available', confidence: 0 };
    let aiHealthStatus = { status: 'Not available', confidence: 0 };

    if (imageUrls.length && images[0]) {
      const firstImage = images[0];
      const breedResult = await predictCowBreed(firstImage.buffer, firstImage.originalname);
      aiBreedPrediction = {
        breed: breedResult.success ? breedResult.breed : 'Unknown',
        confidence: breedResult.success ? breedResult.confidence : 0,
      };

      const healthResult = await predictCowHealth(firstImage.buffer, firstImage.originalname);
      aiHealthStatus = {
        status: healthResult.success ? healthResult.status : 'Unknown',
        confidence: healthResult.success ? healthResult.confidence : 0,
      };
    }

    // Create cow record
    const cow = await Cow.create({
      cowName,
      breed,
      aiBreedPrediction,
      aiHealthStatus,
      images: imageUrls,
      videoURL,
      age: Number(age),
      milkProduction: Number(milkProduction),
      price: Number(price),
      location: {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)],
      },
      sellerId: req.user?.id ?? null,
    });

    // Send push notification to all users with FCM tokens
    try {
      const usersWithTokens = await User.find({ fcmToken: { $ne: null } });
      const tokens = usersWithTokens.map(user => user.fcmToken);

      if (tokens.length > 0) {
        const message = {
          notification: {
            title: '🐄 New Cow Added',
            body: `A new ${cow.breed} cow is available near you!`,
          },
          tokens: tokens,
        };

        await admin.messaging().sendMulticast(message);
        console.log('Push notifications sent to', tokens.length, 'users');
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
    }

    res.status(201).json(cow);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all cows
export const getAllCows = async (req, res) => {
  try {
    const { breed, minPrice, maxPrice } = req.query;
    const filter = {};

    if (breed) {
      filter.breed = breed;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const cows = await Cow.find(filter).sort({ createdAt: -1 });
    res.json(cows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single cow
export const getCow = async (req, res) => {
  try {
    const cow = await Cow.findById(req.params.id);
    if (!cow) {
      return res.status(404).json({ message: 'Cow not found' });
    }
    res.json(cow);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit cow
export const editCow = async (req, res) => {
  try {
    const cow = await Cow.findById(req.params.id);
    if (!cow) {
      return res.status(404).json({ message: 'Cow not found' });
    }

    // Check if user is the seller
    if (cow.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update fields
    const updatableFields = ['cowName', 'breed', 'age', 'milkProduction', 'price'];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        cow[field] = req.body[field];
      }
    });

    await cow.save();
    res.json(cow);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete cow
export const deleteCow = async (req, res) => {
  try {
    const cow = await Cow.findById(req.params.id);
    if (!cow) {
      return res.status(404).json({ message: 'Cow not found' });
    }

    // Check if user is the seller
    if (cow.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete image from Cloudinary
    try {
      await cloudinary.uploader.destroy(cow.cloudinaryId);
    } catch (error) {
      console.error('Cloudinary delete failed:', error);
    }

    // Delete cow from database
    await cow.deleteOne();
    res.json({ message: 'Cow deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get nearby cows
export const getNearbyCows = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ message: 'lat and lng are required' });
    }

    const center = [Number(lng), Number(lat)];
    const maxDistance = Number(radius) || 20000; // default 20km

    if (Number.isNaN(center[0]) || Number.isNaN(center[1]) || Number.isNaN(maxDistance)) {
      return res.status(400).json({ message: 'lat, lng, and radius must be numbers' });
    }

    const cows = await Cow.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: center },
          distanceField: 'distance',
          spherical: true,
          maxDistance,
        },
      },
      {
        $sort: { distance: 1 },
      },
    ]);

    const response = cows.map((cow) => ({
      ...cow,
      distanceKm: (cow.distance / 1000).toFixed(2),
    }));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};