export interface User {
    id: string
    email: string
    full_name: string
    avatar_url?: string
    subscription_tier: 'starter' | 'professional' | 'enterprise' | 'unlimited'
    subscription_status: 'active' | 'cancelled' | 'past_due' | 'trialing'
    created_at: string
    updated_at: string
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