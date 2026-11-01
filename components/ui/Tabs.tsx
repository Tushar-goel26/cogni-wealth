'use client'

import React from 'react'

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string | number
  disabled?: boolean
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'pills' | 'underline' | 'segmented'
  size?: 'sm' | 'md'
  className?: string
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  size = 'md',
  className = '',
}: TabsProps) {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2',
  }

  if (variant === 'segmented') {
    return (
      <div
        role="tablist"
        className={`inline-flex items-center p-1 rounded-xl bg-gray-100 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/60 ${className}`}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 ${
                sizeClasses[size]
              } ${
                isActive
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              } ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive
                      ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  if (variant === 'underline') {
    return (
      <div
        role="tablist"
        className={`flex items-center border-b border-gray-200 dark:border-gray-800 gap-4 sm:gap-6 overflow-x-auto no-scrollbar ${className}`}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={`inline-flex items-center font-medium pb-2.5 border-b-2 -mb-px transition-colors whitespace-nowrap ${
                sizeClasses[size]
              } ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              } ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // Default: pills
  return (
    <div
      role="tablist"
      className={`flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center font-medium rounded-xl transition-all duration-150 ${
              sizeClasses[size]
            } ${
              isActive
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            } ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
