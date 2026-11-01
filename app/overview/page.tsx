'use client'

import React, { useState } from 'react'
import {
  TrendingUp,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Plus,
  RefreshCw,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
  Button,
  Badge,
  Tabs,
  ProgressBar,
} from '@/components/ui'
import { formatINR } from '@/lib/format'

export default function OverviewPage() {
  const [range, setRange] = useState('Month')

  const rangeTabs = [
    { id: 'Day', label: 'Day' },
    { id: 'Week', label: 'Week' },
    { id: 'Month', label: 'Month' },
    { id: 'Quarter', label: 'Quarter' },
    { id: 'Year', label: 'Year' },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header with Title and Range Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Financial Overview
            </h1>
            <Badge variant="indigo" size="sm">
              Live Twin
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Deterministic cash flow tracking &amp; financial twin model.
          </p>
        </div>

        {/* Range Switcher */}
        <div className="overflow-x-auto no-scrollbar">
          <Tabs
            tabs={rangeTabs}
            activeTab={range}
            onChange={setRange}
            variant="segmented"
            size="sm"
          />
        </div>
      </div>

      {/* 4 Key StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Monthly Income"
          value={formatINR(85000)}
          delta={{ value: '+4.2%', trend: 'up', isPositive: true, timeframe: 'last month' }}
          icon={<ArrowDownLeft className="w-4 h-4 text-emerald-500" />}
        />
        <StatCard
          label="Total Spend"
          value={formatINR(48250)}
          delta={{ value: '-6.8%', trend: 'down', isPositive: true, timeframe: 'twin pace' }}
          icon={<ArrowUpRight className="w-4 h-4 text-rose-500" />}
        />
        <StatCard
          label="Recorded Surplus"
          value={formatINR(36750)}
          delta={{ value: '+18.5%', trend: 'up', isPositive: true, timeframe: 'last month' }}
          icon={<Wallet className="w-4 h-4 text-indigo-500" />}
        />
        <StatCard
          label="Safe to Invest"
          value={formatINR(21200)}
          delta={{ value: 'Waterfall passed', trend: 'neutral', timeframe: 'surplus.ts' }}
          icon={<Sparkles className="w-4 h-4 text-amber-500" />}
          simulated
        />
      </div>

      {/* Two Column Layout: Budget Pace & Twin Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Budget & Cash Flow Pace */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Spending Pace &amp; Budget</CardTitle>
              <CardDescription>
                Comparison of canonical spend vs expected monthly limit.
              </CardDescription>
            </div>
            <Badge variant="emerald" dot>
              On Track
            </Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                <span>Month progress (Day 18 of 30)</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">60%</span>
              </div>
              <ProgressBar value={60} max={100} variant="indigo" size="sm" />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                <span>
                  Budget Spent: <strong>{formatINR(48250)}</strong> of {formatINR(65000)}
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatINR(16750)} remaining
                </span>
              </div>
              <ProgressBar value={48250} max={65000} variant="emerald" size="md" />
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
                    Safe-to-Invest Waterfall
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Reserves and 30-day obligations protected before investing.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Waterfall
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Col: Financial Twin Summary */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Financial Twin</CardTitle>
                <Badge variant="indigo" size="sm">
                  v1.0 Baseline
                </Badge>
              </div>
              <CardDescription>
                Recency-weighted synthetic model of your normal financial habits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                <span className="text-xs text-gray-500 dark:text-gray-400">Typical monthly spend</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {formatINR(51000)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                <span className="text-xs text-gray-500 dark:text-gray-400">Salary expectation day</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  1st of month
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                <span className="text-xs text-gray-500 dark:text-gray-400">Baseline drift guard</span>
                <Badge variant="emerald" size="sm">
                  Stable
                </Badge>
              </div>
            </CardContent>
          </div>
          <div className="p-5 sm:p-6 pt-0">
            <Button variant="secondary" size="sm" className="w-full">
              Explore Twin Model
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
