import React from 'react'
import { Sparkles, AlertTriangle, Droplets, Users } from 'lucide-react'
import { Card, Badge, EmptyState } from '@/components/ui'

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Insights &amp; Financial Twin
            </h1>
            <Badge variant="amber" size="sm">
              Anomalies &amp; Leaks
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Detect spend anomalies, subscription leaks, and lifestyle drift proposals.
          </p>
        </div>
      </div>

      <Card className="p-6">
        <EmptyState
          icon={<Sparkles className="w-7 h-7 text-amber-500" />}
          title="Twin intelligence active"
          description="Once transactions are recorded, our deterministic twin model evaluates anomalies (>2.5 sigma), recurring leaks, and lifestyle creep guard proposals."
        />
      </Card>
    </div>
  )
}
