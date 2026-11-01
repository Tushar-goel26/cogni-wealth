import React from 'react'
import { ArrowLeftRight, Filter, Plus, Smartphone, Upload } from 'lucide-react'
import { Card, Button, Badge, EmptyState } from '@/components/ui'

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Transactions &amp; Payment Apps
            </h1>
            <Badge variant="indigo" size="sm">
              Tier 1
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Cash wallet, simulated UPI apps, CSV import &amp; canonical deduplication.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Smartphone className="w-4 h-4" />}>
            Scan Apps
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Upload className="w-4 h-4" />}>
            Import CSV
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Add Spend
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <EmptyState
          icon={<ArrowLeftRight className="w-7 h-7 text-indigo-500" />}
          title="No transactions recorded yet"
          description="Scan simulated payment apps on your phone, upload a bank CSV, or record a cash payment to begin building your financial twin."
          action={
            <div className="flex gap-2">
              <Button variant="primary" size="sm">
                Scan Simulated Phone Apps
              </Button>
            </div>
          }
        />
      </Card>
    </div>
  )
}
