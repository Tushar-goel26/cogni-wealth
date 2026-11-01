import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'amber' | 'rose' | 'indigo' | 'gray' | 'outline'
  size?: 'sm' | 'md'
  dot?: boolean
  children?: React.ReactNode
}

export function Badge({
  variant = 'gray',
  size = 'md',
  dot = false,
  className = '',
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full select-none whitespace-nowrap'

  const variants = {
    emerald:
      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25',
    amber:
      'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25',
    rose:
      'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/25',
    indigo:
      'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-500/25',
    gray:
      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
    outline:
      'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-transparent',
  }

  const dotColors = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    indigo: 'bg-indigo-500',
    gray: 'bg-gray-400',
    outline: 'bg-gray-400',
  }

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
  }

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  )
}
