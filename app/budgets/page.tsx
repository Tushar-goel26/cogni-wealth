import React from 'react'
import { Target, Plus } from 'lucide-react'
import { Card, Badge, EmptyState, Button } from '@/components/ui'

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Budgets &amp; Goals
            </h1>
            <Badge variant="emerald" size="sm">
              Proactive Alerts
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track spending caps, goal target dates, and upcoming EMIs.
          </p>
        </div>

        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Create Budget / Goal
        </Button>
      </div>

      <Card className="p-6">
        <EmptyState
          icon={<Target className="w-7 h-7 text-emerald-500" />}
          title="No active budgets or goals set"
          description="Create custom category budgets with early warning thresholds or configure savings targets with calculated ETA."
        />
      </Card>
    </div>
  )
}
