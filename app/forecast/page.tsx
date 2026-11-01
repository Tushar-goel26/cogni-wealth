import React from 'react'
import { TrendingUp, Calculator } from 'lucide-react'
import { Card, Badge, EmptyState, Button } from '@/components/ui'

export default function ForecastPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Forecast &amp; Simulator
            </h1>
            <Badge variant="indigo" size="sm">
              Monte Carlo &amp; Shortfall Warning
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Month-end balance forecast, shortfall alarms, and Plan A vs Plan B compounding simulator.
          </p>
        </div>

        <Button variant="outline" size="sm" leftIcon={<Calculator className="w-4 h-4" />}>
          Run Simulation
        </Button>
      </div>

      <Card className="p-6">
        <EmptyState
          icon={<TrendingUp className="w-7 h-7 text-indigo-500" />}
          title="Projection model ready"
          description="Projects month-end balances based on your current run-rate, recurring bills, and financial twin weekday spend curves."
        />
      </Card>
    </div>
  )
}
