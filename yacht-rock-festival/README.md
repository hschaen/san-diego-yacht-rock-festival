# San Diego Yacht Rock Festival

A responsive landing page for San Diego's Premier Yacht Rock Festival built with Next.js, Tailwind CSS, shadcn/ui components, and Firebase.

## Features

- Mobile-responsive design
- Form to collect name, email, and phone number (all required)
- Firebase Firestore integration for data storage
- Beautiful background imagery and branding
- Deploy-ready for Vercel

## Setup Instructions

1. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database
   - Get your Firebase configuration keys
   - Update `.env.local` with your Firebase credentials:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

## Deployment to Vercel

1. Push your code to a GitHub repository
2. Connect your GitHub repository to Vercel
3. Add your environment variables in Vercel's project settings
4. Deploy!

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Firebase** - Backend services for data storage
- **TypeScript** - Type safety

## Project Structure

```
yacht-rock-festival/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page with form
├── components/
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── firebase.ts      # Firebase configuration
│   └── utils.ts         # Utility functions
├── public/
│   └── assets/          # Images and logos
└── .env.local           # Environment variables
```

## Data Structure

Registration data is stored in Firebase Firestore with the following structure:
- `name`: User's full name
- `email`: User's email address
- `phone`: User's phone number
- `timestamp`: Registration date and time