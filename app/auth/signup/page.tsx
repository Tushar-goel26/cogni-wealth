'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabase, friendlyAuthError } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)
    try {
      const supabase = getSupabase()
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: undefined },
      })
      if (authError) {
        setError(friendlyAuthError(authError.message))
        return
      }
      // Sign in immediately after sign-up (no email confirmation in dev)
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (loginError) {
        // Account created, but auto-login failed – send to login
        router.push('/auth/login')
        return
      }
      router.push('/')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Cogni Wealth</h1>
          <p className="mt-1 text-sm text-gray-400">Create your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 rounded-2xl shadow-xl p-8 space-y-5"
        >
          {error && (
            <div className="rounded-lg bg-rose-900/40 border border-rose-700 text-rose-300 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-gray-800 border border-gray-700 text-white px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-gray-800 border border-gray-700 text-white px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl bg-gray-800 border border-gray-700 text-white px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 text-sm transition-colors"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
