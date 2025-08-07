# Content Management System Instructions

## 🚀 Getting Started

Your website now has a powerful content management system that allows non-technical users to edit all website content through a simple admin interface.

## 📍 Admin Access

- **Admin URL**: `https://yoursite.com/admin`
- **Login URL**: `https://yoursite.com/admin/login`

## 🔐 First Time Setup

1. **Navigate to Setup Page**
   - Go to `/admin/setup` when logged in as admin
   - Or click "Initial Setup Guide" from the admin dashboard

2. **Initialize Content** (One-time only)
   - Click "Initialize Content" to populate your database with default content
   - This creates all the initial page content, artists, schedule, and tickets

3. **Create Admin Account**
   - Enter your name, email, and password
   - **IMPORTANT**: Save these credentials - you'll need them to log in!
   - Password must be at least 6 characters

## 📝 Editing Content

### Access the Admin Dashboard
1. Go to `/admin`
2. Log in with your admin credentials
3. You'll see all editable sections

### Edit Any Section
1. Click on the section you want to edit (Home, Lineup, Schedule, etc.)
2. Make your changes in the form fields
3. Use the "Show Preview" button to see changes before saving
4. Click "Save Changes" to publish instantly

### Content Sections Available:

#### 🏠 **Home Page**
- Main headline and subheadline
- Event details (date, time, venue, address)
- Form labels and success messages
- Trust builders (bullet points)

#### 🎸 **Lineup**
- Add/remove artists
- Set performance times
- Categorize as headliner, featured, or opener
- Drag to reorder artists

#### 📅 **Schedule**
- Event timeline
- Add/edit schedule items
- Important notes section

#### 🎟️ **Tickets**
- Ticket tiers and pricing
- Features for each tier
- Contact information
- Ticket policies

#### 🧭 **Navigation**
- Menu items
- CTA button text
- Event info in menu

#### ⚙️ **Site Settings**
- SEO metadata
- Page titles
- Site description

## 💡 Tips for Content Editors

### Best Practices
- **Preview Before Publishing**: Always use the preview feature to check your changes
- **Keep It Simple**: Don't use excessive formatting or special characters
- **Save Regularly**: Changes are saved when you click "Save Changes"
- **Mobile Check**: The preview shows desktop view - check the live site on mobile too

### Adding Emojis
- You can add emojis directly in text fields
- Copy and paste from [Emojipedia](https://emojipedia.org/)
- Use sparingly for best results

### Managing Artists
- Click "Add Artist" to add new performers
- Use the up/down arrows to reorder
- Categories affect styling (headliners are highlighted)

### Event Details Format
- Date format: "SAT OCT 11 • 2025"
- Time format: "5PM - 10PM"
- Keep venue names in ALL CAPS for consistency

## 🔧 Troubleshooting

### Can't Log In?
1. Check your email and password
2. Click "Forgot your password?" to reset
3. Contact support if issues persist

### Changes Not Showing?
1. Make sure you clicked "Save Changes"
2. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. Check that you're viewing the correct page

### Content Disappeared?
- The system uses fallback content if database is unavailable
- Your content is safe in Firebase
- Try refreshing the page

## 🆘 Support

For technical support or to add more admin users:
- Email: support@sdyachtrockfest.com
- Only existing admins can create new admin accounts

## 🎯 Quick Actions

### To Update Event Date
1. Go to `/admin/home`
2. Scroll to "Event Details"
3. Update the date field
4. Save changes

### To Add a New Artist
1. Go to `/admin/lineup`
2. Click "Add Artist"
3. Fill in name, time, and category
4. Save changes

### To Change Ticket Prices
1. Go to `/admin/tickets`
2. Edit the price for each tier
3. Update features if needed
4. Save changes

## 🚦 Content Status

- **Green "Live" status**: Your content is published and visible
- **Changes save automatically**: No need to worry about losing work
- **Version history**: All changes are tracked (coming soon)

---

## Developer Notes

### Firebase Setup Required
- Firebase project with Firestore and Authentication enabled
- Environment variables configured in `.env.local`
- Admin user created through Firebase Auth

### Technology Stack
- Next.js 15 with App Router
- Firebase Firestore for content storage
- Firebase Authentication for admin access
- TypeScript for type safety
- Tailwind CSS for styling

### Key Features
- Real-time content updates
- Live preview while editing
- Secure admin authentication
- Fallback content for reliability
- Mobile-responsive admin interface
- Caching for performance