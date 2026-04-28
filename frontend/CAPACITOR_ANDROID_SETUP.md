# 📱 CAPACITOR ANDROID BUILD GUIDE

## ✨ OVERVIEW

Convert your React (Vite) web app into a native Android application using Capacitor.

---

## 🔧 STEP 1: INSTALL DEPENDENCIES

### Install Capacitor packages
```bash
npm install
```

This installs:
- `@capacitor/core` - Core framework
- `@capacitor/cli` - CLI tools
- `@capacitor/android` - Android platform
- `@capacitor/app` - App lifecycle
- `@capacitor/geolocation` - Location services

---

## 🏗️ STEP 2: BUILD FRONTEND

### Create production build
```bash
npm run build
```

✅ Creates `dist/` folder with optimized assets

---

## 📍 STEP 3: GET YOUR LOCAL NETWORK IP

**Windows - Command Prompt:**
```cmd
ipconfig
```
Find `IPv4 Address` under your active network adapter.
Example: `192.168.0.100`

**macOS/Linux - Terminal:**
```bash
ifconfig
```

---

## ⚙️ STEP 4: UPDATE ENVIRONMENT VARIABLES

### Edit `.env.local`
```bash
# Replace 192.168.X.X with YOUR actual local IP
VITE_API_URL=http://192.168.X.X:5000/api
VITE_AI_URL=http://192.168.X.X:8000
```

**Example:**
```bash
VITE_API_URL=http://192.168.0.100:5000/api
VITE_AI_URL=http://192.168.0.100:8000
```

### For development with live reload, also update `capacitor.config.ts`:
```typescript
server: {
  // Uncomment for development:
  url: 'http://192.168.X.X:5174',
  cleartext: true,
}
```

---

## 🏃 STEP 5: INITIAL CAPACITOR SETUP (First Time Only)

### Initialize Capacitor project
```bash
npx cap init
```

When prompted:
- **App name**: `GauMart` (or your app name)
- **App package ID**: `com.gaumart.app`
- **Directory**: `www` (or `dist` for Vite)

✅ Creates `capacitor.config.ts` file

---

## 📦 STEP 6: ADD ANDROID PLATFORM

### Add Android platform
```bash
npx cap add android
```

✅ Creates `android/` folder with Android Studio project

**Requires:**
- Android SDK installed
- Java Development Kit (JDK) 11 or higher

---

## 🔄 STEP 7: SYNC & COPY BUILD

### Sync platform changes
```bash
npm run cap:sync
```

Or use individual commands:
```bash
npx cap copy      # Copy web assets to Android
npx cap sync      # Copy + sync plugins
```

---

## 🚀 STEP 8: OPEN ANDROID STUDIO

### Open Android project
```bash
npm run cap:open
```

Or manually:
```bash
npx cap open android
```

✅ Launches Android Studio with your project

---

## 📝 STEP 9: CONFIGURE PERMISSIONS

### Edit `android/app/src/main/AndroidManifest.xml`

Add these permissions:
```xml
<manifest ...>
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.CAMERA" />
  
  <application ...>
    ...
  </application>
</manifest>
```

---

## 🎨 STEP 10: APP ICON & SPLASH SCREEN

### Icon Setup (Optional but Recommended)

1. **Generate icon assets**:
   - Use [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)
   - Or place your icon at: `android/app/src/main/res/mipmap-*/ic_launcher.png`

2. **Icon sizes needed**:
   - mdpi: 48x48
   - hdpi: 72x72
   - xhdpi: 96x96
   - xxhdpi: 144x144
   - xxxhdpi: 192x192

### Splash Screen (Optional)

Edit `android/app/src/main/res/values/styles.xml`:
```xml
<resources>
  <style name="AppTheme" parent="android:Theme.Material.Light.DarkActionBar">
    <!-- App icon -->
    <item name="android:windowBackground">@drawable/splash</item>
    <!-- App color -->
    <item name="android:statusBarColor">@color/colorPrimary</item>
  </style>
</resources>
```

---

## 🔧 STEP 11: NETWORK FIX FOR ANDROID (CRITICAL!)

### Problem
- Android emulator cannot access `localhost:5000`
- Physical device cannot access local machine

### Solution

**For Emulator:**
Use special IP `10.0.2.2` to access host machine:
```javascript
// In api.js, emulator uses:
http://10.0.2.2:5000/api
```

**For Physical Device or Production:**
Use your actual local network IP:
```javascript
// Replace 192.168.X.X with your IP
http://192.168.X.X:5000/api
```

### Automatic Detection Code

Edit `src/api.js`:
```javascript
import axios from 'axios';
import { Device } from '@capacitor/device';

let apiBaseURL = 'http://localhost:5000/api';

// Auto-detect platform
async function getApiUrl() {
  const info = await Device.getInfo();
  if (info.platform === 'android' && !info.isVirtual) {
    // Physical Android device - use local IP
    apiBaseURL = 'http://192.168.X.X:5000/api';
  } else if (info.platform === 'android' && info.isVirtual) {
    // Emulator - use special host IP
    apiBaseURL = 'http://10.0.2.2:5000/api';
  }
}

getApiUrl();

const api = axios.create({
  baseURL: apiBaseURL,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
```

---

## 🎯 STEP 12: BUILD & RUN

### Option A: Run on Emulator (Android Studio)

1. **Create Virtual Device** (AVD):
   - Android Studio → Tools → Device Manager
   - Create emulator with Android 10+

2. **Run app**:
   - Android Studio → Run (or Shift+F10)
   - App launches on emulator

### Option B: Run on Physical Device

1. **Enable USB Debugging**:
   - Settings → Developer Options → USB Debugging
   - Connect USB cable

2. **Run app**:
   - Android Studio → Run
   - Select connected device
   - App launches on phone

---

## 📦 STEP 13: BUILD FOR RELEASE

### Generate APK (for testing)

1. **Build menu** → Build Bundles/APK → Build APK
2. Wait for build to complete
3. APK saved at: `android/app/release/app-release.apk`

### Generate AAB (for Google Play)

1. **Build menu** → Build Bundles/APK → Build Bundle(s)
2. Google Play requires signed AAB
3. Signed AAB saved in similar location

### Sign APK/AAB

1. **Create keystore** (first time):
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore \
           -keyalg RSA -keysize 2048 -validity 10000 \
           -alias my-key-alias
   ```

2. **In Android Studio**:
   - Build → Generate Signed Bundle/APK
   - Select keystore file
   - Enter password
   - Choose release build type

---

## ✅ COMPLETE SETUP CHECKLIST

### Before Building
- [ ] `npm install` completed
- [ ] `npm run build` successful
- [ ] Local IP obtained (e.g., 192.168.0.100)
- [ ] `.env.local` updated with IP
- [ ] `capacitor.config.ts` created
- [ ] Permissions added to AndroidManifest.xml

### Android Studio Setup
- [ ] Android SDK installed
- [ ] JDK 11+ installed
- [ ] `npx cap add android` completed
- [ ] `npm run cap:sync` completed
- [ ] Project opens in Android Studio

### Before Release
- [ ] App icon added
- [ ] Splash screen configured
- [ ] App tested on emulator
- [ ] App tested on physical device
- [ ] Network connectivity verified
- [ ] Permissions working (location, storage)
- [ ] Geolocation prompts appear

---

## 🔗 IMPORTANT API CONFIGURATION

### Development (Local Testing)

**On Windows, find your IP:**
```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*"} | Select-Object IPAddress
```

**Backend must accept connections from Android:**

Edit `backend/.env`:
```
CORS_ORIGIN=http://192.168.X.X:5174,http://192.168.X.X:5173
```

Edit `backend/server.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: [
    'http://192.168.0.100:5174',
    'http://192.168.0.100:5173',
    'http://localhost:5000'
  ]
}));
```

### Production Deployment

1. **Replace localhost with production domain**:
   ```bash
   VITE_API_URL=https://your-api.com/api
   ```

2. **Rebuild**:
   ```bash
   npm run build
   npx cap sync
   ```

3. **Sign APK/AAB** and upload to Play Store

---

## 📱 RECOMMENDED QUICK COMMANDS

```bash
# One-time setup
npm install
npm run build
npx cap add android

# Development workflow
npm run build
npm run cap:sync
npm run cap:open

# Testing
# Run on emulator/device in Android Studio with Shift+F10

# Building for release
# Use Android Studio: Build → Generate Signed Bundle/APK
```

---

## 🚨 COMMON ISSUES & FIXES

### Issue: "Cannot connect to API"
**Solution**: 
- Check IP in `.env.local`
- Verify backend running on correct IP
- Add CORS headers in backend

### Issue: "Module not found"
**Solution**:
- Run `npm install`
- Run `npm run build`
- Run `npm run cap:sync`

### Issue: "Location permission not granted"
**Solution**:
- Check AndroidManifest.xml has permission
- Request runtime permission in code
- User must grant permission on first load

### Issue: "Emulator shows blank screen"
**Solution**:
- Check `capacitor.config.ts` webDir is `dist`
- Run `npm run cap:copy`
- Clear Android Studio cache: File → Invalidate Caches

### Issue: "Gradle build fails"
**Solution**:
- Update Android SDK: Tools → SDK Manager
- Install Android 33+ SDK
- Restart Android Studio

---

## 📚 FILES MODIFIED

### Created/Updated
- ✅ `capacitor.config.ts` - Capacitor configuration
- ✅ `.env.local` - Development environment variables
- ✅ `.env.production` - Production environment variables
- ✅ `package.json` - Added Capacitor scripts & dependencies
- ✅ `src/api.js` - Updated API configuration

### Generated by Capacitor
- `android/` - Android Studio project (created after `cap add android`)
- `dist/` - Production build (created after `npm run build`)

---

## 🎉 YOU'RE READY!

Your React web app is now ready to become an Android mobile application!

### Final Workflow:
```bash
# 1. Prepare
npm install

# 2. Build
npm run build

# 3. Sync with Android
npm run cap:sync

# 4. Open Android Studio
npm run cap:open

# 5. Run on device/emulator
# Use Android Studio's Run button or Shift+F10
```

---

**Your GauMart app is on its way to Google Play!** 🚀🐄
