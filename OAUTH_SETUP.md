# OAuth Setup Guide for XNote

## Issue Resolution

The login page now shows both email/password inputs AND social login buttons for GitHub and Google. However, the OAuth providers need to be configured in your Supabase Dashboard for them to work.

## Fixed Issues

1. ✅ Changed `view="magic_link"` to `view="sign_in"` to show full login form
2. ✅ Set `showLinks={true}` to display sign-up/sign-in toggle
3. ✅ Added `socialLayout="horizontal"` for better button layout
4. ✅ Enhanced appearance with custom brand colors

## OAuth Provider Setup Required

### 1. GitHub OAuth Setup

#### Step 1: Create GitHub OAuth App

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: XNote
   - **Homepage URL**: `http://localhost:3001` (for development)
   - **Application description**: XNote Markdown Editor
   - **Authorization callback URL**: `http://localhost:3001/auth/callback`

#### Step 2: Configure in Supabase

1. Go to your Supabase Dashboard: https://lsayztyjqurdszzrjhtt.supabase.co
2. Navigate to **Authentication → Providers**
3. Find **GitHub** and click to configure
4. Enable the GitHub provider
5. Add your GitHub OAuth App credentials:
   - **Client ID**: From your GitHub OAuth app
   - **Client Secret**: From your GitHub OAuth app
6. Save the configuration

### 2. Google OAuth Setup

#### Step 1: Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Configure OAuth consent screen first if needed
6. For OAuth 2.0 Client ID:
   - **Application type**: Web application
   - **Name**: XNote
   - **Authorized origins**: `http://localhost:3001`
   - **Authorized redirect URIs**: `http://localhost:3001/auth/callback`

#### Step 2: Configure in Supabase

1. In your Supabase Dashboard: Authentication → Providers
2. Find **Google** and click to configure
3. Enable the Google provider
4. Add your Google OAuth credentials:
   - **Client ID**: From your Google Cloud Console
   - **Client Secret**: From your Google Cloud Console
5. Save the configuration

## Testing the Setup

### Development Testing (localhost:3001)

1. Start the development server: `npm run dev`
2. Navigate to http://localhost:3001/login
3. You should see:
   - Email input field
   - Password input field
   - "Continue with GitHub" button
   - "Continue with Google" button
   - Sign up/Sign in toggle link

### Production Setup

For production deployment, update the callback URLs in both:

- GitHub OAuth App settings
- Google Cloud Console settings
- Use your production domain instead of `localhost:3001`

## Current Login Page Features

- ✅ Email/password authentication
- ✅ GitHub OAuth button (needs provider setup)
- ✅ Google OAuth button (needs provider setup)
- ✅ Sign up/Sign in toggle
- ✅ Responsive design
- ✅ Custom branding colors

## Troubleshooting

### OAuth Buttons Not Working

- **Issue**: "Invalid OAuth provider" or redirect errors
- **Solution**: Ensure both the GitHub/Google apps are created AND configured in Supabase Dashboard

### Redirect Loop

- **Issue**: Keeps redirecting after OAuth
- **Solution**: Check that callback URLs match exactly in all three places:
  1. GitHub/Google OAuth app settings
  2. Supabase provider configuration
  3. Your application's redirect URL

### Development vs Production

- Use `localhost:3001` for development
- Use your actual domain for production
- Update all OAuth app settings when moving to production

## Next Steps

1. Set up GitHub OAuth app and configure in Supabase
2. Set up Google OAuth app and configure in Supabase
3. Test the authentication flow
4. Deploy to production and update OAuth callback URLs
