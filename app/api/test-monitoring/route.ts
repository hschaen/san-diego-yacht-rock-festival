import { NextResponse } from 'next/server';
import { getRecentRegistrations, getTotalRegistrations, getLastRegistration } from '@/lib/firebase-admin';

export async function GET() {
  try {
    // This is a test endpoint - no authentication required for development
    // In production, you might want to add authentication
    
    console.log('Testing registration monitoring system...');

    // Check if Firebase Admin is configured
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      return NextResponse.json({
        success: false,
        status: 'Not Configured',
        message: 'Firebase Admin service account not configured yet',
        setup: {
          1: 'Firebase service account creation is currently restricted',
          2: 'Monitoring will be enabled once service account is available',
          3: 'All other components are ready'
        },
        environmentStatus: {
          RESEND_API_KEY: process.env.RESEND_API_KEY ? '✅ Configured' : '❌ Missing',
          NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL ? '✅ Configured' : '❌ Missing',
          CRON_SECRET: process.env.CRON_SECRET ? '✅ Configured' : '❌ Missing',
          FIREBASE_SERVICE_ACCOUNT: '⏳ Pending'
        }
      });
    }

    // Test Firebase Admin connection
    const totalCount = await getTotalRegistrations();
    console.log(`Total registrations: ${totalCount}`);

    // Get recent registrations
    const { count: recentCount } = await getRecentRegistrations(1);
    console.log(`Registrations in last hour: ${recentCount}`);

    // Get last registration
    const lastRegistration = await getLastRegistration();
    const lastRegTime = lastRegistration?.timestamp 
      ? new Date(lastRegistration.timestamp).toLocaleString('en-US', {
          timeZone: 'America/Los_Angeles',
          dateStyle: 'full',
          timeStyle: 'short'
        })
      : 'No registrations yet';

    // Calculate hours since last registration
    const hoursAgo = lastRegistration?.timestamp
      ? Math.floor((Date.now() - new Date(lastRegistration.timestamp).getTime()) / (1000 * 60 * 60))
      : null;

    // Return test results
    return NextResponse.json({
      success: true,
      test: 'Registration monitoring test',
      results: {
        firebaseConnection: 'OK',
        totalRegistrations: totalCount,
        registrationsLastHour: recentCount,
        lastRegistration: {
          time: lastRegTime,
          hoursAgo: hoursAgo,
          details: lastRegistration ? {
            name: lastRegistration.name,
            email: lastRegistration.email
          } : null
        },
        alertWouldTrigger: recentCount === 0,
        currentTime: new Date().toLocaleString('en-US', {
          timeZone: 'America/Los_Angeles',
          dateStyle: 'full',
          timeStyle: 'short'
        })
      },
      nextSteps: {
        1: 'Add FIREBASE_SERVICE_ACCOUNT to environment variables',
        2: 'Add RESEND_API_KEY to environment variables',
        3: 'Add NOTIFICATION_EMAIL to environment variables',
        4: 'Add CRON_SECRET to environment variables',
        5: 'Test the cron endpoint at /api/cron/check-registrations?secret=YOUR_SECRET'
      }
    });

  } catch (error) {
    console.error('Test failed:', error);
    
    // Provide helpful error message for common issues
    let errorMessage = 'Unknown error';
    let setupHint = '';

    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (errorMessage.includes('FIREBASE_SERVICE_ACCOUNT')) {
        setupHint = 'You need to set up FIREBASE_SERVICE_ACCOUNT in your environment variables. See MONITORING_SETUP.md for instructions.';
      } else if (errorMessage.includes('permission')) {
        setupHint = 'Firebase Admin SDK may not have proper permissions. Check your service account configuration.';
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: errorMessage,
      hint: setupHint,
      documentation: '/MONITORING_SETUP.md'
    }, { status: 500 });
  }
}