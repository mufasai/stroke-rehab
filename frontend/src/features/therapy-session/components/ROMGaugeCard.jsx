import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export function ROMGaugeCard({
  romValue = 0.168,
  targetRom = 0.15,
  minVal = 0.06,
  maxVal = 0.2,
  exerciseType = 'finger_spread',
}) {
  const isTargetAchieved =
    exerciseType === 'fist_curl' ? romValue <= targetRom : romValue >= targetRom

  // Calculate percentage along scale for display
  const clampedValue = Math.min(Math.max(romValue, minVal), maxVal)
  const percentFill = Math.round(((clampedValue - minVal) / (maxVal - minVal)) * 100)
  const targetPercent = Math.round(((targetRom - minVal) / (maxVal - minVal)) * 100)

  const unitLabel = exerciseType === 'fist_curl' ? 'Derajat (°)' : 'Skala Bukaan'
  const targetLabel =
    exerciseType === 'fist_curl' ? `<= ${targetRom}°` : `>= ${targetRom.toFixed(3)}`

  return (
    <Card className="shadow-xs border-border">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Rentang Bukaan Jari
            </div>
            <div className="text-xs text-muted-foreground">
              {exerciseType === 'finger_spread'
                ? 'Lebar bukaan kelima jari tangan'
                : exerciseType === 'thumb_to_tips'
                ? 'Jarak sentuhan jempol ke ujung jari'
                : 'Sudut tekukan jari saat mengepal'}
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isTargetAchieved
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-secondary-50 text-secondary-700 border border-secondary-200'
            }`}
          >
            {isTargetAchieved && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
            <span>Target: {targetLabel}</span>
            {isTargetAchieved && <span className="font-bold">(Tercapai!)</span>}
          </div>
        </div>

        {/* Big Metric Display */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight text-foreground font-mono">
            {typeof romValue === 'number' ? romValue.toFixed(3) : romValue}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {unitLabel}
          </span>
        </div>

        {/* Visual Progress Scale */}
        <div className="space-y-1.5 pt-1">
          <div className="relative h-3 w-full bg-secondary-100 rounded-full overflow-hidden">
            {/* Progress Fill */}
            <div
              className={`h-full transition-all duration-150 rounded-full ${
                isTargetAchieved ? 'bg-primary-500' : 'bg-primary-300'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, percentFill))}%` }}
            />

            {/* Target Marker Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-foreground/80 z-10 shadow-xs"
              style={{ left: `${targetPercent}%` }}
              title={`Garis Target: ${targetRom}`}
            />
          </div>

          {/* Scale Labels */}
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
            <span>{minVal} (Min)</span>
            <span className="font-semibold text-foreground">
              Batas Target: {targetRom}
            </span>
            <span>{maxVal} (Maks)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
