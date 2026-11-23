import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Crosshair, Minus, Plus, Sparkles } from 'lucide-react'

export function ROMGaugeCard({
  romValue = 0.168,
  targetRom = 0.15,
  minVal = 0.06,
  maxVal = 0.2,
  exerciseType = 'finger_spread',
  onUpdateTarget = null,
  onSetTargetFromCurrent = null,
  isHandDetected = false,
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

  const handleStepTarget = (delta) => {
    if (!onUpdateTarget) return
    const next = Math.max(0.06, Math.min(0.25, targetRom + delta))
    onUpdateTarget(next)
  }

  return (
    <Card className="shadow-xs border-border">
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Rentang Bukaan Jari (ROM)
            </div>
            <div className="text-xs text-muted-foreground">
              {exerciseType === 'finger_spread'
                ? 'Lebar bukaan kelima jari tangan pasien'
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
              className="absolute top-0 bottom-0 w-1.5 bg-emerald-600 z-10 shadow-xs ring-1 ring-white"
              style={{ left: `${Math.max(0, Math.min(100, targetPercent))}%` }}
              title={`Garis Batas Target Pasien: ${targetRom.toFixed(3)}`}
            />
          </div>

          {/* Scale Labels */}
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
            <span>{minVal} (Rileks)</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Batas Target: {targetRom.toFixed(3)}
            </span>
            <span>{maxVal} (Maks)</span>
          </div>
        </div>

        {/* Adaptive Clinical Target Controls */}
        {onUpdateTarget && (
          <div className="pt-2 border-t border-border/70 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-foreground">
                Penyesuaian Target Pasien:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleStepTarget(-0.01)}
                  className="size-6 rounded border border-input bg-background flex items-center justify-center text-xs font-bold hover:bg-secondary-50"
                  title="Turunkan batas target 0.010 jika pasien kesulitan mencapai target"
                >
                  <Minus className="size-3" />
                </button>
                <span className="font-mono font-bold text-xs px-1 text-primary-700">
                  {targetRom.toFixed(3)}
                </span>
                <button
                  type="button"
                  onClick={() => handleStepTarget(0.01)}
                  className="size-6 rounded border border-input bg-background flex items-center justify-center text-xs font-bold hover:bg-secondary-50"
                  title="Naikkan batas target 0.010 bila kemampuan pasien meningkat"
                >
                  <Plus className="size-3" />
                </button>
              </div>
            </div>

            {/* Preset Capability Levels */}
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => onUpdateTarget(0.09)}
                className={`py-1 px-1.5 rounded border text-center transition-colors font-medium ${
                  Math.abs(targetRom - 0.09) < 0.005
                    ? 'bg-primary-100 text-primary-800 border-primary-300 font-bold'
                    : 'bg-background text-muted-foreground border-input hover:bg-secondary-50'
                }`}
                title="Untuk pasien stroke dengan spastisitas atau keterbatasan bukaan jari (fase awal pemulihan)"
              >
                0.090 (Spastik)
              </button>
              <button
                type="button"
                onClick={() => onUpdateTarget(0.12)}
                className={`py-1 px-1.5 rounded border text-center transition-colors font-medium ${
                  Math.abs(targetRom - 0.12) < 0.005
                    ? 'bg-primary-100 text-primary-800 border-primary-300 font-bold'
                    : 'bg-background text-muted-foreground border-input hover:bg-secondary-50'
                }`}
                title="Untuk pasien stroke tahap pemulihan menengah"
              >
                0.120 (Sedang)
              </button>
              <button
                type="button"
                onClick={() => onUpdateTarget(0.15)}
                className={`py-1 px-1.5 rounded border text-center transition-colors font-medium ${
                  Math.abs(targetRom - 0.15) < 0.005
                    ? 'bg-primary-100 text-primary-800 border-primary-300 font-bold'
                    : 'bg-background text-muted-foreground border-input hover:bg-secondary-50'
                }`}
                title="Target standar normal untuk pasien fase mandiri"
              >
                0.150 (Normal)
              </button>
            </div>

            {/* Smart 1-Click Match to Patient's Current Reach */}
            {onSetTargetFromCurrent && (
              <button
                type="button"
                onClick={onSetTargetFromCurrent}
                disabled={!isHandDetected || romValue < 0.06}
                className={`w-full py-1.5 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  isHandDetected && romValue >= 0.06
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-secondary-50 text-muted-foreground border-input opacity-60 cursor-not-allowed'
                }`}
                title="Klik untuk langsung menjadikan bukaan maksimal pasien saat ini sebagai target latihan"
              >
                <Crosshair className="size-3.5 text-emerald-600" />
                <span>
                  {isHandDetected && romValue >= 0.06
                    ? `Set Target ke Bukaan Pasien Terkini (${romValue.toFixed(3)})`
                    : 'Arahkan tangan untuk set target otomatis'}
                </span>
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
