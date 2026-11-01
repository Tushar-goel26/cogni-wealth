import React from 'react'
import { Inbox } from 'lucide-react'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 ${className}`}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 mb-4 shadow-xs">
        {icon || <Inbox className="w-6 h-6 sm:w-7 sm:h-7" />}
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {title}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
