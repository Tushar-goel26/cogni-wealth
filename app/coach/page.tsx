import React from 'react'
import { Bot, Sparkles, Send } from 'lucide-react'
import { Card, Badge, EmptyState, Button } from '@/components/ui'

export default function CoachPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              AI Coach
            </h1>
            <Badge variant="indigo" size="sm">
              Gemini + Deterministic Fallback
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Answers grounded in computed numbers with explicit &quot;Based on&quot; citations.
          </p>
        </div>
      </div>

      <Card className="p-6">
        <EmptyState
          icon={<Bot className="w-7 h-7 text-indigo-500" />}
          title="Ask your Financial Coach"
          description="Ask questions about your surplus, spending anomalies, upcoming bills, or how much you can safely invest this month."
          action={
            <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-4 h-4" />}>
              Start a Conversation
            </Button>
          }
        />
      </Card>
    </div>
  )
}
