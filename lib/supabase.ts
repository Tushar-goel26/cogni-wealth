import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/** Singleton for client components */
let _client: ReturnType<typeof createClient> | null = null
export function getSupabase() {
  if (!_client) _client = createClient()
  return _client
}

/** Human-friendly Supabase auth error messages */
export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials') || m.includes('invalid email or password'))
    return 'Incorrect email or password. Please try again.'
  if (m.includes('email not confirmed'))
    return 'Please verify your email address before signing in.'
  if (m.includes('user already registered') || m.includes('already been registered'))
    return 'An account with this email already exists. Try signing in instead.'
  if (m.includes('password should be at least'))
    return 'Password must be at least 6 characters long.'
  if (m.includes('unable to validate email address'))
    return 'Please enter a valid email address.'
  if (m.includes('email rate limit exceeded') || m.includes('too many requests'))
    return 'Too many attempts. Please wait a few minutes and try again.'
  if (m.includes('network') || m.includes('fetch'))
    return 'Network error. Please check your connection and try again.'
  return message || 'Something went wrong. Please try again.'
}
