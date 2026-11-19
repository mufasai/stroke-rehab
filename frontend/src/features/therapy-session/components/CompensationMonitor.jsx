import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { QUALITY_STATUS } from '@/lib/algorithms/exerciseEvaluator'

export function CompensationMonitor({
  wristDeviation = 8,
  maxWristThreshold = 25,
  isSymmetric = true,
  history = [],
}) {
  const isWristSafe = wristDeviation <= maxWristThreshold
  const recentReps = [...history].slice(-3).reverse()

  return (
    <Card className="shadow-xs border-border">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Pengawasan Posisi Pergelangan
          </span>
          <span className="text-[10px] font-semibold text-secondary-600 bg-secondary-50 px-2 py-0.5 rounded border border-secondary-200">
            SENSOR KESTABILAN
          </span>
        </div>

        {/* 2 Mini Indicator Columns */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Wrist Deviation Metric */}
          <div className="bg-secondary-50/70 border border-secondary-200/60 rounded-lg p-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Kemiringan Tangan
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-foreground font-mono">
                {wristDeviation}°
              </span>
              <span className="text-[10px] text-muted-foreground">
                (Batas Aman {maxWristThreshold}°)
              </span>
            </div>
            <div
              className={`text-[10px] font-semibold mt-1 ${
                isWristSafe ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {isWristSafe ? 'Sudut Aman' : 'Posisi Miring (>25°)'}
            </div>
          </div>

          {/* Extension Variance Metric */}
          <div className="bg-secondary-50/70 border border-secondary-200/60 rounded-lg p-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Bukaan Antar Jari
            </div>
            <div className="text-lg font-black text-foreground mt-0.5">
              {isSymmetric ? 'Rata' : 'Tidak Rata'}
            </div>
            <div
              className={`text-[10px] font-semibold mt-1 ${
                isSymmetric ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {isSymmetric ? 'Semua Jari Membuka' : 'Sebagian Masih Kaku'}
            </div>
          </div>
        </div>

        {/* Mini Table of Recent 3 Repetitions */}
        <div className="pt-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Riwayat 3 Latihan Terakhir:
          </div>

          {recentReps.length > 0 ? (
            <div className="space-y-1">
              {recentReps.map((rep) => {
                const isCorrect = rep.quality === QUALITY_STATUS.CORRECT
                return (
                  <div
                    key={rep.repNumber}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded bg-secondary-50/50"
                  >
                    <span className="font-mono text-muted-foreground">
                      Latihan #{rep.repNumber}
                    </span>
                    <span
                      className={`font-semibold ${
                        isCorrect ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {isCorrect ? 'Benar' : 'Miring'} (
                      {typeof rep.romValue === 'number'
                        ? rep.romValue.toFixed(3)
                        : rep.romValue}
                      )
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground italic py-1 text-center bg-secondary-50/30 rounded">
              Belum ada latihan selesai
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
