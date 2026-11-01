'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

type Step = 1 | 2 | 3

interface FormData {
  full_name: string
  monthly_income: string
  emergency_fund_saved: string
  opening_cash: string
}

const STEPS: { step: Step; title: string; subtitle: string }[] = [
  { step: 1, title: "What's your name?", subtitle: 'We\'ll personalise your experience.' },
  { step: 2, title: 'Monthly income', subtitle: 'Your take-home pay each month (after tax).' },
  { step: 3, title: 'Cash & emergency fund', subtitle: 'Set your starting balances.' },
]

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map(({ step }) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step === current
                ? 'bg-indigo-600 text-white'
                : step < current
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            {step < current ? '✓' : step}
          </div>
          {step < 3 && (
            <div
              className={`w-8 h-0.5 ${step < current ? 'bg-emerald-600' : 'bg-gray-700'}`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function InrInput({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-gray-500 mb-2">{hint}</p>}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
          ₹
        </span>
        <input
          type="number"
          min="0"
          step="1"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl bg-gray-800 border border-gray-700 text-white pl-8 pr-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="0"
        />
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormData>({
    full_name: '',
    monthly_income: '',
    emergency_fund_saved: '',
    opening_cash: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function set(key: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function next(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (step < 3) {
      setStep((s) => (s + 1) as Step)
    } else {
      handleFinish()
    }
  }

  async function handleFinish() {
    setSaving(true)
    setError('')
    try {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: form.full_name.trim(),
          monthly_income: parseFloat(form.monthly_income) || 0,
          emergency_fund_saved: parseFloat(form.emergency_fund_saved) || 0,
          opening_cash: parseFloat(form.opening_cash) || 0,
        })

      if (upsertError) throw upsertError

      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not save your details.'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const current = STEPS[step - 1]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Cogni Wealth</h1>
          <p className="mt-1 text-sm text-gray-400">Let&apos;s set up your profile</p>
        </div>

        <div className="bg-gray-900 rounded-2xl shadow-xl p-8">
          <StepIndicator current={step} />

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">{current.title}</h2>
            <p className="text-sm text-gray-400 mt-1">{current.subtitle}</p>
          </div>

          {error && (
            <div className="rounded-lg bg-rose-900/40 border border-rose-700 text-rose-300 px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={next} className="space-y-5">
            {step === 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={form.full_name}
                  onChange={(e) => set('full_name', e.target.value)}
                  className="w-full rounded-xl bg-gray-800 border border-gray-700 text-white px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Rahul Sharma"
                />
              </div>
            )}

            {step === 2 && (
              <InrInput
                label="Monthly take-home income"
                hint="Your salary or average monthly earnings after tax."
                value={form.monthly_income}
                onChange={(v) => set('monthly_income', v)}
              />
            )}

            {step === 3 && (
              <>
                <InrInput
                  label="Emergency fund saved"
                  hint="Money already set aside for emergencies (in bank / FD)."
                  value={form.emergency_fund_saved}
                  onChange={(v) => set('emergency_fund_saved', v)}
                />
                <InrInput
                  label="Cash in hand / wallet"
                  hint="Physical cash you have right now (opening balance)."
                  value={form.opening_cash}
                  onChange={(v) => set('opening_cash', v)}
                />
              </>
            )}

            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  className="flex-1 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 py-2.5 text-sm font-medium transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 text-sm transition-colors"
              >
                {step < 3 ? 'Continue' : saving ? 'Saving…' : 'Finish'}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-600">
          You can update these anytime from your profile.
        </p>
      </div>
    </div>
  )
}
