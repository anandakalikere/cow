# Cow Buying and Selling Marketplace Backend

A Node.js backend for a cow marketplace with user authentication, cow listings, image uploads, and geospatial search.

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas (Mongoose)
- Cloudinary (image storage)
- Multer (file upload)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- cors
- axios (for future AI integration)

## Project Structure

```
backend/
├── config/
│   ├── db.js
│   └── cloudinary.js
├── controllers/
│   ├── userController.js
│   └── cowController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   └── Cow.js
├── routes/
│   ├── userRoutes.js
│   └── cowRoutes.js
├── server.js
├── .env
└── package.json
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=YOUR_MONGODB_ATLAS_URL
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
JWT_SECRET=YOUR_SECRET_KEY
```

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your environment variables in `.env`
5. Start the development server:
   ```bash
   npm run dev
   ```
6. For production:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - Login user

### Cows

- `POST /api/add-cow` - Add a new cow (requires auth, multipart/form-data with 'image')
- `GET /api/cows` - Get all cows (optional query params: breed, minPrice, maxPrice)
- `GET /api/cow/:id` - Get single cow by ID
- `PUT /api/edit-cow/:id` - Edit cow (requires auth, seller only)
- `DELETE /api/cow/:id` - Delete cow (requires auth, seller only)
- `GET /api/nearby-cows?lat=LAT&lng=LNG` - Get cows within 20km

## Example API Requests (Postman)

### Register User
```
POST http://localhost:5000/api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "location": "New York"
}
```

### Login User
```
POST http://localhost:5000/api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Add Cow
```
POST http://localhost:5000/api/add-cow
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

Form Data:
- image: [Upload cow image]
- cowName: "Bella"
- breed: "Holstein"
- age: 3
- milkProduction: 25
- price: 1500
- latitude: 40.7128
- longitude: -74.0060
```

### Get All Cows
```
GET http://localhost:5000/api/cows
```

### Get Nearby Cows
```
GET http://localhost:5000/api/nearby-cows?lat=40.7128&lng=-74.0060
```

## Database Models

### User
- name (String, required)
- email (String, required, unique)
- phone (String, required)
- password (String, required, hashed)
- location (String, required)
- createdAt (Date)

### Cow
- cowName (String, required)
- breed (String, required)
- age (Number, required)
- milkProduction (Number, required)
- price (Number, required)
- location (GeoJSON Point, required)
- imageURL (String, required)
- cloudinaryId (String, required)
- sellerId (ObjectId, ref: User, required)
- createdAt (Date)

## Features Implemented

1. ✅ MongoDB Connection
2. ✅ Cloudinary Configuration
3. ✅ User Authentication (Register/Login)
4. ✅ User Model
5. ✅ Cow Model with Geospatial Index
6. ✅ Add Cow API with Image Upload
7. ✅ Get All Cows with Filters
8. ✅ Get Single Cow
9. ✅ Edit Cow (Seller Only)
10. ✅ Delete Cow (Seller Only, with Image Deletion)
11. ✅ Nearby Cow Search (20km radius)
12. ✅ JWT Authentication Middleware
13. ✅ Express Server Setup with CORS and JSON parsing
14. ✅ Error Handling

## Notes

- All protected routes require JWT token in Authorization header: `Bearer <token>`
- Images are uploaded to Cloudinary and stored in 'cow-marketplace' folder
- Geospatial queries use MongoDB's $geoNear aggregation
- Passwords are hashed using bcryptjs
- JWT tokens expire in 7 days