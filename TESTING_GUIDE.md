# Authentication Testing Guide

## 1. Introduction and Prerequisites

This guide provides a structured approach to testing the authentication flows within the application. Thorough testing of these scenarios is crucial to ensure a secure and reliable user experience.

### 1.1. Prerequisites & Setup

Before starting any tests, ensure the following:

*   **Supabase Project:**
    *   A Supabase project is set up and running.
    *   Database schema is migrated, including the public `users` table.
    *   **Database Trigger:** A trigger is configured in Supabase to automatically create a new row in the public `users` table when a new user signs up in `auth.users`. This trigger should populate at least the `id` and `email` fields, and ideally `full_name` if provided during signup.
    *   **Email Verification:** Note your Supabase project's email verification settings (`Auth > Providers > Email > Confirm email`). If enabled, this will affect signup flows. By default, Supabase sends a confirmation email.
    *   **Google OAuth Provider:**
        *   Google OAuth provider is enabled in Supabase (`Auth > Providers > Google`).
        *   Valid Client ID and Client Secret are configured.
        *   The redirect URI in your Google Cloud Console matches `[YOUR_SUPABASE_URL]/auth/v1/callback`.
*   **Application Environment Variables:**
    *   `NEXT_PUBLIC_SUPABASE_URL`: Correctly points to your Supabase project URL.
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Correctly set with your Supabase project's anon key.
    *   `NEXT_PUBLIC_APP_URL`: Correctly set to the publicly accessible URL of your application (e.g., `http://localhost:3000` for local testing, or your production URL). This is critical for OAuth callback and email link redirections.
*   **Browser:**
    *   Use a modern web browser (Chrome, Firefox, Safari, Edge).
    *   Have developer tools accessible for inspecting network requests, console logs, and application storage (cookies, local storage).
*   **Clean State (Recommended for each major scenario):**
    *   Clear browser cookies and site data for the application domain.
    *   Consider using an incognito/private browsing window for a clean session.
    *   Ensure no users with the test email addresses exist in your Supabase `auth.users` or public `users` tables unless specified by the test case (e.g., testing login with existing user).

### 1.2. General Testing Notes

*   Pay attention to UI feedback (loading states, success/error messages, toasts).
*   Keep the browser's developer console open to catch any client-side errors.
*   Monitor network requests (especially those to Supabase) to understand API interactions.
*   Check Supabase logs (`Project Logs` in the Supabase dashboard) for backend errors or more detailed information.

## 2. Key Authentication Scenarios

---

### 2.1. Email/Password Signup

#### 2.1.1. New User Registration (Email Verification Disabled or Post-Verification)

*   **Preconditions:**
    *   Supabase project is set up with the necessary environment variables.
    *   Supabase trigger for creating a public `users` profile is active.
    *   Email verification in Supabase is either disabled, OR this test assumes the user has already clicked the verification link.
    *   The email address to be used (e.g., `testuser_new_[timestamp]@example.com`) does not exist in `auth.users` or `public.users`.
*   **Steps to Execute:**
    1.  Navigate to the application's signup page (`/auth/signup`).
    2.  Fill in the "Full Name", "Email", and "Password" / "Confirm Password" fields with valid, new user information.
    3.  Click the "Create Account" button.
*   **Expected Outcome:**
    *   A success toast/message is displayed (e.g., "Account created successfully!").
    *   User is redirected to the login page (`/auth/login`) or directly to the dashboard (`/dashboard`) depending on application flow after signup (if email verification is disabled). If email verification is enabled, the message might instruct to check email, and redirection might be to the login page.
    *   The UI should indicate that the loading state (`isLoading`) was active during the signup process and is now false.
*   **Verification Points:**
    *   **Redirection:** Browser URL matches the expected post-signup page.
    *   **Supabase `auth.users` Table:**
        *   A new entry exists for the registered email.
        *   The `email_confirmed_at` field will be populated if email verification is disabled, or null/empty if enabled and pending.
    *   **Supabase `public.users` Table:**
        *   A new entry exists corresponding to the `auth.users` record.
        *   The `id` should match the `id` in `auth.users`.
        *   `email` and `full_name` (or equivalent) should be populated.
    *   **Application State:** (Using React DevTools or logging `useAuthStore`)
        *   If redirected to login: `isAuthenticated` should be `false`, `user` should be `null`.
        *   If redirected to dashboard (email verification disabled): `isAuthenticated` should be `true`, `user` object should be populated with details from the `public.users` table.
    *   **Console Logs:** No client-side errors. Network tab shows a successful POST request to Supabase's signup endpoint.

#### 2.1.2. New User Registration (Email Verification Enabled)

*   **Preconditions:**
    *   Same as 2.1.1, but **Email Verification is ENABLED** in Supabase settings.
    *   Access to the email inbox for the test email address.
*   **Steps to Execute:**
    1.  Navigate to the application's signup page (`/auth/signup`).
    2.  Fill in "Full Name", "Email", and "Password" / "Confirm Password" with valid, new user information.
    3.  Click the "Create Account" button.
    4.  Check the email inbox for the verification email from Supabase.
    5.  Click the verification link in the email.
*   **Expected Outcome:**
    *   **After Step 3:**
        *   A success toast/message is displayed (e.g., "Account created successfully! Please check your email to verify your account.").
        *   User is typically redirected to the login page (`/auth/login`) or a page instructing them to check their email.
    *   **After Step 5 (Clicking Verification Link):**
        *   The link opens in the browser, potentially showing a Supabase confirmation page or redirecting to the application's login page or directly to the dashboard (as configured by `NEXT_PUBLIC_APP_URL` and Supabase redirect settings).
*   **Verification Points:**
    *   **Supabase `auth.users` Table:**
        *   Initially, `email_confirmed_at` is null.
        *   After clicking the verification link, `email_confirmed_at` is populated with a timestamp.
    *   **Supabase `public.users` Table:** A corresponding profile is created.
    *   **Login Attempt:** After email verification, the user should be able to log in successfully (see Scenario 2.2.1).
    *   **Application State:** `isAuthenticated` remains `false` and `user` is `null` until the user explicitly logs in after verification.

#### 2.1.3. Attempting to Sign Up with an Existing Email

*   **Preconditions:**
    *   An email address (e.g., `existinguser@example.com`) already exists in the `auth.users` table.
*   **Steps to Execute:**
    1.  Navigate to the signup page (`/auth/signup`).
    2.  Fill in the form using the *existing* email address, a full name, and any password.
    3.  Click the "Create Account" button.
*   **Expected Outcome:**
    *   An error toast/message is displayed (e.g., "User already registered", "Email address already in use").
    *   User remains on the signup page.
    *   `isLoading` state is handled correctly (true during attempt, then false).
*   **Verification Points:**
    *   **UI:** Error message is visible.
    *   **Supabase `auth.users` Table:** No new user record is created. The existing record is unchanged.
    *   **Supabase `public.users` Table:** No new user profile is created.
    *   **Console Logs:** No unexpected client-side errors. Network tab may show a 4xx error from the Supabase signup endpoint.

---

### 2.2. Email/Password Login

#### 2.2.1. Login with Valid Credentials

*   **Preconditions:**
    *   A user exists in `auth.users` (e.g., `testuser_valid@example.com`) and has a confirmed email.
    *   A corresponding profile exists in `public.users`.
*   **Steps to Execute:**
    1.  Navigate to the login page (`/auth/login`).
    2.  Enter the valid email and password for the existing user.
    3.  Click the "Sign In" button.
*   **Expected Outcome:**
    *   A success toast/message is displayed (e.g., "Signed in successfully!").
    *   User is redirected to the main application page (e.g., `/dashboard`) or the `redirectTo` path if provided in the URL.
    *   `isLoading` state is handled correctly.
*   **Verification Points:**
    *   **Redirection:** Browser URL is `/dashboard` (or the `redirectTo` path).
    *   **Application State:** (Using React DevTools or logging `useAuthStore`)
        *   `isAuthenticated` is `true`.
        *   `user` object is populated with data from the `public.users` table (id, email, full_name, etc.).
    *   **Supabase:** No errors in Auth logs.
    *   **Browser Storage:** Supabase session cookies (e.g., `sb-access-token`, `sb-refresh-token`) are set.

#### 2.2.2. Login with Invalid Credentials (Wrong Password)

*   **Preconditions:**
    *   A user exists (e.g., `testuser_valid@example.com`) with a confirmed email.
*   **Steps to Execute:**
    1.  Navigate to the login page.
    2.  Enter the user's email but an incorrect password.
    3.  Click the "Sign In" button.
*   **Expected Outcome:**
    *   An error toast/message is displayed (e.g., "Invalid login credentials").
    *   User remains on the login page.
*   **Verification Points:**
    *   **UI:** Error message is visible.
    *   **Application State:** `isAuthenticated` remains `false`, `user` remains `null`.
    *   **Supabase Auth Logs:** May show a failed login attempt.

#### 2.2.3. Login with Non-Existent Email

*   **Preconditions:**
    *   The email address (e.g., `nonexistent@example.com`) is not registered in `auth.users`.
*   **Steps to Execute:**
    1.  Navigate to the login page.
    2.  Enter the non-existent email and any password.
    3.  Click the "Sign In" button.
*   **Expected Outcome:**
    *   An error toast/message is displayed (e.g., "Invalid login credentials").
    *   User remains on the login page.
*   **Verification Points:**
    *   **UI:** Error message is visible.
    *   **Application State:** `isAuthenticated` remains `false`, `user` remains `null`.

---

### 2.3. Google OAuth Signup/Login

#### 2.3.1. Signup with a New Google Account

*   **Preconditions:**
    *   Google OAuth is correctly configured in Supabase and `NEXT_PUBLIC_APP_URL` is set.
    *   The Google account to be used has not been previously used to sign up/in to this application.
    *   Clean browser state (no active Google session for another user, or use incognito).
*   **Steps to Execute:**
    1.  Navigate to the signup page (`/auth/signup`) or login page (`/auth/login`).
    2.  Click the "Continue with Google" button.
    3.  If prompted, select or log in to the desired Google account.
    4.  Authorize the application if Google requests permissions.
    5.  Browser is redirected back to the application's OAuth callback (`/auth/callback`).
*   **Expected Outcome:**
    *   The `/auth/callback` route exchanges the code for a session.
    *   User is redirected to the dashboard (`/dashboard`).
    *   A success message might be shown.
    *   `isLoading` state is handled correctly throughout the process.
*   **Verification Points:**
    *   **Redirection:** User lands on `/dashboard`.
    *   **Supabase `auth.users` Table:** A new user record is created with the Google account's email. `email_confirmed_at` should be populated (Google implicitly verifies email).
    *   **Supabase `public.users` Table:** A corresponding profile is created (via the trigger), populating `id`, `email`, and potentially `full_name` if available from Google and mapped by the trigger.
    *   **Application State:** `isAuthenticated` is `true`, `user` object is populated.
    *   **Browser Storage:** Supabase session cookies are set.

#### 2.3.2. Login with an Existing Google Account

*   **Preconditions:**
    *   The user has previously signed up/in using this Google account. A record exists in `auth.users` and `public.users`.
*   **Steps to Execute:**
    1.  Navigate to the signup or login page.
    2.  Click the "Continue with Google" button.
    3.  If prompted, select the previously used Google account.
    4.  Browser redirects to `/auth/callback`.
*   **Expected Outcome:**
    *   User is redirected to the dashboard (`/dashboard`).
    *   `isLoading` state is handled.
*   **Verification Points:**
    *   **Redirection:** User lands on `/dashboard`.
    *   **Supabase `auth.users` Table:** Existing record is used. Timestamps like `last_sign_in_at` might be updated.
    *   **Supabase `public.users` Table:** Existing profile is used.
    *   **Application State:** `isAuthenticated` is `true`, `user` object is populated.

---

### 2.4. Logout

*   **Preconditions:**
    *   User is currently logged in (authenticated session exists).
*   **Steps to Execute:**
    1.  Click the "Logout" button/link in the application.
*   **Expected Outcome:**
    *   A success message might be shown (e.g., "Signed out successfully").
    *   User is redirected to the login page (`/auth/login`) or home page.
    *   `isLoading` state is handled.
*   **Verification Points:**
    *   **Redirection:** Browser URL is the expected post-logout page.
    *   **Application State:** `isAuthenticated` is `false`, `user` is `null`.
    *   **Browser Storage:** Supabase session cookies are cleared or invalidated.
    *   **Protected Route Access:** Attempting to navigate to a protected route (e.g., `/dashboard`) should redirect to login (see Scenario 2.5.1).

---

### 2.5. Protected Route Access

#### 2.5.1. Accessing Protected Route When Not Authenticated

*   **Preconditions:**
    *   User is not logged in (no active session).
    *   Target route (e.g., `/dashboard`) is defined as protected in `middleware.ts`.
*   **Steps to Execute:**
    1.  Directly navigate to a protected route (e.g., type `/dashboard` in the browser address bar).
*   **Expected Outcome:**
    *   User is redirected to the login page (`/auth/login`).
    *   The URL of the login page includes a `redirectTo` query parameter pointing to the originally requested protected route (e.g., `/auth/login?redirectTo=%2Fdashboard`).
*   **Verification Points:**
    *   **Redirection:** Browser URL is the login page with the correct `redirectTo` parameter.
    *   **Login and Redirect:** After successfully logging in, the user should be redirected to the path specified in `redirectTo` (e.g., `/dashboard`).

#### 2.5.2. Accessing Protected Route When Authenticated

*   **Preconditions:**
    *   User is logged in.
*   **Steps to Execute:**
    1.  Directly navigate to a protected route (e.g., `/dashboard`).
*   **Expected Outcome:**
    *   User is allowed access to the protected route.
    *   The content of the protected route is displayed.
*   **Verification Points:**
    *   **UI:** Protected route content is visible.
    *   **Application State:** `isAuthenticated` is `true`.

---

### 2.6. Auth Route Access (While Authenticated)

*   **Preconditions:**
    *   User is currently logged in.
*   **Steps to Execute:**
    1.  Directly navigate to an authentication route (e.g., `/auth/login` or `/auth/signup`).
*   **Expected Outcome:**
    *   User is redirected away from the auth route to the main application area (e.g., `/dashboard`).
*   **Verification Points:**
    *   **Redirection:** Browser URL is `/dashboard` (or the configured default authenticated route).
    *   **Middleware Logs:** (If debugging) `middleware.ts` should log the redirection.

---

### 2.7. Session Persistence

*   **Preconditions:**
    *   User has successfully logged in.
*   **Steps to Execute:**
    1.  After logging in, close the browser tab or window where the application was open.
    2.  Reopen a new tab/window and navigate to the application's main URL (e.g., `/dashboard` or the root).
*   **Expected Outcome:**
    *   The application initializes, recognizes the existing valid session cookie.
    *   The user remains logged in and is taken to the dashboard or appropriate authenticated view without needing to re-enter credentials.
    *   The `initialize` function in `authStore` should handle session restoration.
*   **Verification Points:**
    *   **UI:** User is on an authenticated page (e.g., `/dashboard`).
    *   **Application State:** `isAuthenticated` is `true`, `user` object is populated.
    *   **Browser Storage:** Supabase session cookies are still present and valid.

---

## 3. Notes on Debugging

*   **Browser Developer Console:** Check for JavaScript errors, failed network requests, and console log messages.
*   **Network Requests Tab:** Inspect requests to Supabase (`/auth/v1/...`, `/rest/v1/...`). Check request payloads, response status codes, and response bodies.
*   **Supabase Dashboard Logs:**
    *   **Auth Logs:** `Supabase Dashboard > Auth > Logs` can provide details on specific authentication attempts (e.g., why a token exchange failed).
    *   **PostgREST Logs:** `Supabase Dashboard > API > Logs` shows logs for direct database interactions via the REST API.
    *   **Database Logs:** `Supabase Dashboard > Database > Logs` (or `Project Logs > Database Logs`) for more general database errors or trigger issues.
*   **Application State:** Use React DevTools (if applicable) or log `useAuthStore` state to understand `user`, `isAuthenticated`, and `isLoading` states.
*   **Environment Variables:** Double-check that all `NEXT_PUBLIC_...` variables are correctly set and accessible in the client-side environment.
*   **Middleware:** Add `console.log` statements in `middleware.ts` if you suspect issues with redirection logic.
*   **Callback Handler:** Add `console.log` statements in `app/auth/callback/route.ts` to debug OAuth code exchange issues.

---
