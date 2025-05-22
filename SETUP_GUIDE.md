# Project Setup and Configuration Guide

This guide details the necessary environment variables and Supabase project configuration required to run this Next.js application effectively.

## 1. Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables. **Never commit this file to your version control system if it contains sensitive keys.**

### 1.1. Supabase Configuration

*   `NEXT_PUBLIC_SUPABASE_URL`
    *   **Description:** The URL of your Supabase project.
    *   **Example:** `https://your-project-id.supabase.co`
    *   **How to find:** In your Supabase project dashboard, go to `Project Settings > API > Project URL`.

*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   **Description:** The anonymous public key for your Supabase project. This key is safe to expose in a client-side application.
    *   **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...`
    *   **How to find:** In your Supabase project dashboard, go to `Project Settings > API > Project API keys > anon public`.

### 1.2. Application URL Configuration

*   `NEXT_PUBLIC_APP_URL`
    *   **Description:** The publicly accessible URL of this Next.js application. This is crucial for features like OAuth redirects.
    *   **For Local Development:** This will typically be `http://localhost:3000`.
    *   **For Production:** This should be the canonical URL where your application is hosted (e.g., `https://yourapp.com`).
    *   **Important:** Ensure this URL matches exactly what you configure in OAuth providers (like Google) and what Supabase expects for redirects.

## 2. Supabase Project Setup

Beyond basic project creation, specific configurations are needed within your Supabase project for authentication and user management to function correctly.

### 2.1. Google OAuth Provider Configuration

To enable "Sign in with Google" functionality:

1.  **Enable Google Provider:**
    *   In your Supabase project dashboard, navigate to `Authentication > Providers`.
    *   Enable the "Google" provider.
2.  **Configure Google Cloud Console:**
    *   You will need to provide a "Client ID" and "Client Secret" from your Google Cloud Console project.
    *   Follow the official Supabase guide for detailed steps on obtaining these: [Supabase Docs: Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
3.  **Set Redirect URI (Callback URL):**
    *   In the Supabase Google provider settings, you need to specify the **Authorized redirect URI**.
    *   This URI **must** be: `[YOUR_NEXT_PUBLIC_APP_URL]/auth/callback`
    *   **Example:** If `NEXT_PUBLIC_APP_URL` is `http://localhost:3000`, the redirect URI is `http://localhost:3000/auth/callback`.
    *   **Example (Production):** If `NEXT_PUBLIC_APP_URL` is `https://yourapp.com`, the redirect URI is `https://yourapp.com/auth/callback`.
    *   Ensure this also matches what's configured in your Google Cloud Console OAuth credentials.

### 2.2. Public `users` Table

The application requires a public table (by default named `users`) to store user profile information that is not part of the `auth.users` table but is accessible by your application.

*   **Table Name:** `users` (This is the default assumed by `store/authStore.ts`. If you use a different name, update the store accordingly).
*   **Essential Columns:**
    *   `id`: `UUID`. This **must** be the primary key and a foreign key referencing `auth.users.id`.
    *   `email`: `TEXT`. Stores the user's email. Can be useful for display or direct queries.
    *   `full_name`: `TEXT` (or appropriate type). Stores the user's full name, provided during signup.
    *   `created_at`: `TIMESTAMPTZ` with default value `now()`.
    *   *(Add any other profile-related columns your application needs, e.g., `avatar_url`, `preferences`)*

### 2.3. User Profile Creation Trigger

To ensure that a user profile is automatically created in your public `users` table whenever a new user signs up (i.e., an entry is added to Supabase's `auth.users` table), it is highly recommended to use a PostgreSQL trigger.

1.  **Purpose:** This trigger listens for new user entries in `auth.users` and then inserts a corresponding row into `public.users`.
2.  **SQL Snippet:**
    You can create this trigger by running the following SQL in the Supabase SQL Editor (`Supabase Dashboard > SQL Editor > New query`):

    ```sql
    -- Function to create a user profile in public.users
    create or replace function public.handle_new_user()
    returns trigger
    language plpgsql
    security definer set search_path = public -- Important for security and accessing public schema
    as $$
    begin
      insert into public.users (id, email, full_name) -- Adjust columns if your table differs
      values (
        new.id, 
        new.email, 
        new.raw_user_meta_data->>'full_name' -- Extracts 'full_name' from the metadata
      );
      return new;
    end;
    $$;

    -- Trigger to call the function after a new user is inserted into auth.users
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
    ```

3.  **Important Considerations for `full_name`:**
    *   The SQL snippet above assumes that `full_name` is passed in the `options.data` object during the `supabase.auth.signUp()` call in your application (see `store/authStore.ts`).
    *   The `signUp` call in `store/authStore.ts` is:
        ```typescript
        // From store/authStore.ts
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName, // This 'full_name' key must match the trigger
            },
          },
        })
        ```
    *   If you use a different key in `options.data` (e.g., `displayName`), you **must** update the trigger accordingly: `new.raw_user_meta_data->>'displayName'`.
    *   Ensure the data type of the `full_name` column in your `users` table is compatible (e.g., `TEXT`).

By following these setup instructions, your Next.js application should integrate correctly with Supabase for authentication and user management.
---
