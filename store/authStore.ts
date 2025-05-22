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
        await get().fetchUser()
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      set({ isLoading: false })
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await get().fetchUser()
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, isAuthenticated: false })
      }
    })
  },

  fetchUser: async () => {
    const supabase = createClient()
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
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
        console.error('Error fetching user data:', error.message)
        set({ user: null, isAuthenticated: false })
        return
      }

      set({ 
        user: userData as User, 
        isAuthenticated: true 
      })
    } catch (error) {
      console.error('Error fetching user:', error)
      set({ user: null, isAuthenticated: false })
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