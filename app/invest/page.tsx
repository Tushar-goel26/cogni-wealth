import React from 'react'
import { Coins, Sliders } from 'lucide-react'
import { Card, Badge, EmptyState, Button } from '@/components/ui'

export default function InvestPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Invest &amp; Paper Portfolio
            </h1>
            <Badge variant="amber" size="sm">
              Educational / Simulated
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Self-Invest recommendations and deterministic Auto-Invest decision cycle engine.
          </p>
        </div>

        <Button variant="primary" size="sm" leftIcon={<Sliders className="w-4 h-4" />}>
          Risk Questionnaire
        </Button>
      </div>

      <Card className="p-6">
        <EmptyState
          icon={<Coins className="w-7 h-7 text-amber-500" />}
          title="Paper Portfolio &amp; Auto-Invest"
          description="Build an illustrative allocation with conservative glide paths, monthly decision logs, and full user approval control."
        />
      </Card>
    </div>
  )
}
