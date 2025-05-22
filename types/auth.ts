export interface User {
    id: string
    email: string
    full_name: string
    avatar_url?: string
    subscription_tier: 'starter' | 'professional' | 'enterprise' | 'unlimited'
    subscription_status: 'active' | 'cancelled' | 'past_due' | 'trialing'
    created_at: string // Typically from public.users table
    updated_at: string // Typically from public.users table
    
    // Fields from auth.users
    email_confirmed_at?: string | null 
    auth_created_at?: string // Supabase auth.users.created_at
    auth_updated_at?: string // Supabase auth.users.updated_at (last_sign_in_at might also be relevant)
  }
  
  export interface AuthState {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    signIn: (email: string, password: string) => Promise<{ error?: string }>
    signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
    signInWithGoogle: () => Promise<{ error?: string }>
    signOut: () => Promise<void>
    fetchUser: () => Promise<void>
    initialize: () => Promise<void>
  }