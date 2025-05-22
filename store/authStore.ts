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
      if (event === 'SIGNED_IN' && session?.user) {
        set({ isAuthenticated: true, isLoading: true }) // User signed in, indicate loading for fetchUser
        try {
          await get().fetchUser() // Fetch full profile, isAuthenticated remains true even if this fails
        } finally {
          set({ isLoading: false })
        }
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, isAuthenticated: false })
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

      if (error) {
        console.error('Error fetching user data from "users" table:', error.message)
        // If authUser exists, user is authenticated, but profile data from 'users' table might be missing.
        // Set user to essential data from authUser and keep isAuthenticated true.
        set({ 
          user: { 
            id: authUser.id, 
            email: authUser.email, 
            // You might want to add other essential fields from authUser if available
            // and indicate that other profile information is missing.
          } as User, // Cast to User, but acknowledge it's a partial representation
          isAuthenticated: true 
        })
        return
      }

      set({ 
        user: userData as User, 
        isAuthenticated: true 
      })
    } catch (error) {
      console.error('Error in fetchUser:', error)
      // If there's a general error and authUserFromGetUse was available (captured earlier),
      // default to a state where the user is considered authenticated with basic info.
      if (authUserFromGetUse) {
        set({
          user: {
            id: authUserFromGetUse.id,
            email: authUserFromGetUse.email,
          } as User, // Cast to User, but acknowledge it's a partial representation
          isAuthenticated: true,
        })
      } else {
        set({ user: null, isAuthenticated: false })
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