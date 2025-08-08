# Registration Monitoring System Setup

This system monitors registrations hourly and sends email alerts when no registrations are received.

## ⚠️ IMPORTANT: Firebase Service Account Currently Pending

The Firebase service account creation is currently restricted by organization policies. The monitoring system will be activated once the service account becomes available. All other components are ready and configured.

## Environment Variables Required

Add these to your `.env.local` file:

### 1. Resend API Key
```
RESEND_API_KEY=re_Abt2JGg8_5XCPyibSwZiMrK4h5Ra2Ngex
```

### 2. Notification Email
```
NOTIFICATION_EMAIL=harrison@eventvibe.com
```

### 3. Cron Secret
Generate a secure random string for the cron secret:
```
CRON_SECRET=your-secure-random-string-here
```

You can generate one using:
```bash
openssl rand -base64 32
```

### 4. Firebase Admin Service Account (PENDING)

**Status**: ⏳ Service account creation is currently restricted by organization policies.

When available, follow these steps:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (san-diego-yacht-rock)
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Convert it to a single-line JSON string and add to `.env.local`:

```
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"san-diego-yacht-rock",...}'
```

To convert the JSON file to a single line, you can use:
```bash
node -e "console.log(JSON.stringify(require('./path-to-service-account.json')))"
```

**Note**: The monitoring system will automatically activate once this is configured.

## Vercel Production Setup

For production deployment on Vercel:

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add all the above variables
4. Redeploy your application

## Testing the Monitoring System

### Test Connection
First, test that everything is configured correctly:
```
http://localhost:3000/api/test-monitoring
```

This endpoint will verify:
- Firebase Admin SDK connection
- Database access
- Registration counting logic

### Manual Alert Test
Visit: `/api/cron/check-registrations?secret=YOUR_CRON_SECRET`

This will manually trigger the registration check and send an email if no registrations are found.

### Check Logs
Monitor the Vercel Functions logs to see when the cron job runs:
- Go to Vercel Dashboard → Functions tab
- Look for `check-registrations` function logs

## Email Notifications

When no registrations are detected in the past hour, you'll receive an email with:
- Alert message
- Time period checked
- Total registration count
- Last registration timestamp
- Link to admin dashboard

## Troubleshooting

### Email not sending
- Verify RESEND_API_KEY is correct
- Check Resend dashboard for API logs
- Ensure NOTIFICATION_EMAIL is valid

### Cron not running
- Check Vercel Functions logs for errors
- Verify cron configuration in vercel.json
- Ensure CRON_SECRET matches in environment variables

### Firebase access issues
- Verify FIREBASE_SERVICE_ACCOUNT is properly formatted
- Check service account has correct permissions
- Ensure Firebase project ID matches