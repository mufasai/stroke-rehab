import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Repeat, CheckSquare, AlertTriangle } from 'lucide-react'

export function HistoryStatsCards({
  totalSessions = 48,
  totalRepetitions = 480,
  correctRepetitions = 412,
  compensatoryRepetitions = 68,
}) {
  const correctPercent = Math.round((correctRepetitions / totalRepetitions) * 100)
  const compensatoryPercent = Math.round((compensatoryRepetitions / totalRepetitions) * 100)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Sesi Selesai */}
      <Card className="shadow-xs border-border">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Sesi Selesai
            </div>
            <div className="text-2xl font-black text-foreground mt-0.5">
              {totalSessions}{' '}
              <span className="text-xs font-normal text-muted-foreground">
                Sesi Terapi
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1 font-medium">
              <span className="text-emerald-700 font-bold font-mono">↗</span> +12% dibanding bulan lalu
            </div>
          </div>
          <div className="h-11 w-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Gerakan Latihan */}
      <Card className="shadow-xs border-border">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Gerakan Latihan
            </div>
            <div className="text-2xl font-black text-foreground mt-0.5">
              {totalRepetitions}{' '}
              <span className="text-xs font-normal text-muted-foreground">
                Gerakan
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Rata-rata 10 kali latihan per sesi
            </div>
          </div>
          <div className="h-11 w-11 rounded-xl bg-secondary-100 text-secondary-700 flex items-center justify-center shrink-0">
            <Repeat className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Gerakan Sesuai (Benar) */}
      <Card className="shadow-xs border-border">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Gerakan Sesuai (Benar)
            </span>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              {correctPercent}%
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-700 font-mono">
              {correctRepetitions}
            </span>
            <span className="text-xs text-muted-foreground">Latihan Sah</span>
          </div>

          <div className="h-2 w-full bg-secondary-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${correctPercent}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. Gerakan Miring (Kompensasi) */}
      <Card className="shadow-xs border-border">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
              Gerakan Miring (Kompensasi)
            </span>
            <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
              {compensatoryPercent}%
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-600 font-mono">
              {compensatoryRepetitions}
            </span>
            <span className="text-xs text-muted-foreground">
              Pergelangan Miring
            </span>
          </div>

          <div className="h-2 w-full bg-secondary-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-600 rounded-full"
              style={{ width: `${compensatoryPercent}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
