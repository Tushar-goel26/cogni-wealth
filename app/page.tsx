import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// This page accesses cookies – opt out of static prerendering
export const instant = false

export default async function OverviewPage() {
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

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-white">
        Welcome back, {profile.full_name}!
      </h1>
      <p className="mt-2 text-gray-400">Your financial overview will appear here.</p>
    </main>
  )
}
