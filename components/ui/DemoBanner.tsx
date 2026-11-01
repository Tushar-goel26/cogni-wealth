'use client'

import React, { useState } from 'react'
import { AlertCircle, ShieldAlert, X } from 'lucide-react'

interface DemoBannerProps {
  dismissible?: boolean
  className?: string
}

export function DemoBanner({ dismissible = false, className = '' }: DemoBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      role="banner"
      aria-label="Simulation notice"
      className={`relative z-30 flex items-center justify-between px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-medium bg-amber-500/10 border-b border-amber-500/20 text-amber-300 dark:text-amber-300 backdrop-blur-xs transition-all ${className}`}
    >
      <div className="flex items-center gap-2 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
          <ShieldAlert className="w-3 h-3" />
          Simulated
        </span>
        <span className="truncate text-amber-200">
          <strong className="font-semibold text-amber-100">Demo Data Mode:</strong> All data is simulated. No real money movement, accounts, or transactions.
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        <span className="hidden md:inline-flex text-[11px] text-amber-300/80">
          Paper Portfolio &amp; Synthetic Twin
        </span>
        {dismissible && (
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1 rounded text-amber-400 hover:text-amber-200 hover:bg-amber-500/20 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
