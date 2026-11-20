import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Activity, Camera, Cpu, Hand, CheckCheck } from 'lucide-react'

export function SessionHeaderBar({
  patientName = 'Tn. Budi Santoso',
  rmNumber = 'RM-2024-089',
  affectedHand = 'Kanan',
  exerciseName = 'Finger Spread (Bukaan Jari Tangan)',
  fps = 30,
  latencyMs = 11,
  isCameraActive = true,
  cameraName = 'Webcam Meja USB (Top-Down 90°)',
  sessionStatus = 'ready',
  onFinish = null,
  currentReps = 0,
  targetReps = 10,
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Patient and Exercise Identification */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700">
            <Hand className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                Sesi Terapi Aktif
              </span>
              <h2 className="text-lg font-bold text-foreground">
                {patientName}
              </h2>
              <span className="text-xs text-muted-foreground">
                (No. RM: {rmNumber})
              </span>
              <Badge variant="outline" className="text-xs font-medium border-primary-300 text-primary-700">
                Tangan {affectedHand}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Program Latihan: <span className="font-medium text-foreground">{exerciseName}</span>
            </p>
          </div>
        </div>

        {/* Sensor and Engine Status Indicators + Prominent Save Action */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs border-t lg:border-t-0 pt-3 lg:pt-0 border-border">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-success" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-muted-foreground">
                Kamera
              </div>
              <div className="font-medium text-foreground">
                {isCameraActive ? `${fps} FPS` : 'OFFLINE'}
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary-600" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-muted-foreground">
                Respons Sistem
              </div>
              <div className="font-medium text-foreground">
                {isCameraActive ? `${latencyMs} ms` : '-'}
              </div>
            </div>
          </div>

          {/* Prominent Quick-Action Button in Header */}
          {onFinish && sessionStatus !== 'ready' && (
            <>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <Button
                type="button"
                onClick={onFinish}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs h-9 px-4 shadow-sm flex items-center gap-1.5 shrink-0 animate-fade-in"
                title="Simpan sesi latihan dan rincian foto ke rekam medis"
              >
                <CheckCheck className="size-4" />
                <span>Simpan & Selesai Terapi</span>
                <span className="ml-0.5 bg-white/20 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                  {currentReps}/{targetReps}
                </span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
