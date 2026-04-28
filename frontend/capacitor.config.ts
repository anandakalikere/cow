import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gaumart.app',
  appName: 'GauMart',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Development server (replace with your local network IP)
    // url: 'http://192.168.X.X:5174', // Uncomment for development
    // cleartext: true, // Allow HTTP on Android
  },
  plugins: {
    Geolocation: {
      permissions: ['location'],
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#22c55e',
      androidScaleType: 'center',
      showSpinner: true,
      spinnerColor: '#ffffff',
    },
  },
};

export default config;
