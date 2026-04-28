# 🐄 MooMarket - Mobile-First React Frontend

A modern, mobile-first React (Vite + Tailwind CSS) frontend for the cow marketplace app with AI-powered breed detection and health status analysis.

---

## 🚀 QUICK START

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The app will start on **http://localhost:5173**

---

## 📱 FEATURES

✅ **Mobile-First Design** - Optimized for all screen sizes  
✅ **Bottom Navigation** - Like mobile apps (Home, Buy, Sell, Chat, Profile)  
✅ **Real-time Location** - Find nearby cows with geolocation  
✅ **AI Integration** - Display breed and health predictions  
✅ **Image Gallery** - Multi-image upload & viewing  
✅ **Video Support** - Optional video uploads  
✅ **Messaging** - In-app chat between buyers and sellers  
✅ **Call & WhatsApp** - Direct contact buttons  
✅ **User Profiles** - Editable user profiles with logout  
✅ **Responsive** - Works on phones, tablets, and desktops  

---

## 📂 PROJECT STRUCTURE

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx              # Landing page with nearby cows preview
│   │   ├── BuyCow.jsx            # Browse & filter cows with search
│   │   ├── AddCow.jsx            # Sell cow form with image/video upload
│   │   ├── Profile.jsx           # User profile & settings
│   │   ├── Chat.jsx              # Messaging between users
│   │   └── CowDetailsPage.jsx    # Full cow details with gallery
│   │
│   ├── components/
│   │   ├── BottomNavbar.jsx      # Fixed bottom navigation
│   │   ├── CowCard.jsx           # Cow listing card component
│   │   ├── CowGallery.jsx        # Image gallery component
│   │   ├── Skeleton.jsx          # Loading skeleton UI
│   │   └── Toast.jsx             # Toast notifications
│   │
│   ├── state/
│   │   ├── AuthContext.jsx       # Authentication state
│   │   └── ToastContext.jsx      # Toast notifications state
│   │
│   ├── utils/
│   │   ├── api.js                # Axios configuration & API calls
│   │   └── firebase.js           # Firebase configuration
│   │
│   ├── App.jsx                   # Main app component with routing
│   ├── main.jsx                  # App entry point
│   ├── styles.css                # Global Tailwind styles
│   └── api.js                    # API configuration
│
├── public/
│   ├── manifest.json             # PWA manifest
│   └── sw.js                     # Service worker for offline support
│
├── vite.config.mjs               # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── package.json                  # Dependencies
└── index.html                    # HTML entry point
```

---

## 🎨 PAGES OVERVIEW

### 1. **HOME PAGE** (`Home.jsx`)
- Welcome banner with brand name
- Quick action buttons (Buy, Sell)
- Preview of nearby cows
- Quick stats

### 2. **BUY PAGE** (`BuyCow.jsx`)
- Search bar with filters
- Breed filter dropdown
- Distance radius filter (5km, 10km, 20km, 50km)
- Nearby button to find cows near user
- Grid of cow cards with AI predictions
- Call, WhatsApp buttons on each card

### 3. **SELL PAGE** (`AddCow.jsx`)
- Cow details form:
  - Name, Breed (dropdown)
  - Age, Milk production
  - Price, Phone number
  - Location (with auto-capture)
- Image upload (up to 5 images)
- Video upload (optional, max 100MB)
- File preview with removal option
- Submit button with loading state

### 4. **PROFILE PAGE** (`Profile.jsx`)
- Display user info
- Edit profile (name, email, phone)
- Save profile changes
- Account statistics
- Logout button
- Support contact link

### 5. **CHAT PAGE** (`Chat.jsx`)
- Conversation list
- Individual chat view
- Message history
- Send message with Enter key
- Online status indicator
- Call button integrated

### 6. **COW DETAILS PAGE** (`CowDetailsPage.jsx`)
- Full image gallery with thumbnails
- Next/previous image navigation
- Image counter
- Favorite button
- Cow information cards:
  - Breed, Age, Health Status
  - Daily milk production
  - AI confidence scores
- Location with Google Maps link
- Call, WhatsApp, Chat buttons (fixed at bottom)
- Share button

---

## 🔧 COMPONENTS

### **BottomNavbar.jsx**
Fixed bottom navigation with 5 sections:
- Home (🏠)
- Buy (🛒)
- Sell (📤)
- Chat (💬)
- Profile (👤)

Active link highlighting with green color.

### **CowCard.jsx**
Reusable card component displaying:
- Cow image with distance badge
- Cow name & price (highlighted in green)
- Breed, health status, age badges
- Milk production info
- Call & WhatsApp buttons

---

## 📡 API INTEGRATION

The app connects to the backend at `http://localhost:5000/api/`

### Key Endpoints Used:

```javascript
// Get all cows
GET /api/cows

// Get nearby cows
GET /api/cows?latitude={lat}&longitude={lng}&radius={meters}

// Add new cow listing
POST /api/add-cow (FormData)

// Get cow details
GET /api/cow/{id}
```

### API Configuration (`api.js`)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

---

## 🌍 GEOLOCATION FEATURES

The app uses browser geolocation to:
1. **Auto-capture location** when selling a cow
2. **Show nearby cows** on home page
3. **Calculate distances** for each cow
4. **Filter by radius** on buy page

### Distance Calculation
- Uses Haversine formula
- Distance shown in kilometers on cards
- Radius filters: 5, 10, 20, 50 km

---

## 📱 MOBILE-FIRST DESIGN

### Design Principles:
- **Max width**: 448px (md breakpoint)
- **Container**: `max-w-md mx-auto`
- **Bottom navigation**: Fixed at bottom (pb-20 padding on content)
- **Touch-friendly**: Large tap targets (40x40px minimum)
- **Responsive images**: 100% width, object-cover
- **Safe areas**: Padding for notches on phones

### Color Scheme:
```
Primary: Green (#16a34a, #22c55e)
Success: Green (#10b981)
Danger: Red (#ef4444)
Info: Blue (#3b82f6)
Warning: Yellow (#f59e0b)
Background: Gray (#f3f4f6)
```

---

## 🔐 AUTHENTICATION

### User Data Flow:
1. User logs in (Firebase/Backend)
2. User object stored in localStorage:
   ```javascript
   localStorage.setItem('user', JSON.stringify(user))
   ```
3. On app load, user is restored from localStorage
4. User data available in all pages via `user` prop
5. Logout clears localStorage and redirects to home

### Protected Routes:
- `/profile` - Requires login
- `/chat` - Requires login
- `/sell` - Recommended to have user info

---

## 🎯 USER INTERACTIONS

### **Searching & Filtering**
- Type in search box to filter by cow name or breed
- Select breed from dropdown
- Choose radius: 5, 10, 20, 50 km
- Click "Nearby" to show only nearby cows

### **Contacting Sellers**
- **Call Button**: Opens phone dialer
  - `tel:{phone}`
- **WhatsApp Button**: Opens WhatsApp chat
  - `https://wa.me/91{phone}?text=...`
- **Chat Button**: In-app messaging

### **Uploading Cow Images/Videos**
- Upload up to 5 images (required: at least 1)
- Optional video upload (max 100MB)
- Preview before submission
- Remove files with X button

### **Editing Profile**
- Click "Edit Profile" button
- Modify name, email, phone
- Save changes to localStorage
- (In production: Send to backend)

---

## 🛠️ TECH STACK

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.23.1",
    "axios": "^1.7.2",
    "react-icons": "^5.0.0",
    "firebase": "^12.11.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.3",
    "postcss": "^8.5.8",
    "autoprefixer": "^10.4.27"
  }
}
```

---

## 📦 BUILD & DEPLOYMENT

### Build for Production
```bash
npm run build
```
Creates optimized build in `dist/` folder.

### Preview Build
```bash
npm run preview
```
Serve production build locally.

---

## 🚀 DEPLOY TO VERCEL

```bash
npm install -g vercel
vercel
```

### Environment Variables (.env.local)
```
VITE_API_URL=https://your-backend-url.com/api
VITE_FIREBASE_CONFIG={...}
```

---

## 🐛 COMMON ISSUES & FIXES

### Issue: Images not loading
**Solution**: Check image URL in cow listing. Use placeholder if missing.

### Issue: Geolocation not working
**Solution**: Allow location permission when prompted. Works only on HTTPS or localhost.

### Issue: API calls failing
**Solution**: Ensure backend is running on http://localhost:5000

### Issue: Styles not applying
**Solution**: Restart dev server. Clear browser cache.

### Issue: Mobile app zooming on input focus
**Solution**: Already fixed with `font-size: 16px` on inputs.

---

## 📝 NOTES

- **localStorage** used for user data (not production-grade)
- **In real app**, would use JWT tokens with secure httpOnly cookies
- **Chat** is mock UI - real implementation would use WebSockets or Firebase Realtime
- **Image uploads** go to Cloudinary (configured in backend)
- **AI predictions** come from FastAPI service

---

## 📚 USEFUL RESOURCES

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Vite Docs](https://vitejs.dev)

---

## 💡 FUTURE ENHANCEMENTS

- [ ] Real-time WebSocket chat
- [ ] User reviews & ratings
- [ ] Wishlist/favorites
- [ ] Advanced filters (price range, health status)
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] Analytics & statistics
- [ ] Notification system
- [ ] Dark mode
- [ ] Multiple languages

---

## 📧 SUPPORT & CONTACT

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with details
3. Contact support team

---

**Happy cow shopping! 🐄✨**
