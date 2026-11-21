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
  let statusText = 'Gerakan Optimal'

  if (quality === 'wrong_hand') {
    bgColor = 'bg-rose-50 border-rose-300 text-rose-950 ring-1 ring-rose-300'
    iconColor = 'text-rose-600'
    Icon = AlertTriangle
    statusText = 'Tangan Salah'
  } else if (quality === QUALITY_STATUS.COMPENSATORY) {
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
      className={`border rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 shadow-xs transition-colors duration-200 ${bgColor}`}
    >
      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        <div className={`p-1.5 rounded-lg bg-white/90 shadow-xs shrink-0 mt-0.5 sm:mt-0 ${iconColor}`}>
          <Icon className="size-5 shrink-0" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">
            Petunjuk Gerakan Langsung
          </div>
          <div className="text-xs sm:text-sm font-semibold leading-snug break-words">
            {feedbackMessage}
          </div>
        </div>
      </div>

      <div className="shrink-0 self-start sm:self-auto pl-9 sm:pl-0">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 border border-current shadow-xs whitespace-nowrap inline-flex items-center">
          {statusText}
        </span>
      </div>
    </div>
  )
}
