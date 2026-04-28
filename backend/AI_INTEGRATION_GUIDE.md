# AI Breed Detection Integration - Testing Guide

## Overview
The backend now integrates with a FastAPI AI service for automatic cow breed detection. When an image is uploaded, the system:
1. Accepts the image via multer (file upload)
2. Sends it to the AI API for breed prediction
3. Receives breed probability and confidence score
4. Saves everything to MongoDB

---

## API Endpoint: POST /api/add-cow

### Request Format (Multipart Form-Data)

**URL:** `http://localhost:5000/api/add-cow`

**Method:** POST

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Fields:**
- `cowName` (text) - Name of the cow
- `breed` (text) - User-provided breed
- `age` (number) - Age in years
- `milkProduction` (number) - Daily milk production in liters
- `price` (number) - Price in rupees
- `latitude` (number) - Latitude coordinate
- `longitude` (number) - Longitude coordinate
- `image` (file) - Image file (JPEG/PNG)

---

## Testing with cURL

```bash
curl -X POST http://localhost:5000/api/add-cow \
  -F "cowName=Bessie" \
  -F "breed=Gir" \
  -F "age=3" \
  -F "milkProduction=15" \
  -F "price=50000" \
  -F "latitude=12.97" \
  -F "longitude=77.59" \
  -F "image=@/path/to/cow-image.jpg"
```

---

## Testing with Postman

### Step 1: Open Postman
- Create a new POST request
- URL: `http://localhost:5000/api/add-cow`

### Step 2: Set Headers
- Click **Headers** tab
- Headers are auto-set when you use form-data

### Step 3: Add Body (Form-Data)
- Click **Body** tab
- Select **form-data** radio button
- Add the following fields:

| Key | Type | Value |
|-----|------|-------|
| cowName | text | Gir Cow |
| breed | text | Gir |
| age | text | 4 |
| milkProduction | text | 10 |
| price | text | 45000 |
| latitude | text | 12.97 |
| longitude | text | 77.59 |
| image | file | [Select your cow image] |

### Step 4: Send Request
- Click **Send**
- View response with AI predictions

---

## Response Format

### Success Response
```json
{
  "message": "Cow added successfully with AI breed detection",
  "cow": {
    "_id": "69cf6f6acc68546cdbe38c1d",
    "cowName": "Gir Cow",
    "breed": "Gir",
    "aiBreedPrediction": {
      "breed": "Gir",
      "confidence": 0.92
    },
    "age": 4,
    "milkProduction": 10,
    "price": 45000,
    "location": {
      "type": "Point",
      "coordinates": [77.59, 12.97]
    },
    "imageURL": "cow-image.jpg",
    "createdAt": "2026-04-03T08:15:30.123Z",
    "updatedAt": "2026-04-03T08:15:30.123Z"
  }
}
```

### If AI Fails (Graceful Fallback)
```json
{
  "message": "Cow added successfully with AI breed detection",
  "cow": {
    "_id": "69cf6f6acc68546cdbe38c1d",
    "cowName": "Gir Cow",
    "breed": "Gir",
    "aiBreedPrediction": {
      "breed": "Unknown",
      "confidence": 0
    },
    ...
  }
}
```
*Note: Even if AI fails, cow is saved successfully*

---

## Testing Steps

### Option 1: Without AI Service (JSON Only)
Send request without image:
```bash
curl -X POST http://localhost:5000/api/add-cow \
  -H "Content-Type: application/json" \
  -d '{
    "cowName": "Gir Cow",
    "breed": "Gir",
    "age": 4,
    "milkProduction": 10,
    "price": 45000,
    "latitude": 12.97,
    "longitude": 77.59
  }'
```
*Result: AI Prediction will be "Unknown"*

### Option 2: With Image (Full AI Integration)
Send with image file attached (use Postman or command below)
*Result: AI will predict breed from image*

---

## Verification Commands

### Check all cows
```bash
curl http://localhost:5000/api/cows
```

### Check single cow
```bash
curl http://localhost:5000/api/cow/69cf6f6acc68546cdbe38c1d
```

---

## Environment Variables

Make sure `.env` has:
```
MONGO_URI=your_mongodb_uri
PORT=5000
AI_API_URL=http://localhost:8000
```

---

## Troubleshooting

### Error: "AI API not responding"
- Check if AI service is running on port 8000
- Verify `AI_API_URL` in `.env`
- Cow will still be saved with "Unknown" breed

### Error: "Invalid file upload"
- Ensure image size < 25MB
- Format: JPEG or PNG
- Use multipart/form-data, not raw JSON

### Error: "Required fields missing"
- All text fields: cowName, breed, age, milkProduction, price are mandatory
- Coordinates and image are optional

---

## Code Files Updated

1. **server.js** - Main API with multer integration
2. **src/models/Cow.js** - Added aiBreedPrediction field
3. **src/utils/aiBreedDetection.js** - NEW AI utility function

---

## Next Steps

1. Ensure AI FastAPI service is running on `http://localhost:8000`
2. Test with Postman using form-data
3. Monitor console logs for AI prediction results
4. Connect frontend to `/api/add-cow` endpoint
