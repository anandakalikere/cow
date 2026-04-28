## Cow Marketplace Platform

This is a full-stack AI-powered cow buying and selling marketplace with:

- User authentication (JWT)
- Cow listings with Cloudinary image storage
- AI-based breed and health detection via FastAPI (MobileNetV2)
- MongoDB Atlas with geo queries and nearby cow search
- React frontend with Leaflet map integration

### Backend (Node.js + Express)

- `backend/src/index.js`: Express app, MongoDB connection, route wiring.
- Auth routes: `POST /api/auth/register`, `POST /api/auth/login`.
- Cow routes:
  - `POST /api/add-cow` (authenticated, image upload, Cloudinary, calls FastAPI AI).
  - `GET /api/cows`, `GET /api/cow/:id`.
  - `PUT /api/edit-cow/:id` (owner-only).
  - `DELETE /api/cow/:id` (owner-only, deletes Cloudinary image).
  - `GET /api/nearby-cows?lat=..&lng=..` (20 km radius, MongoDB 2dsphere).
  - `GET /api/my-cows` (seller’s listings).

### Frontend (React + Vite)

- Pages: Home, Register, Login, Sell Cow, Buy Marketplace, Cow Details, My Listings, Nearby Map.
- Auth stored in localStorage with JWT and user profile.
- Uses Leaflet (`react-leaflet`) for nearby cow map and browser geolocation.

### AI Models + FastAPI

- `ai-model/train_breed_model.py`: Transfer-learning MobileNetV2 on cow breeds.
- `ai-model/train_health_model.py`: Transfer-learning MobileNetV2 on cow health.
- `ai-model/fastapi_app.py`: FastAPI server exposing:
  - `POST /predict-breed` and `POST /predict-health` (image upload).
  - `POST /predict-breed-url` and `POST /predict-health-url` (Cloudinary URL).

## Setup Instructions

### 1. MongoDB Atlas

- Create a free MongoDB Atlas cluster.
- Create a database user and get the connection string.
- Whitelist your IP (or allow access from anywhere for development).
- Replace `MONGO_URI` in `backend/.env` (copy from `.env.example`).

### 2. Cloudinary

- Create a free Cloudinary account.
- Note your cloud name, API key, and API secret.
- Put them into `backend/.env` as:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. AI Service Setup

```bash
cd ai-model
python -m venv venv
venv\Scripts\activate  # on Windows
pip install -r requirements.txt
```

#### 3.1 Download & Train Breed Model

- Edit `DATASET_URL` in `train_breed_model.py` with a Kaggle cow breed dataset URL that contains subfolders for:
  - Gir, Jersey, Sahiwal, Holstein Friesian, Red Sindhi, Ongole.
- Make sure the extracted folder structure under `data/breeds` is:

```text
data/breeds/
  Gir/
  Jersey/
  Sahiwal/
  Holstein Friesian/
  Red Sindhi/
  Ongole/
```

- Then run:

```bash
python train_breed_model.py
```

This saves `cow_breed_model.h5` and `breed_class_indices.npy`.

#### 3.2 Download & Train Health Model

- Edit `DATASET_URL` in `train_health_model.py` with a Kaggle cattle health / livestock disease dataset.
- Arrange folders under `data/health` to match:

```text
data/health/
  Healthy/
  Wound/
  Skin Disease/
  Underweight/
```

- Run:

```bash
python train_health_model.py
```

This saves `cow_health_model.h5` and `health_class_indices.npy`.

> For fast prototyping, you can skip training and drop in your own pre-trained `.h5` models as long as they match the class order in `fastapi_app.py`.

#### 3.3 Run FastAPI Server

From the `ai-model` directory (with `cow_breed_model.h5` and `cow_health_model.h5` present):

```bash
uvicorn fastapi_app:app --reload --port 8000
```

Ensure `AI_API_URL=http://localhost:8000` is set in `backend/.env`.

### 4. Backend Setup

```bash
cd backend
copy .env.example .env  # or manually create .env
# edit .env with your MongoDB, JWT secret, Cloudinary, and AI_API_URL
npm install
npm run dev
```

The backend will start on `http://localhost:5000`.

### 5. Frontend Setup

```bash
cd frontend
npm install
```

- Create `frontend/.env` with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

- Run:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

### 6. Application Flow

- **Register/Login**: Create an account and sign in.
- **Sell Cow**:
  - Go to “Sell Cow”, fill in details, optionally use “Use My Location”.
  - Upload an image; on submit, backend uploads to Cloudinary, calls FastAPI AI, stores predictions and location in MongoDB.
- **Buy Cow**:
  - Browse all cows, filter by breed and price, see AI breed and health status on cards and detail page.
- **My Listings**:
  - View your own listings and delete them with a confirmation dialog (removes MongoDB record and Cloudinary image).
- **Nearby Cows**:
  - Uses browser geolocation, asks backend `/nearby-cows` with 20 km radius, renders results on a Leaflet map with distance in km.

You now have a complete end-to-end AI-powered cow marketplace with breed detection, health detection, and smart nearby search.


