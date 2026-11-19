import React from 'react'
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react'
import { QUALITY_STATUS } from '@/lib/algorithms/exerciseEvaluator'

export function KinematicFeedbackBanner({
  quality = QUALITY_STATUS.CORRECT,
  feedbackMessage = 'Bukaan jari optimal dan posisi tangan stabil',
  wristDeviation = 8,
}) {
  let bgColor = 'bg-emerald-50 border-emerald-200 text-emerald-900'
  let iconColor = 'text-emerald-600'
  let Icon = CheckCircle2
  let statusText = 'Gerakan Benar'

  if (quality === QUALITY_STATUS.COMPENSATORY) {
    bgColor = 'bg-rose-50 border-rose-200 text-rose-900'
    iconColor = 'text-rose-600'
    Icon = AlertTriangle
    statusText = `Tangan Miring (${wristDeviation}°)`
  } else if (quality === QUALITY_STATUS.INCOMPLETE) {
    bgColor = 'bg-amber-50 border-amber-200 text-amber-900'
    iconColor = 'text-amber-600'
    Icon = AlertCircle
    statusText = 'Kurang Lebar'
  }

  return (
    <div
      className={`border rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-sm transition-colors duration-200 ${bgColor}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg bg-white/80 shadow-sm ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">
            Petunjuk Gerakan Langsung
          </div>
          <div className="text-sm font-semibold">
            {feedbackMessage}
          </div>
        </div>
      </div>

      <div className="hidden sm:block">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/80 border border-current shadow-xs">
          {statusText}
        </span>
      </div>
    </div>
  )
}
