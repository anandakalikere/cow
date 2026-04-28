# AI Breed Detection - Code Reference

## File: src/utils/aiBreedDetection.js

```javascript
import axios from 'axios';
import FormData from 'form-data';

/**
 * Send image to AI API for breed prediction
 * @param {Buffer} imageBuffer - Image file buffer from multer
 * @param {string} fileName - Original file name
 * @returns {Promise} - AI prediction response {breed, confidence}
 */
export const predictCowBreed = async (imageBuffer, fileName) => {
  try {
    const AI_API_URL = process.env.AI_API_URL || 'http://localhost:8000';
    
    // Create form data
    const formData = new FormData();
    formData.append('file', imageBuffer, {
      filename: fileName,
      contentType: 'image/jpeg'
    });

    // Call AI API
    const response = await axios.post(`${AI_API_URL}/predict-breed`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000
    });

    const { breed, confidence } = response.data;

    return {
      success: true,
      breed: breed || 'Unknown',
      confidence: confidence || 0
    };
  } catch (error) {
    console.error('AI Breed Detection Error:', error.message);
    
    // Graceful fallback if AI fails
    return {
      success: false,
      breed: 'Unknown',
      confidence: 0,
      error: error.message
    };
  }
};
```

---

## File: src/models/Cow.js (Updated Schema)

```javascript
const cowSchema = new mongoose.Schema(
  {
    cowName: { type: String, required: true },
    breed: { type: String, required: true },
    aiBreedPrediction: {
      breed: { type: String, default: 'Unknown' },
      confidence: { type: Number, default: 0 },
    },
    age: { type: Number, required: true },
    milkProduction: { type: Number, required: true },
    price: { type: Number, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    },
    imageURL: { type: String },
    cloudinaryId: { type: String },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
```

---

## File: server.js (Updated Endpoint)

```javascript
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

    // Create location object
    const location = latitude && longitude ? {
      type: 'Point',
      coordinates: [Number(longitude), Number(latitude)]
    } : undefined;

    // Save to MongoDB
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
```

---

## Key Features

✅ **Image Upload** - Accepts JPEG/PNG via multipart/form-data
✅ **AI Prediction** - Sends image to FastAPI service
✅ **Error Handling** - Gracefully handles AI failures
✅ **MongoDB Storage** - Saves cow + AI predictions
✅ **Geospatial** - Stores coordinates for location-based queries
✅ **Async/Await** - Clean, modern async code
✅ **Logging** - Console logs for debugging

---

## Flow Diagram

```
Client (Postman/Frontend)
       ↓
  POST /api/add-cow
    [form-data with image]
       ↓
  Backend Express Server
       ↓
  1. Validate fields
       ↓
  2. Accept image (multer)
       ↓
  3. Send to AI API
       ↓ (if AI success)
  4. Receive {breed, confidence}
       ↓
  5. Save to MongoDB
       ↓
  Response: 201 + Cow data
```

---

## Environment Setup

**.env file:**
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/cowDB
PORT=5000
AI_API_URL=http://localhost:8000
```

**AI Service Requirements:**
- Running on `http://localhost:8000`
- Endpoint: `POST /predict-breed`
- Accepts: form-data with `file` field
- Returns: `{breed: "string", confidence: number}`

---

## Testing Checklist

- [ ] Server running on port 5000
- [ ] MongoDB connected
- [ ] AI service running on port 8000
- [ ] Test POST without image (AI = Unknown)
- [ ] Test POST with image (AI predicts breed)
- [ ] Check GET /api/cows returns saved cow
- [ ] Verify aiBreedPrediction in MongoDB

---

## Performance Notes

- **Multer**: Stores file in memory (good for small images)
- **Axios timeout**: 30 seconds for AI response
- **Error recovery**: Saves cow even if AI fails
- **Async operations**: Non-blocking file/API calls

---

## Future Enhancements

1. Add Cloudinary integration for image storage
2. Add authentication/authorization
3. Add file size validation
4. Cache AI predictions
5. Add batch processing for multiple cows
6. Add confidence score thresholds
