import React from 'react'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { Card } from './Card'

export interface DeltaProps {
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  isPositive?: boolean // If true, up is green; if spend, up might be red so allow override
  timeframe?: string
}

export interface StatCardProps {
  label: string
  value: string | number
  delta?: DeltaProps | string | number
  icon?: React.ReactNode
  subtext?: string
  simulated?: boolean
  className?: string
  onClick?: () => void
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  subtext,
  simulated = false,
  className = '',
  onClick,
}: StatCardProps) {
  // Normalize delta
  let deltaObj: DeltaProps | null = null
  if (delta !== undefined && delta !== null) {
    if (typeof delta === 'object' && 'value' in delta) {
      deltaObj = delta
    } else {
      const deltaStr = String(delta)
      const isNegative = deltaStr.startsWith('-')
      const isPositive = deltaStr.startsWith('+')
      deltaObj = {
        value: deltaStr,
        trend: isNegative ? 'down' : isPositive ? 'up' : 'neutral',
        isPositive: isPositive ? true : isNegative ? false : undefined,
      }
    }
  }

  // Determine trend styling based on PROJECT.md colors:
  // emerald = positive/savings, amber = review, rose = over/anomaly
  let trendColor = 'text-gray-400 bg-gray-500/10'
  let TrendIcon = Minus

  if (deltaObj) {
    const isGood = deltaObj.isPositive !== undefined
      ? deltaObj.isPositive
      : deltaObj.trend === 'up'

    if (deltaObj.trend === 'neutral') {
      trendColor = 'text-amber-500 dark:text-amber-400 bg-amber-500/10'
      TrendIcon = Minus
    } else if (isGood) {
      trendColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
      TrendIcon = ArrowUpRight
    } else {
      trendColor = 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
      TrendIcon = ArrowDownRight
    }
  }

  return (
    <Card
      interactive={!!onClick}
      onClick={onClick}
      className={`p-5 sm:p-6 relative overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
          {label}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {simulated && (
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/20">
              Simulated
            </span>
          )}
          {icon && (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {icon}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
          {value}
        </div>
      </div>

      {(deltaObj || subtext) && (
        <div className="flex items-center gap-2 mt-2.5 flex-wrap text-xs">
          {deltaObj && (
            <div
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-medium ${trendColor}`}
            >
              <TrendIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{deltaObj.value}</span>
            </div>
          )}
          {(deltaObj?.timeframe || subtext) && (
            <span className="text-gray-500 dark:text-gray-400 truncate">
              {deltaObj?.timeframe ? `vs ${deltaObj.timeframe}` : subtext}
            </span>
          )}
        </div>
      )}
    </Card>
  )
}
