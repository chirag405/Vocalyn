import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  
  // Determine the base URL for redirection.
  // Prioritize NEXT_PUBLIC_APP_URL, fallback to request origin.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // On successful code exchange, redirect to the 'next' path using the determined appUrl.
      // Ensure 'next' path starts with a '/' to avoid malformed URLs.
      const redirectPath = next.startsWith('/') ? next : `/${next}`
      return NextResponse.redirect(`${appUrl}${redirectPath}`)
    }
  }

  // If no code, or if code exchange fails, redirect to an error page.
  return NextResponse.redirect(`${appUrl}/auth/auth-code-error`)
}