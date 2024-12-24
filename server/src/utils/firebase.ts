import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { config } from 'dotenv';

// Load environment variables
config();

export function initializeFirebase() {
  const apps = getApps();
  
  if (apps.length === 0) {
    try {
      // Check for required environment variables
      const requiredEnvVars = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
      };

      // Validate all required environment variables
      const missingVars = Object.entries(requiredEnvVars)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingVars.length > 0) {
        throw new Error(
          `Missing required Firebase Admin configuration: ${missingVars.join(', ')}. ` +
          'Please check your .env file.'
        );
      }

      console.log('Firebase Admin configuration found:', {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.substring(0, 10) + '...'
      });

      const firebaseConfig = {
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY
        })
      };

      return initializeApp(firebaseConfig);
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error);
      throw error;
    }
  }
  
  return apps[0];
} 