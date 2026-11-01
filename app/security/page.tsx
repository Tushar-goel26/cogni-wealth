import React from 'react'
import { ShieldCheck, History, Trash2, KeyRound } from 'lucide-react'
import { Card, Badge, Button, EmptyState } from '@/components/ui'
import { LogoutButton } from '@/components/auth/LogoutButton'

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Security &amp; Audit
            </h1>
            <Badge variant="emerald" size="sm">
              Strict RLS &amp; Zero Money Movement
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Privacy controls, decision logs, audit trail, and simulated account management.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Hackathon Security Guarantees
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Non-negotiable product safeguards
              </p>
            </div>
          </div>
          <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
            <li>Never asks for UPI PIN, passwords, or OTP.</li>
            <li>All investment portfolios are simulated on paper.</li>
            <li>Row-level security enforces data isolation per user.</li>
            <li>Deterministic calculation engines with no autonomous execution.</li>
          </ul>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Session &amp; Account
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Manage your authenticated demo session
              </p>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Current session</span>
            <LogoutButton />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <EmptyState
          icon={<History className="w-7 h-7 text-gray-400" />}
          title="Audit Trail Clean"
          description="Every duplicate merge, twin adaptation approval, rule modification, and investment decision is recorded in the permanent audit log."
        />
      </Card>
    </div>
  )
}
