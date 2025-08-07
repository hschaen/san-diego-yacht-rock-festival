'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { AuthService } from '@/lib/services/auth';
import { AdminUser } from '@/lib/types/content';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  adminUser: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = AuthService.onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user is admin
        const isAdmin = await AuthService.checkIsAdmin(firebaseUser.uid);
        if (isAdmin) {
          const admin = await AuthService.getAdminUser(firebaseUser.uid);
          setUser(firebaseUser);
          setAdminUser(admin);
        } else {
          // Not an admin, sign out
          await AuthService.signOut();
          setUser(null);
          setAdminUser(null);
        }
      } else {
        setUser(null);
        setAdminUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    const firebaseUser = await AuthService.signIn(email, password);
    const admin = await AuthService.getAdminUser(firebaseUser.uid);
    setUser(firebaseUser);
    setAdminUser(admin);
    router.push('/admin');
  };

  const signOut = async () => {
    await AuthService.signOut();
    setUser(null);
    setAdminUser(null);
    router.push('/admin/login');
  };

  const resetPassword = async (email: string) => {
    await AuthService.resetPassword(email);
  };

  return (
    <AuthContext.Provider value={{
      user,
      adminUser,
      loading,
      signIn,
      signOut,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// HOC for protecting pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/admin/login');
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-pink-900">
          <div className="text-white text-xl">Loading...</div>
        </div>
      );
    }

    if (!user) {
      return null;
    }

    return <Component {...props} />;
  };
}