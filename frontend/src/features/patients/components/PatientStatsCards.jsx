import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Users, TrendingUp, Activity, AlertOctagon } from 'lucide-react'

export function PatientStatsCards({
  totalPatients = 18,
  avgProgress = '+18.5%',
  dominantSpasticity = 'Skala 2 – 3',
  needsAttentionCount = 2,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Pasien Aktif */}
      <Card className="shadow-xs border-border">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Pasien Aktif
            </div>
            <div className="text-2xl font-black text-foreground mt-0.5">
              {totalPatients} <span className="text-xs font-normal text-muted-foreground">Pasien</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-700 font-semibold">100%</span> kepatuhan jadwal
            </div>
          </div>
          <div className="h-11 w-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Rata-rata Kemajuan ROM */}
      <Card className="shadow-xs border-border">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Kemajuan Bukaan Jari
            </div>
            <div className="text-2xl font-black text-foreground mt-0.5">
              {avgProgress}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-700 font-semibold font-mono">↑</span> Meningkat dalam 30 hari
            </div>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Spastisitas Dominan */}
      <Card className="shadow-xs border-border">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Kekakuan Terbanyak
            </div>
            <div className="text-2xl font-black text-foreground mt-0.5 whitespace-nowrap">
              {dominantSpasticity}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              Kategori sedang ke kaku (13 pasien)
            </div>
          </div>
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Activity className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* 4. Perlu Pengawasan Kompensasi */}
      <Card className="shadow-xs border-border">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
              Perlu Perhatian
            </div>
            <div className="text-2xl font-black text-rose-600 mt-0.5">
              {needsAttentionCount} <span className="text-xs font-normal text-rose-600/80">Pasien</span>
            </div>
            <div className="text-[11px] text-rose-700 font-medium mt-1">
              Sering miring saat latihan
            </div>
          </div>
          <div className="h-11 w-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertOctagon className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
