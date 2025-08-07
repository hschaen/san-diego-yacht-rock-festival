import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { AdminUser } from '@/lib/types/content';

export class AuthService {
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is admin
      const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
      if (!adminDoc.exists()) {
        await firebaseSignOut(auth);
        throw new Error('Access denied. Admin privileges required.');
      }
      
      // Update last login
      await setDoc(doc(db, 'admins', userCredential.user.uid), {
        lastLogin: new Date()
      }, { merge: true });
      
      return userCredential.user;
    } catch (error) {
      const authError = error as { code?: string; message?: string };
      if (authError.code === 'auth/user-not-found') {
        throw new Error('No account found with this email.');
      } else if (authError.code === 'auth/wrong-password') {
        throw new Error('Incorrect password.');
      } else if (authError.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      } else if (authError.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      }
      throw error;
    }
  }

  static async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      const authError = error as { code?: string };
      if (authError.code === 'auth/user-not-found') {
        throw new Error('No account found with this email.');
      }
      throw error;
    }
  }

  static async createAdminUser(
    email: string, 
    password: string, 
    name: string
  ): Promise<void> {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create admin document
      const adminUser: AdminUser = {
        id: userCredential.user.uid,
        email,
        name,
        role: 'admin',
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      await setDoc(doc(db, 'admins', userCredential.user.uid), adminUser);
    } catch (error) {
      const authError = error as { code?: string };
      if (authError.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists.');
      } else if (authError.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      }
      throw error;
    }
  }

  static async checkIsAdmin(uid: string): Promise<boolean> {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', uid));
      return adminDoc.exists();
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  static async getAdminUser(uid: string): Promise<AdminUser | null> {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', uid));
      if (adminDoc.exists()) {
        return adminDoc.data() as AdminUser;
      }
      return null;
    } catch (error) {
      console.error('Error fetching admin user:', error);
      return null;
    }
  }

  static onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }
}