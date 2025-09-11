# Google OAuth Setup Guide

## Overview
Google OAuth has been successfully integrated into your Next.js application using NextAuth.js. This guide will help you complete the setup.

## What's Been Implemented

### ✅ Completed Tasks
1. **Database Schema Updated**: Added OAuth fields to User model (`googleId`, `provider`)
2. **NextAuth.js Installed**: Authentication library with Google provider
3. **API Routes Created**: `/api/auth/[...nextauth]` endpoint
4. **UI Components Updated**: Login and Signup forms now include Google buttons
5. **Session Provider Added**: NextAuth session management integrated
6. **Auth Utilities Enhanced**: Added OAuth-specific helper functions

### 🔧 Remaining Setup

## Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Configure OAuth consent screen if prompted
   - Set application type to "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
5. Copy the Client ID and Client Secret

## Step 2: Environment Variables

Update your `.env` file with the actual Google OAuth credentials:

```env
# GOOGLE OAUTH
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
```

## Step 3: Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/login` or `/signup`
3. Click "Continue with Google"
4. Complete the OAuth flow
5. Verify user creation in database

## Features Included

### 🔐 Authentication Flow
- **New Users**: Automatically creates account with Google profile data
- **Existing Users**: Links Google account to existing email if found
- **Profile Sync**: Updates avatar and name from Google profile
- **Secure Tokens**: JWT tokens with proper expiration and validation

### 🎨 UI Components
- Clean Google button with official branding
- Responsive design matching your existing theme
- Loading states and error handling
- Seamless integration with existing forms

### 🛡️ Security Features
- CSRF protection via NextAuth.js
- Secure token storage
- Proper session management
- OAuth state validation

## Database Schema Changes

The User model now includes:
```prisma
model User {
  // ... existing fields
  googleId    String? @unique @db.VarChar(255)
  provider    String? @default("local") @db.VarChar(20)
  // password is now optional for OAuth users
}
```

## API Endpoints

- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handler
- `GET /api/auth/signin/google` - Google OAuth initiation
- `GET /api/auth/callback/google` - OAuth callback handler

## Usage Examples

### Client-side Authentication
```javascript
import { signIn, signOut, useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session } = useSession();

  if (session) {
    return <div>Welcome {session.user.name}!</div>;
  }

  return (
    <button onClick={() => signIn('google')}>
      Sign in with Google
    </button>
  );
}
```

### Server-side Authentication
```javascript
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Access denied</div>;
  }

  return <div>Welcome {session.user.name}!</div>;
}
```

## Troubleshooting

### Common Issues

1. **"Invalid OAuth access token"**
   - Check Google Client ID and Secret
   - Verify redirect URIs in Google Console

2. **"State mismatch" error**
   - Clear browser cookies and try again
   - Check NEXTAUTH_URL environment variable

3. **Database connection issues**
   - Ensure Prisma schema is migrated
   - Check DATABASE_URL in .env

4. **Session not persisting**
   - Verify NEXTAUTH_SECRET is set
   - Check browser cookie settings

### Debug Mode
Enable NextAuth debug logging:
```env
NEXTAUTH_DEBUG=true
```

## Production Deployment

1. Update redirect URIs in Google Console for production domain
2. Set secure environment variables
3. Configure proper session storage if needed
4. Enable HTTPS for security

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables are set
3. Ensure database migrations are applied
4. Test with a fresh Google account

The Google OAuth integration is now ready for use! 🚀