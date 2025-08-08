import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export interface Registration {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  timestamp: Date;
}

// Initialize Firebase Admin SDK for server-side operations
function initAdmin() {
  if (getApps().length > 0) {
    return getFirestore();
  }

  // Parse the service account from environment variable
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : null;

  if (!serviceAccount) {
    // Return null if service account is not configured yet
    console.warn('FIREBASE_SERVICE_ACCOUNT not configured - monitoring disabled');
    return null;
  }

  try {
    initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

    return getFirestore();
  } catch (error) {
    console.error('Failed to initialize Firebase Admin with service account:', error);
    return null;
  }
}

// Export a function to get the admin Firestore instance
export function getAdminFirestore() {
  try {
    const db = initAdmin();
    if (!db) {
      throw new Error('Firebase Admin not available - service account not configured');
    }
    return db;
  } catch (error) {
    console.error('Failed to get Firebase Admin instance:', error);
    throw error;
  }
}

// Helper function to check registrations in the last hour
export async function getRecentRegistrations(hours = 1) {
  const db = getAdminFirestore();
  const now = new Date();
  const hoursAgo = new Date(now.getTime() - hours * 60 * 60 * 1000);

  try {
    const snapshot = await db
      .collection('registrations')
      .where('timestamp', '>=', hoursAgo)
      .get();

    return {
      count: snapshot.size,
      registrations: snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate ? doc.data().timestamp.toDate() : doc.data().timestamp
      }))
    };
  } catch (error) {
    console.error('Error fetching recent registrations:', error);
    throw error;
  }
}

// Helper function to get total registration count
export async function getTotalRegistrations() {
  const db = getAdminFirestore();
  
  try {
    const snapshot = await db.collection('registrations').get();
    return snapshot.size;
  } catch (error) {
    console.error('Error fetching total registrations:', error);
    throw error;
  }
}

// Helper function to get the last registration
export async function getLastRegistration(): Promise<Registration | null> {
  const db = getAdminFirestore();
  
  try {
    const snapshot = await db
      .collection('registrations')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp
    } as Registration;
  } catch (error) {
    console.error('Error fetching last registration:', error);
    throw error;
  }
}