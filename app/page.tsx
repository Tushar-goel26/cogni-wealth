import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// This page accesses cookies – opt out of static prerendering
export const instant = false

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Proxy already blocks unauthenticated users, but double-check
  if (!user) redirect('/auth/login')

  // Check onboarding: profile must have a name set
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, monthly_income')
    .eq('id', user.id)
    .single()

  if (!profile?.full_name) {
    redirect('/onboarding')
  }

  redirect('/overview')
}
