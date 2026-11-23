import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Check, AlertTriangle } from 'lucide-react'
import { QUALITY_STATUS } from '@/lib/algorithms/exerciseEvaluator'

export function RepetitionTracker({
  currentReps = 7,
  targetReps = 10,
  history = [],
}) {
  const percentComplete = Math.min(100, Math.round((currentReps / targetReps) * 100))

  return (
    <Card className="shadow-xs border-border">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Target Latihan Hari Ini
          </span>
          <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
            {percentComplete}% Selesai
          </span>
        </div>

        {/* Big Counter */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-foreground font-mono">
            {currentReps}
          </span>
          <span className="text-lg font-bold text-muted-foreground">
            / {targetReps} KALI LATIHAN
          </span>
        </div>

        {/* 10 Repetition Status Badges */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 pt-1">
          {Array.from({ length: targetReps }).map((_, index) => {
            const repIndex = index + 1
            const repData = history.find((h) => h.repNumber === repIndex)
            const isCompleted = repIndex <= currentReps

            let chipClass = 'bg-secondary-100 text-muted-foreground border-transparent'
            let content = <span className="font-mono text-xs">{repIndex}</span>

            if (isCompleted) {
              if (repData && repData.quality === QUALITY_STATUS.COMPENSATORY) {
                chipClass = 'bg-rose-100 text-rose-700 border-rose-300'
                content = <AlertTriangle className="h-3.5 w-3.5 stroke-[2.5]" />
              } else {
                chipClass = 'bg-emerald-100 text-emerald-800 border-emerald-300'
                content = <Check className="h-3.5 w-3.5 stroke-[3]" />
              }
            }

            return (
              <div
                key={repIndex}
                className={`h-8 rounded-lg flex items-center justify-center font-semibold text-xs border transition-colors ${chipClass}`}
                title={`Repetisi ke-${repIndex}${
                  repData ? ` (${repData.quality})` : isCompleted ? ' (Selesai)' : ' (Belum)'
                }`}
              >
                {content}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
