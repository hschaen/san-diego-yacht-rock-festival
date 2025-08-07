'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const info = {
      firebase: {
        authInitialized: !!auth,
        dbInitialized: !!db,
      },
      env: {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Missing',
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'Set' : 'Missing',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Missing',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'Set' : 'Missing',
      },
      window: typeof window !== 'undefined',
    };
    setDebugInfo(info);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl mb-4">Debug Information</h1>
      <pre className="bg-gray-800 p-4 rounded">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <div className="mt-4">
        <h2 className="text-xl mb-2">Firebase Config Values:</h2>
        <div className="bg-gray-800 p-4 rounded text-xs">
          <p>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'NOT SET'}</p>
          <p>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'NOT SET'}</p>
          <p>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'NOT SET'}</p>
        </div>
      </div>
    </div>
  );
}