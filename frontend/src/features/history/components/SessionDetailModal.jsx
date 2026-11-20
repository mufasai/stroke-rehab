import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Eye,
} from 'lucide-react'

export function SessionDetailModal({
  isOpen = false,
  onClose = () => {},
  session = null,
  onPrintPdf = () => {},
}) {
  const [activeRepIndex, setActiveRepIndex] = useState(null) // null = Best overall snapshot

  // Reset active rep when session changes or modal opens
  useEffect(() => {
    setActiveRepIndex(null)
  }, [session, isOpen])

  if (!session) return null

  // Determine current image and details to display
  const activeRep =
    activeRepIndex !== null && session.repetitions?.[activeRepIndex]
      ? session.repetitions[activeRepIndex]
      : null

  const displaySnapshot =
    activeRep?.snapshotUrl ||
    session.snapshotUrl ||
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80'

  const isCurrentActiveRepCorrect = activeRep ? activeRep.status === 'correct' : true

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-6 bg-card max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
              Rincian Rekam Terapi {session.id}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {session.date} • {session.timeRange}
            </span>
          </div>

          <DialogTitle className="text-xl font-bold text-foreground mt-1">
            {session.patientName} ({session.patientId})
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Kondisi: {session.diagnosis} • Jenis Latihan: {session.protocol}
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Quick Aggregate Badges */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-secondary-50 border border-secondary-200">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">
                Total Latihan
              </div>
              <div className="text-xl font-black text-foreground font-mono mt-0.5">
                {session.totalReps}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="text-[10px] uppercase font-bold text-emerald-800">
                Benar
              </div>
              <div className="text-xl font-black text-emerald-700 font-mono mt-0.5">
                {session.correctReps}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
              <div className="text-[10px] uppercase font-bold text-rose-800">
                Miring
              </div>
              <div className="text-xl font-black text-rose-700 font-mono mt-0.5">
                {session.compensatoryReps}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-[10px] uppercase font-bold text-blue-800">
                Rata Bukaan
              </div>
              <div className="text-xl font-black text-blue-700 font-mono mt-0.5">
                {session.avgRom.split('/')[0]}
              </div>
            </div>
          </div>

          {/* Interactive Repetition Photo Viewer */}
          <div className="border border-border rounded-xl p-3 bg-secondary-50/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-primary-600" />
                {activeRep ? (
                  <span>
                    Foto Bukti: Latihan #{activeRep.rep}{' '}
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ml-1 ${
                        isCurrentActiveRepCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCurrentActiveRepCorrect ? 'Gerakan Benar' : 'Posisi Miring'}
                    </span>
                  </span>
                ) : (
                  <span>Bukti Foto Bukaan Jari Terbaik</span>
                )}
              </span>

              <Badge
                variant="outline"
                className="text-[10px] bg-white border-primary-200 text-primary-700"
              >
                {session.isUserRecorded ? 'Tersimpan di Browser' : 'Snapshot Arsip'}
              </Badge>
            </div>

            {/* Repetition Selector Buttons */}
            {session.repetitions && session.repetitions.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
                <button
                  type="button"
                  onClick={() => setActiveRepIndex(null)}
                  className={`
                    px-2.5 py-1 rounded-md text-[11px] font-semibold shrink-0 transition-all flex items-center gap-1 border
                    ${
                      activeRepIndex === null
                        ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                        : 'bg-white text-foreground border-border hover:bg-secondary-100'
                    }
                  `}
                >
                  <Sparkles className="size-3" />
                  Foto Terbaik
                </button>

                {session.repetitions.map((r, idx) => {
                  const isSelected = activeRepIndex === idx
                  const isCorrect = r.status === 'correct'
                  return (
                    <button
                      key={r.rep || idx}
                      type="button"
                      onClick={() => setActiveRepIndex(idx)}
                      className={`
                        px-2 py-1 rounded-md text-[11px] font-mono shrink-0 transition-all flex items-center gap-1 border
                        ${
                          isSelected
                            ? 'bg-primary-600 text-white border-primary-600 shadow-xs font-bold'
                            : 'bg-white text-foreground border-border hover:bg-secondary-100'
                        }
                      `}
                      title={`Latihan #${r.rep}: ${isCorrect ? 'Benar' : 'Miring'} (Bukaan ${r.rom})`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      #{r.rep}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Photo Preview Canvas / Image Container */}
            <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-slate-900 border border-border flex items-center justify-center">
              <img
                src={displaySnapshot}
                alt="Hand Therapy Snapshot"
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/75 backdrop-blur-xs text-white text-[11px] px-3 py-1.5 rounded-md font-mono">
                <div>
                  {activeRep ? (
                    <span>
                      Latihan #{activeRep.rep} • Bukaan: {activeRep.rom} • Miring:{' '}
                      {activeRep.wrist}°
                    </span>
                  ) : (
                    <span>
                      Bukaan Terbaik: {session.avgRom.split('/')[0]} • Rata-rata Miring:{' '}
                      {session.wristDeviationAvg}°
                    </span>
                  )}
                </div>
                {activeRep?.timestamp && (
                  <span className="text-[10px] text-slate-300">
                    {activeRep.timestamp}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 10 Repetitions Breakdown Table */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="p-2.5 bg-secondary-50 font-bold text-foreground border-b border-border flex items-center justify-between">
              <span>Rincian {session.repetitions?.length || 10} Kali Latihan Sesi Ini</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                Klik baris untuk melihat foto gerakan
              </span>
            </div>
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-secondary-100/60 text-[10px] uppercase font-mono text-muted-foreground sticky top-0">
                  <tr>
                    <th className="py-1.5 px-3">Latihan</th>
                    <th className="py-1.5 px-3">Bukaan Jari</th>
                    <th className="py-1.5 px-3">Kemiringan Tangan</th>
                    <th className="py-1.5 px-3">Status</th>
                    <th className="py-1.5 px-3 text-right">Foto Bukti</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-mono">
                  {session.repetitions?.map((r, idx) => {
                    const isSelected = activeRepIndex === idx
                    return (
                      <tr
                        key={r.rep || idx}
                        onClick={() => setActiveRepIndex(idx)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-primary-50/80 font-bold'
                            : 'hover:bg-secondary-50/70'
                        }`}
                      >
                        <td className="py-1.5 px-3 font-semibold">
                          Latihan #{r.rep}
                        </td>
                        <td className="py-1.5 px-3">{r.rom}</td>
                        <td className="py-1.5 px-3">{r.wrist}°</td>
                        <td className="py-1.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              r.status === 'correct'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {r.status === 'correct' ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <AlertTriangle className="h-3 w-3" />
                            )}
                            {r.status === 'correct' ? 'BENAR' : 'MIRING'}
                          </span>
                        </td>
                        <td className="py-1.5 px-3 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveRepIndex(idx)
                            }}
                            className={`h-6 px-2 text-[10px] font-sans ${
                              isSelected
                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                : 'text-primary-700 hover:bg-primary-50'
                            }`}
                          >
                            <Eye className="size-3 mr-1" />
                            {isSelected ? 'Ditampilkan' : 'Lihat'}
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Therapist Notes */}
          <div className="p-3 bg-secondary-50/50 rounded-lg border border-border/80">
            <div className="font-semibold text-muted-foreground mb-1">
              Catatan Fisioterapis:
            </div>
            <p className="text-foreground leading-relaxed italic">
              "{session.therapistNotes}"
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0 pt-2 border-t border-border">
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
            onClick={() => onPrintPdf(session)}
            className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold"
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Cetak PDF Sesi Ini
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
