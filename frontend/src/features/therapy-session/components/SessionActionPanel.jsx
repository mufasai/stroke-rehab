import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  Pause,
  CheckCheck,
  XCircle,
  Crosshair,
  Sliders,
} from 'lucide-react'

export function SessionActionPanel({
  sessionStatus = 'ready',
  currentReps = 0,
  targetRepetitions = 10,
  isCameraActive = true,
  onStartSession = () => {},
  onCalibrate = () => {},
  onTogglePause = () => {},
  onCancel = () => {},
  onFinish = () => {},
}) {
  const isReady = sessionStatus === 'ready'
  const isPaused = sessionStatus === 'paused'
  const isRunning = sessionStatus === 'running'

  const handleCancelClick = () => {
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
    <div className="bg-card border-2 border-primary-500/30 rounded-xl p-4 shadow-sm space-y-3 bg-gradient-to-b from-card via-card to-primary-50/15">
      {/* Header Panel Kontrol */}
      <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-primary-100 text-primary-700 flex items-center justify-center">
            <Sliders className="size-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Kontrol Utama Sesi
          </span>
        </div>

        {isReady && (
          <Badge variant="outline" className="text-[11px] font-semibold text-slate-600 bg-slate-100 border-slate-300">
            Siap Dimulai
          </Badge>
        )}
        {isRunning && (
          <Badge className="text-[11px] font-semibold bg-emerald-600 text-white flex items-center gap-1.5 shadow-xs">
            <span className="size-1.5 rounded-full bg-white animate-ping" />
            Latihan Berjalan
          </Badge>
        )}
        {isPaused && (
          <Badge className="text-[11px] font-semibold bg-amber-500 text-white flex items-center gap-1 shadow-xs">
            <Pause className="size-2.5" />
            Sesi Dijeda
          </Badge>
        )}
      </div>

      {/* Control Buttons Area */}
      {isReady ? (
        <div className="space-y-2 pt-1">
          <Button
            type="button"
            size="lg"
            disabled={!isCameraActive}
            onClick={onStartSession}
            className={`w-full h-12 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.99] ${
              isCameraActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60 border border-border'
            }`}
            title={
              isCameraActive
                ? 'Mulai penghitungan otomatis repetisi'
                : 'Nyalakan kamera terlebih dahulu sebelum memulai latihan'
            }
          >
            <Play className={`size-4 shrink-0 ${isCameraActive ? 'fill-white text-white' : 'fill-muted-foreground text-muted-foreground'}`} />
            <span>Mulai Hitung Latihan (Set 0°)</span>
          </Button>
          <p className="text-[11px] text-muted-foreground text-center leading-relaxed px-1">
            {isCameraActive
              ? 'Letakkan telapak tangan lurus di depan webcam, lalu klik tombol di atas untuk mulai menghitung repetisi.'
              : 'Nyalakan kamera webcam terlebih dahulu untuk memulai sesi latihan.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 pt-1">
          {/* Primary Action Button: Simpan & Selesai Terapi */}
          <Button
            type="button"
            size="lg"
            onClick={onFinish}
            className="w-full h-11 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md flex items-center justify-between px-4 transition-transform active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <CheckCheck className="size-4 shrink-0" />
              <span>Simpan & Selesai Terapi</span>
            </div>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-mono font-semibold">
              {currentReps}/{targetRepetitions} Repetisi
            </span>
          </Button>

          {/* Secondary Controls: Jeda/Lanjut and Batal/Ulangi */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onTogglePause}
              className={`text-xs h-9 font-semibold border ${
                isPaused
                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'text-foreground hover:bg-secondary-50 border-input'
              }`}
            >
              {isPaused ? (
                <>
                  <Play className="size-3.5 mr-1.5 fill-white" />
                  Lanjutkan Sesi
                </>
              ) : (
                <>
                  <Pause className="size-3.5 mr-1.5 text-amber-600" />
                  Jeda Sesi
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelClick}
              className="text-xs h-9 font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
            >
              <XCircle className="size-3.5 mr-1.5 text-rose-500" />
              Batal / Ulangi
            </Button>
          </div>

          {/* Neutral Re-Calibration Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCalibrate}
            className="w-full text-xs h-8 text-primary-700 hover:text-primary-800 hover:bg-primary-50 font-medium border border-dashed border-primary-200"
          >
            <Crosshair className="size-3.5 mr-1.5 text-primary-600" />
            Kalibrasi Ulang Posisi Lurus (Set 0°)
          </Button>
        </div>
      )}
    </div>
  )
}
