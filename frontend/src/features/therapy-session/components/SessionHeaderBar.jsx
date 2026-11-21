import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Cpu, Hand, CheckCheck, Play, Pause, XCircle } from 'lucide-react'

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
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 sm:gap-4">
        {/* Identifikasi Pasien dan Latihan */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 shrink-0">
            <Hand className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-primary-700 bg-primary-50 px-2 py-0.5 rounded shrink-0">
                Sesi Terapi Aktif
              </span>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {patientName}
              </h2>
              <span className="text-xs text-muted-foreground shrink-0">
                (No. RM: {rmNumber})
              </span>
              <Badge variant="outline" className="text-xs font-medium border-primary-300 text-primary-700 shrink-0">
                Tangan {affectedHand}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Program Latihan: <span className="font-medium text-foreground">{exerciseName}</span>
            </p>
          </div>
        </div>

        {/* Indikator Telemetri & Tombol Aksi */}
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2.5 sm:gap-3 text-xs border-t xl:border-t-0 pt-2.5 xl:pt-0 border-border shrink-0 justify-between sm:justify-end">
          {/* Telemetri Kamera & Respons */}
          <div className="flex items-center gap-3 bg-secondary-50/70 border border-border/80 px-3 py-1.5 rounded-lg shrink-0">
            <div>
              <div className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground leading-none">
                Kamera
              </div>
              <div className={`text-xs font-bold leading-tight mt-0.5 ${isCameraActive ? 'text-emerald-700' : 'text-foreground'}`}>
                {isCameraActive ? `${fps} FPS` : 'OFFLINE'}
              </div>
            </div>

            <div className="h-6 w-px bg-border" />

            <div className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-primary-600 shrink-0" />
              <div>
                <div className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground leading-none">
                  Respons
                </div>
                <div className="text-xs font-bold font-mono text-foreground leading-tight mt-0.5">
                  {isCameraActive ? `${latencyMs} ms` : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Kontrol Sesi */}
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
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs h-9 px-3.5 shadow-sm flex items-center gap-1.5 animate-fade-in shrink-0"
                  title="Simpan sesi latihan ke rekam medis"
                >
                  <CheckCheck className="size-4" />
                  <span>Simpan</span>
                  <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px] font-mono">
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
