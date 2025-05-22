# Configuring Google OAuth for Supabase Authentication

This guide explains how to set up Google OAuth in your Supabase project to enable "Login with Google" functionality.

## Step 1: Access Your Supabase Project Settings

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your Vocalyn project
3. In the sidebar, navigate to **Authentication** > **Providers**

## Step 2: Enable and Configure Google Provider

1. Find **Google** in the list of authentication providers
2. Toggle the switch to **Enable** Google authentication
3. You'll need to provide:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)

## Step 3: Set Up Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select your existing Vocalyn project
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** and select **OAuth client ID**
5. Configure the OAuth consent screen:
   - Choose **External** user type (or Internal if for organization use only)
   - Fill in your app name, user support email, and developer contact info
   - Add required scopes (typically `.../auth/userinfo.email` and `.../auth/userinfo.profile`)

## Step 4: Create OAuth Client ID

1. Application type: **Web application**
2. Name: `Vocalyn`
3. Authorized JavaScript origins:
   - `https://[YOUR_PROJECT_REFERENCE_ID].supabase.co` (for production)
   - `http://localhost:3000` (for local development)
4. Authorized redirect URIs:
   - `https://[YOUR_PROJECT_REFERENCE_ID].supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local development)

## Step 5: Add Credentials to Supabase

1. After creating the OAuth client, Google will provide you with:
   - Client ID
   - Client Secret
2. Copy these values to your Supabase Authentication Providers settings for Google
3. Save the changes in Supabase

## Step 6: Update Environment Variables

Make sure your application is using the correct environment variables:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000 # or your production URL
```

## Step 7: Test Authentication

1. Try signing up/logging in with Google again
2. The error "Unsupported provider" should no longer appear
3. You should be redirected to Google's consent page and then back to your application

## Troubleshooting

If you continue to experience issues:

1. Check your browser console for errors
2. Verify your Supabase and Google Cloud configuration
3. Ensure your redirect URIs are configured correctly
4. Check that your environment variables are set properly
5. Look at the Supabase Auth logs in the Supabase dashboard
