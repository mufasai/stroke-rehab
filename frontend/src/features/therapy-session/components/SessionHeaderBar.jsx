import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Activity, Cpu, Hand, CheckCheck, Play, Pause, XCircle, Crosshair } from 'lucide-react'

export function SessionHeaderBar({
  patientName = 'Tn. Budi Santoso',
  rmNumber = 'RM-2024-089',
  affectedHand = 'Kanan',
  exerciseName = 'Finger Spread (Bukaan Jari Tangan)',
  fps = 30,
  latencyMs = 11,
  isCameraActive = true,
  sessionStatus = 'ready',
  currentReps = 0,
  targetReps = 10,
  onStartSession = null,
  onCalibrate = null,
  onTogglePause = null,
  onCancel = null,
  onFinish = null,
}) {
  const isReady = sessionStatus === 'ready'
  const isPaused = sessionStatus === 'paused'

  const handleCancelClick = () => {
    if (!onCancel) return
    if (currentReps > 0) {
      const confirmReset = window.confirm(
        `Terdapat ${currentReps} repetisi yang sudah tercatat. Apakah Anda yakin ingin membatalkan dan mengulang sesi ini dari awal?`
      )
      if (confirmReset) {
        onCancel()
      }
    } else {
      onCancel()
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-3.5 sm:p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Patient and Exercise Identification */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 shrink-0">
            <Hand className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                Sesi Terapi Aktif
              </span>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
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

        {/* Status Indicators & Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs border-t lg:border-t-0 pt-3 lg:pt-0 border-border">
          <div className="flex items-center gap-2 pr-2">
            <Activity className="h-4 w-4 text-emerald-600" />
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

          <div className="flex items-center gap-2 pr-2">
            <Cpu className="h-4 w-4 text-primary-600" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-muted-foreground">
                Respons
              </div>
              <div className="font-medium text-foreground">
                {isCameraActive ? `${latencyMs} ms` : '-'}
              </div>
            </div>
          </div>

          {/* Quick Action Button Group in Header */}
          <div className="h-8 w-px bg-border hidden sm:block" />

          {isReady ? (
            onStartSession && (
              <Button
                type="button"
                disabled={!isCameraActive}
                onClick={onStartSession}
                className={`font-bold text-xs h-9 px-4 shadow-sm flex items-center gap-1.5 shrink-0 transition-all ${
                  isCameraActive
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-[0.98]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60 border border-border'
                }`}
                title={
                  isCameraActive
                    ? 'Mulai penghitungan otomatis 10 repetisi latihan'
                    : 'Nyalakan kamera terlebih dahulu sebelum memulai latihan'
                }
              >
                <Play
                  className={`size-4 ${
                    isCameraActive
                      ? 'fill-white text-white'
                      : 'fill-muted-foreground text-muted-foreground'
                  }`}
                />
                <span>Mulai Hitung</span>
              </Button>
            )
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              {onCalibrate && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCalibrate}
                  className="text-xs h-9 px-2.5 font-semibold text-primary-700 border-primary-200 hover:bg-primary-50"
                  title="Kalibrasi ulang posisi lurus netral (0°)"
                >
                  <Crosshair className="size-3.5 mr-1 text-primary-600" />
                  <span>Set 0°</span>
                </Button>
              )}

              {onTogglePause && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onTogglePause}
                  className={`text-xs h-9 px-3 font-semibold ${
                    isPaused ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600' : ''
                  }`}
                  title={isPaused ? 'Lanjutkan sesi' : 'Jeda sesi'}
                >
                  {isPaused ? (
                    <>
                      <Play className="size-3.5 mr-1 fill-white" />
                      <span>Lanjut</span>
                    </>
                  ) : (
                    <>
                      <Pause className="size-3.5 mr-1 text-amber-600" />
                      <span>Jeda</span>
                    </>
                  )}
                </Button>
              )}

              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelClick}
                  className="text-xs h-9 px-3 font-semibold text-rose-600 border-rose-200 hover:bg-rose-50"
                  title="Batalkan dan ulangi sesi"
                >
                  <XCircle className="size-3.5 mr-1 text-rose-500" />
                  <span>Batal</span>
                </Button>
              )}

              {onFinish && (
                <Button
                  type="button"
                  onClick={onFinish}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs h-9 px-3.5 shadow-sm flex items-center gap-1.5 animate-fade-in"
                  title="Simpan sesi latihan ke rekam medis"
                >
                  <CheckCheck className="size-4" />
                  <span>Simpan</span>
                  <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                    {currentReps}/{targetReps}
                  </span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
