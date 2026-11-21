import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertTriangle, Activity, FileText } from 'lucide-react'
import { QUALITY_STATUS } from '@/lib/algorithms/exerciseEvaluator'

export function SessionSummaryModal({
  isOpen = false,
  onClose = () => {},
  onConfirmSave = () => {},
  patientName = 'Tn. Budi Santoso',
  exerciseName = 'Finger Spread (Bukaan Jari)',
  history = [],
  therapistNotes = '',
  onChangeNotes = () => {},
}) {
  const totalReps = history.length
  const correctReps = history.filter((r) => r.quality === QUALITY_STATUS.CORRECT).length
  const compensatoryReps = history.filter(
    (r) => r.quality === QUALITY_STATUS.COMPENSATORY
  ).length

  const sumRom = history.reduce((acc, r) => acc + (Number(r.romValue) || 0), 0)
  const averageRom = totalReps > 0 ? (sumRom / totalReps).toFixed(3) : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary-600 mb-1">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Selesai Latihan
            </span>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Ringkasan Latihan Pasien
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Hasil evaluasi latihan untuk {patientName} ({exerciseName})
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 bg-secondary-50 rounded-lg border border-secondary-200">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">
                Total Latihan
              </div>
              <div className="text-2xl font-black text-foreground font-mono mt-0.5">
                {totalReps}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-[10px] uppercase font-bold text-emerald-800">
                Gerakan Benar
              </div>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                {correctReps}
              </div>
            </div>

            <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
              <div className="text-[10px] uppercase font-bold text-rose-800">
                Posisi Miring
              </div>
              <div className="text-2xl font-black text-rose-700 font-mono mt-0.5">
                {compensatoryReps}
              </div>
            </div>
          </div>

          {/* Average ROM & Success Rate */}
          <div className="p-3 bg-card border border-border rounded-lg space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-primary-600" />
                Rata-rata Bukaan Jari:
              </span>
              <span className="font-bold font-mono text-foreground">
                {averageRom}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tingkat Keberhasilan:</span>
              <span className="font-bold text-emerald-700">
                {totalReps > 0 ? Math.round((correctReps / totalReps) * 100) : 0}%
              </span>
            </div>
          </div>

          {/* Therapist Notes Textarea Inside Modal */}
          <div className="space-y-1.5 pt-1">
            <label
              htmlFor="modal-therapist-notes"
              className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5"
            >
              <FileText className="size-3.5 text-primary-600" />
              Catatan Observasi Fisioterapis
            </label>
            <textarea
              id="modal-therapist-notes"
              value={therapistNotes}
              onChange={(e) => onChangeNotes(e.target.value)}
              placeholder="contoh: Pasien mampu membuka jari stabil hingga repetisi ke-8, sedikit tremor di repetisi akhir)"
              rows={3}
              className="w-full text-xs rounded-lg border border-input bg-background p-2.5 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Tutup
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirmSave}
            className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold"
          >
            Simpan ke Rekam Medis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
