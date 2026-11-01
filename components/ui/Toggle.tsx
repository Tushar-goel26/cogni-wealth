'use client'

import React from 'react'

export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  className?: string
  id?: string
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
  id,
}: ToggleProps) {
  const generatedId = React.useId()
  const toggleId = id || generatedId

  const sizeClasses = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-4 h-4',
      translate: 'translate-x-5',
    },
  }

  return (
    <div className={`flex items-start justify-between gap-3 ${className}`}>
      {(label || description) && (
        <label
          htmlFor={toggleId}
          className={`flex flex-col select-none ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {label && (
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </span>
          )}
        </label>
      )}

      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex items-center shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 disabled:cursor-not-allowed disabled:opacity-50 p-1 ${
          sizeClasses[size].track
        } ${checked ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'}`}
      >
        <span
          className={`pointer-events-none inline-block rounded-full bg-white shadow-xs transform ring-0 transition duration-200 ease-in-out ${
            sizeClasses[size].thumb
          } ${checked ? sizeClasses[size].translate : 'translate-x-0'}`}
        />
      </button>
    </div>
  )
}
