import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  FileText,
  Edit3,
  Calendar,
  Users2,
  TrendingUp,
  Play,
  CheckCircle2,
} from 'lucide-react'

export function PatientDetailView({
  patient,
  onBack = () => {},
  onStartTherapy = () => {},
  onPrintPdf = () => {},
}) {
  if (!patient) return null

  const protocols = patient.protocols || {
    fingerSpread: { delta: '+28%', s1: 0.112, s12: 0.168, norm: 0.2 },
    thumbOpposition: { delta: '+19%', s1: 'Jarak 4.2 cm', s12: 'Ujung Jari Menyentuh' },
    fistCurl: { delta: '+32% Sudut Tekuk', s1: 'Tekukan 45°', s12: 'Tekukan 82° (Rapat)' },
  }

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-xs text-muted-foreground hover:text-foreground -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Kembali ke Daftar Pasien
      </Button>

      {/* Patient Header Card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-14 w-14 rounded-xl bg-primary-100 text-primary-800 font-extrabold text-xl flex items-center justify-center border border-primary-200">
                {patient.avatarInitials}
              </div>
              <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 ring-2 ring-card" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-primary-50 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded font-mono border border-primary-200">
                  Pasien {patient.id}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {patient.rmNumber}
                </span>
                <Badge variant="outline" className="text-xs">
                  Tangan {patient.affectedHand}
                </Badge>
              </div>

              <h2 className="text-xl font-bold text-foreground mt-1">
                Perkembangan Terapi: {patient.name}
              </h2>

              <p className="text-xs text-muted-foreground mt-0.5">
                Fisioterapis:{' '}
                <span className="font-semibold text-foreground">
                  {patient.therapist}
                </span>{' '}
                • Program: {patient.program}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-9 text-muted-foreground"
            >
              <Edit3 className="h-3.5 w-3.5 mr-1.5" />
              Ubah Data
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={onPrintPdf}
              className="bg-primary-700 hover:bg-primary-800 text-white text-xs h-9 font-semibold"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Cetak Laporan PDF
            </Button>

            <Button
              size="sm"
              onClick={() => onStartTherapy(patient)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 font-semibold shadow-xs"
            >
              <Play className="h-3.5 w-3.5 mr-1.5 fill-white" />
              Mulai Terapi
            </Button>
          </div>
        </div>
      </div>

      {/* 3 Clinical Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Therapy Session History */}
        <Card className="shadow-xs border-border">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Riwayat Latihan
              </span>
              <Calendar className="h-4 w-4 text-primary-600" />
            </div>

            <div>
              <div className="text-3xl font-black text-foreground font-mono">
                {patient.sessionsCompleted}{' '}
                <span className="text-sm font-normal text-muted-foreground">
                  /{patient.targetSessions} sesi latihan
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Fase Pemulihan Lanjutan • Kehadiran {patient.attendanceRate}
              </p>
            </div>

            <div className="h-2 w-full bg-secondary-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full"
                style={{
                  width: `${(patient.sessionsCompleted / patient.targetSessions) * 100}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Compensation Detection */}
        <Card className="shadow-xs border-border">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Kestabilan Posisi Tangan
              </span>
              <Users2 className="h-4 w-4 text-emerald-600" />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-700 font-mono">
                  {patient.compensationRate}%
                </span>
                <span className="text-xs text-muted-foreground">
                  (Awal {patient.initialCompensationRate}%)
                </span>
              </div>
              <p className="text-xs text-foreground font-medium mt-1">
                Posisi tangan makin stabil, jarang miring (turun 25%)
              </p>
            </div>

            <div className="text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-600" />
              Gerakan tangan makin lurus dan terarah
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Modified Ashworth Scale */}
        <Card className="shadow-xs border-border">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Tingkat Kekakuan Jari (Skala Ashworth)
              </span>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-center flex-1">
                <div className="text-[9px] font-bold uppercase text-rose-700">
                  Awal
                </div>
                <div className="text-lg font-black text-rose-800 mt-0.5">
                  Skala {patient.initialAshworth}
                </div>
              </div>

              <span className="text-muted-foreground font-bold">→</span>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center flex-1">
                <div className="text-[9px] font-bold uppercase text-emerald-700">
                  Saat Ini
                </div>
                <div className="text-lg font-black text-emerald-800 mt-0.5">
                  Skala {patient.currentAshworth}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Catatan: Otot hanya terasa kaku saat jari ditekuk penuh.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3 Kinematic ROM Trend Graphs */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary-600" />
            <h3 className="text-sm font-bold text-foreground">
              Grafik Kemajuan 3 Jenis Latihan Tangan
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-600" />
              Membuka Jari Lebar
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-teal-600" />
              Sentuhan Jempol
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-slate-600" />
              Mengepalkan Tangan
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Chart 1: Finger Spread */}
          <div className="bg-secondary-50/50 border border-secondary-200/60 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase text-muted-foreground">
                  Latihan 1
                </div>
                <div className="text-xs font-bold text-foreground">
                  Membuka Jari Lebar (Finger Spread)
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                {protocols.fingerSpread.delta} Kemajuan
              </Badge>
            </div>

            {/* SVG Trendline Visual */}
            <div className="h-24 w-full flex items-end">
              <svg viewBox="0 0 200 80" className="w-full h-full">
                <defs>
                  <linearGradient id="gradSpread" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 65 Q 50 60, 90 45 T 190 15 L 190 80 L 10 80 Z"
                  fill="url(#gradSpread)"
                />
                <path
                  d="M 10 65 Q 50 60, 90 45 T 190 15"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                />
                <circle cx="10" cy="65" r="4" fill="#047857" />
                <circle cx="190" cy="15" r="5" fill="#047857" />
              </svg>
            </div>

            <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono pt-1 border-t border-border/40">
              <span>Sesi 1: {protocols.fingerSpread.s1}</span>
              <span className="font-bold text-foreground">
                Sesi 12: {protocols.fingerSpread.s12}
              </span>
            </div>
          </div>

          {/* Chart 2: Thumb Opposition */}
          <div className="bg-secondary-50/50 border border-secondary-200/60 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase text-muted-foreground">
                  Latihan 2
                </div>
                <div className="text-xs font-bold text-foreground">
                  Sentuhan Jempol (Oposisi)
                </div>
              </div>
              <Badge className="bg-teal-100 text-teal-800 border-teal-200 text-[10px]">
                {protocols.thumbOpposition.delta} Kemajuan
              </Badge>
            </div>

            {/* SVG Trendline Visual */}
            <div className="h-24 w-full flex items-end">
              <svg viewBox="0 0 200 80" className="w-full h-full">
                <defs>
                  <linearGradient id="gradThumb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 70 Q 60 55, 110 40 T 190 20 L 190 80 L 10 80 Z"
                  fill="url(#gradThumb)"
                />
                <path
                  d="M 10 70 Q 60 55, 110 40 T 190 20"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="3"
                />
                <circle cx="10" cy="70" r="4" fill="#0f766e" />
                <circle cx="190" cy="20" r="5" fill="#0f766e" />
              </svg>
            </div>

            <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono pt-1 border-t border-border/40">
              <span>Sesi 1: {protocols.thumbOpposition.s1}</span>
              <span className="font-bold text-foreground">
                Sesi 12: {protocols.thumbOpposition.s12}
              </span>
            </div>
          </div>

          {/* Chart 3: Fist Curl */}
          <div className="bg-secondary-50/50 border border-secondary-200/60 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase text-muted-foreground">
                  Latihan 3
                </div>
                <div className="text-xs font-bold text-foreground">
                  Mengepalkan Tangan (Fist Curl)
                </div>
              </div>
              <Badge className="bg-slate-100 text-slate-800 border-slate-200 text-[10px]">
                {protocols.fistCurl.delta} Kemajuan
              </Badge>
            </div>

            {/* SVG Trendline Visual */}
            <div className="h-24 w-full flex items-end">
              <svg viewBox="0 0 200 80" className="w-full h-full">
                <defs>
                  <linearGradient id="gradFist" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#475569" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#475569" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 10 68 Q 60 50, 120 35 T 190 12 L 190 80 L 10 80 Z"
                  fill="url(#gradFist)"
                />
                <path
                  d="M 10 68 Q 60 50, 120 35 T 190 12"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="3"
                />
                <circle cx="10" cy="68" r="4" fill="#334155" />
                <circle cx="190" cy="12" r="5" fill="#334155" />
              </svg>
            </div>

            <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono pt-1 border-t border-border/40">
              <span>Sesi 1: {protocols.fistCurl.s1}</span>
              <span className="font-bold text-foreground">
                Sesi 12: {protocols.fistCurl.s12}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Evaluation Notes */}
      <Card className="shadow-xs border-border bg-card">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary-600" />
              Catatan Fisioterapis:
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {patient.evaluationNotes}
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
              Rekomendasi Sesi Berikutnya
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-600 text-white shadow-xs">
              {patient.recommendationLevel}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
