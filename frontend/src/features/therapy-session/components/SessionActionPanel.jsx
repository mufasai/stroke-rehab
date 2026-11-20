import React from 'react'
import { Button } from '@/components/ui/button'
import { Pause, Play, XCircle, CheckCheck, Crosshair } from 'lucide-react'

export function SessionActionPanel({
  therapistNotes = '',
  onChangeNotes = () => {},
  sessionStatus = 'ready',
  onStartSession = () => {},
  onCalibrate = () => {},
  onTogglePause = () => {},
  onCancel = () => {},
  onFinish = () => {},
}) {
  const isReady = sessionStatus === 'ready'
  const isPaused = sessionStatus === 'paused'

  return (
    <div className="space-y-3">
      {/* Therapist Observation Notes */}
      <div className="space-y-1.5">
        <label
          htmlFor="therapist-notes"
          className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block"
        >
          Catatan Observasi Fisioterapis
        </label>
        <textarea
          id="therapist-notes"
          value={therapistNotes}
          onChange={(e) => onChangeNotes(e.target.value)}
          placeholder="Ketik catatan klinis spontan (contoh: Pasien mulai menunjukkan kelelahan pada repetisi ke-6)..."
          rows={3}
          className="w-full text-xs rounded-lg border border-input bg-background p-2.5 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {isReady ? (
          <Button
            type="button"
            size="lg"
            onClick={onStartSession}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm"
          >
            <Play className="h-4 w-4 mr-2 fill-white" />
            Mulai Hitung Latihan (Kunci Posisi Lurus)
          </Button>
        ) : (
          <>
            {/* Primary Action Button placed prominently at top of controls */}
            <Button
              type="button"
              size="lg"
              onClick={onFinish}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md h-11 flex items-center justify-center gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Simpan & Selesai Terapi
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCalibrate}
              className="w-full text-xs h-9 font-semibold border-primary-300 text-primary-700 hover:bg-primary-50"
            >
              <Crosshair className="h-3.5 w-3.5 mr-1.5" />
              Kalibrasi Posisi Lurus (Set 0°)
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onTogglePause}
                className="text-xs h-9 font-semibold"
              >
                {isPaused ? (
                  <>
                    <Play className="h-3.5 w-3.5 mr-1.5 text-emerald-600 fill-emerald-600" />
                    Lanjutkan
                  </>
                ) : (
                  <>
                    <Pause className="h-3.5 w-3.5 mr-1.5 text-secondary-600" />
                    Jeda Sesi
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="text-xs h-9 font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
              >
                <XCircle className="h-3.5 w-3.5 mr-1.5" />
                Ulangi Sesi
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
