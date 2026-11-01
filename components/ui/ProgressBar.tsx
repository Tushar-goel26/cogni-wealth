import React from 'react'

export interface ProgressBarProps {
  value: number
  max?: number
  variant?: 'emerald' | 'amber' | 'rose' | 'indigo'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'indigo',
  size = 'md',
  showLabel = false,
  label,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const fillColors = {
    indigo: 'bg-indigo-600 dark:bg-indigo-500',
    emerald: 'bg-emerald-600 dark:bg-emerald-500',
    amber: 'bg-amber-500 dark:bg-amber-400',
    rose: 'bg-rose-600 dark:bg-rose-500',
  }

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
          <span>{label}</span>
          {showLabel && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={`w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden ${heightClasses[size]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${fillColors[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
