import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { AuthState, User } from '@/types/auth'


export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  initialize: async () => {
    set({ isLoading: true })
    const supabase = createClient()
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        set({ isAuthenticated: true }) // User has an active session
        await get().fetchUser() // Fetch full profile, isAuthenticated remains true even if this fails
      } else {
        set({ user: null, isAuthenticated: false })
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      set({ isLoading: false })
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (session?.user) {
          set({ isAuthenticated: true, isLoading: true });
          try {
            await get().fetchUser(); // Fetch full profile, including email_confirmed_at
          } finally {
            set({ isLoading: false });
          }
        } else {
          // This case might occur if USER_UPDATED happens but session somehow becomes invalid
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, isAuthenticated: false });
      }
    })
  },

  fetchUser: async () => {
    set({ isLoading: true })
    const supabase = createClient()
    let authUserFromGetUse // To store authUser if needed in catch/finally
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      authUserFromGetUse = authUser // Store for later use
      
      if (!authUser) {
        set({ user: null, isAuthenticated: false })
        return
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) { // Error fetching from public.users table
        console.error('Error fetching user data from "users" table:', error.message)
        // If authUser exists, user is authenticated, but profile data from 'users' table might be missing.
        // Set user to essential data from authUser and keep isAuthenticated true.
        const partialUser: User = {
          id: authUser.id,
          email: authUser.email!, // email should be non-null if authUser exists
          email_confirmed_at: authUser.email_confirmed_at,
          auth_created_at: authUser.created_at,
          auth_updated_at: authUser.updated_at,
          // Initialize other fields from User type as undefined or with default values
          // as they are missing from the 'users' table.
          full_name: '', // Default or indicate missing
          avatar_url: undefined,
          // @ts-ignore - TODO: Define default enums or make them optional in User type
          subscription_tier: undefined, 
          // @ts-ignore
          subscription_status: undefined,
          created_at: '', // This would be public.users.created_at, which we couldn't fetch
          updated_at: '', // This would be public.users.updated_at
        };
        set({ user: partialUser, isAuthenticated: true });
        return;
      }

      // Combine authUser data with userData from public.users
      const combinedUser: User = {
        // Core auth fields from authUser
        id: authUser.id,
        email: authUser.email!, // email should be non-null if authUser exists
        email_confirmed_at: authUser.email_confirmed_at,
        auth_created_at: authUser.created_at,
        auth_updated_at: authUser.updated_at,
        
        // Profile fields from userData (public.users)
        // Cast userData to a partial User type to avoid conflicts with fields already set from authUser
        ...(userData as Omit<User, 'id' | 'email' | 'email_confirmed_at' | 'auth_created_at' | 'auth_updated_at'>),
      };
      set({ user: combinedUser, isAuthenticated: true });

    } catch (error) {
      console.error('Error in fetchUser:', error)
      // If there's a general error and authUserFromGetUse was available (captured earlier),
      // default to a state where the user is considered authenticated with basic info from authUser.
      if (authUserFromGetUse) {
        const basicUser: Partial<User> = { // Use Partial<User> as we might not have full_name etc.
          id: authUserFromGetUse.id,
          email: authUserFromGetUse.email,
          email_confirmed_at: authUserFromGetUse.email_confirmed_at,
          auth_created_at: authUserFromGetUse.created_at,
          auth_updated_at: authUserFromGetUse.updated_at,
        };
        set({
          user: basicUser as User, // Cast to User, acknowledging it might be partial
          isAuthenticated: true,
        });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } finally {
      set({ isLoading: false })
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true })
    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        return { error: error.message }
      }

      // User will be created in database via trigger
      // IMPORTANT: Ensure you have a trigger set up in your Supabase database
      // that creates a corresponding user profile in your public 'users' table
      // whenever a new user signs up in 'auth.users'.
      // This profile is fetched by fetchUser().
      return {}
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: 'An unexpected error occurred' }
    } finally {
      set({ isLoading: false })
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true })
    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: 'An unexpected error occurred' }
    } finally {
      set({ isLoading: false })
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true })
    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      console.error('Google sign in error:', error)
      return { error: 'An unexpected error occurred' }
    } finally {
      set({ isLoading: false })
    }
  },

  signOut: async () => {
    set({ isLoading: true })
    const supabase = createClient()

    try {
      await supabase.auth.signOut()
      set({ user: null, isAuthenticated: false })
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      set({ isLoading: false })
    }
  },
}))