import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getRecentRegistrations, getTotalRegistrations, getLastRegistration } from '@/lib/firebase-admin';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  try {
    // Verify the request is authorized (either from Vercel Cron or with secret)
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Check if request is from Vercel Cron (has specific header) or has correct secret
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if Firebase Admin is configured
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.log('Monitoring disabled - Firebase service account not configured');
      return NextResponse.json(
        { 
          message: 'Monitoring disabled - awaiting Firebase service account configuration',
          setup: 'See MONITORING_SETUP.md for instructions'
        },
        { status: 200 }
      );
    }

    // Check for required environment variables
    if (!process.env.RESEND_API_KEY || !process.env.NOTIFICATION_EMAIL) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error - missing email settings' },
        { status: 500 }
      );
    }

    // Get registrations from the last hour
    const { count: recentCount } = await getRecentRegistrations(1);
    
    // Get total registrations for context
    const totalCount = await getTotalRegistrations();
    
    // Get the last registration for reference
    const lastRegistration = await getLastRegistration();

    // Log the check for monitoring
    console.log(`Registration check at ${new Date().toISOString()}: ${recentCount} new registrations in the last hour`);

    // If no registrations in the last hour, send alert email
    if (recentCount === 0) {
      const currentTime = new Date().toLocaleString('en-US', { 
        timeZone: 'America/Los_Angeles',
        dateStyle: 'full',
        timeStyle: 'short'
      });

      const lastRegTime = lastRegistration?.timestamp 
        ? new Date(lastRegistration.timestamp).toLocaleString('en-US', {
            timeZone: 'America/Los_Angeles',
            dateStyle: 'full',
            timeStyle: 'short'
          })
        : 'No registrations yet';

      const hoursAgo = lastRegistration?.timestamp
        ? Math.floor((Date.now() - new Date(lastRegistration.timestamp).getTime()) / (1000 * 60 * 60))
        : null;

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .alert-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
            .alert-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .stat-card { background: #f7f7f7; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; }
            .stat-label { color: #666; font-size: 12px; text-transform: uppercase; }
            .stat-value { font-size: 20px; font-weight: bold; color: #333; margin-top: 5px; }
            .warning { background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin-top: 15px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
            .time-alert { color: #ff6b6b; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="alert-box">
              <div class="alert-title">⚠️ Registration Alert</div>
              <div>No new registrations in the last hour!</div>
            </div>
            
            <div class="warning">
              <strong>Attention Required:</strong> The registration system hasn't received any new sign-ups in the past hour. This could indicate:
              <ul style="margin-top: 10px;">
                <li>Technical issue with the registration form</li>
                <li>Firebase connectivity problems</li>
                <li>Website accessibility issues</li>
                <li>Normal low-traffic period (check time of day)</li>
              </ul>
            </div>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Current Time (PST)</div>
                <div class="stat-value">${currentTime}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Total Registrations</div>
                <div class="stat-value">${totalCount}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Last Registration</div>
                <div class="stat-value ${hoursAgo && hoursAgo > 2 ? 'time-alert' : ''}">${lastRegTime}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Time Since Last</div>
                <div class="stat-value ${hoursAgo && hoursAgo > 2 ? 'time-alert' : ''}">${hoursAgo ? `${hoursAgo} hours ago` : 'N/A'}</div>
              </div>
            </div>
            
            <div style="margin-top: 20px;">
              <h3>Recommended Actions:</h3>
              <ol>
                <li>Check the website registration form is working</li>
                <li>Verify Firebase is accessible and within quota limits</li>
                <li>Review recent marketing campaigns or traffic sources</li>
                <li>Check for any JavaScript errors in the browser console</li>
              </ol>
              
              <a href="https://san-diego-yacht-rock-festival.vercel.app/admin/registrations" class="button">
                View Registration Dashboard →
              </a>
            </div>
            
            ${lastRegistration ? `
              <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 8px;">
                <strong>Last Registration Details:</strong><br>
                Name: ${lastRegistration.name || 'Not provided'}<br>
                Email: ${lastRegistration.email || 'Not provided'}<br>
                Time: ${lastRegTime}
              </div>
            ` : ''}
            
            <div class="footer">
              <p>This is an automated alert from the San Diego Yacht Rock Festival registration monitoring system.</p>
              <p>Monitoring runs every hour. To disable, update your Vercel cron configuration.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send the alert email
      const { data, error } = await resend.emails.send({
        from: 'San Diego Yacht Rock <onboarding@resend.dev>',
        to: process.env.NOTIFICATION_EMAIL,
        subject: `🚨 Registration Alert: No New Sign-ups (${hoursAgo ? `${hoursAgo}h` : '1h'} since last)`,
        html: emailHtml,
      });

      if (error) {
        console.error('Failed to send alert email:', error);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to send email notification',
            details: error 
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Alert email sent',
        emailId: data?.id,
        stats: {
          recentRegistrations: recentCount,
          totalRegistrations: totalCount,
          lastRegistration: lastRegTime,
          hoursAgo
        }
      });
    }

    // Registrations found - no alert needed
    return NextResponse.json({
      success: true,
      message: `${recentCount} registrations in the last hour - no alert needed`,
      stats: {
        recentRegistrations: recentCount,
        totalRegistrations: totalCount,
        lastRegistration: lastRegistration?.timestamp
      }
    });

  } catch (error) {
    console.error('Error in registration monitoring:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}