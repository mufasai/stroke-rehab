import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Eye, FileText, User, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const MOCK_SESSIONS = [
  {
    id: 1,
    time: "09:00",
    patientName: "Tn. Budi Santoso",
    age: 62,
    rmNumber: "RM-081",
    hand: "Kanan",
    exercise: "Finger Spread",
    exerciseId: "Jari Merenggang",
    sessionCount: "Sesi ke-4",
    status: "MENUNGGU",
  },
  {
    id: 2,
    time: "10:15",
    patientName: "Ny. Siti Rahma",
    age: 55,
    rmNumber: "RM-042",
    hand: "Kiri",
    exercise: "Fist Curl",
    exerciseId: "Buka-Tutup Kepalan",
    sessionCount: "Sesi ke-2",
    status: "BERLANGSUNG",
  },
  {
    id: 3,
    time: "11:30",
    patientName: "Tn. Hendra Wijaya",
    age: 48,
    rmNumber: "RM-105",
    hand: "Kanan",
    exercise: "Thumb Opposition",
    exerciseId: "Oposisi Ibu Jari",
    sessionCount: "Sesi ke-8",
    status: "SELESAI",
  },
  {
    id: 4,
    time: "14:00",
    patientName: "Ny. Maria Ulfah",
    age: 67,
    rmNumber: "RM-019",
    hand: "Kanan",
    exercise: "Finger Spread",
    exerciseId: "Jari Merenggang",
    sessionCount: "Sesi ke-1",
    status: "TERJADWAL",
  },
]

function getInitials(name) {
  const clean = name.replace(/^(Tn\.|Ny\.|Sdr\.|Sdri\.)\s*/i, "").trim()
  const parts = clean.split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return clean.slice(0, 2).toUpperCase()
}

export function SessionQueueTable() {
  return (
    <div className="w-full overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent border-b border-border/80">
            <TableHead className="w-[120px] font-semibold text-xs uppercase tracking-wider text-muted-foreground pl-6">
              Waktu
            </TableHead>
            <TableHead className="min-w-[200px] font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              Pasien
            </TableHead>
            <TableHead className="w-[130px] font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              Sisi Tangan
            </TableHead>
            <TableHead className="min-w-[180px] font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              Jenis Latihan
            </TableHead>
            <TableHead className="w-[140px] font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="w-[150px] font-semibold text-xs uppercase tracking-wider text-muted-foreground text-right pr-6">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {MOCK_SESSIONS.map((session) => (
            <TableRow
              key={session.id}
              className="border-b border-border/60 hover:bg-muted/40 transition-colors"
            >
              {/* Kolom 1: Jam / Waktu */}
              <TableCell className="pl-6 py-4 font-medium whitespace-nowrap">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary-100 text-secondary-700">
                    <Clock className="size-3.5" />
                  </span>
                  <div>
                    <div className="font-semibold text-foreground text-sm leading-none">
                      {session.time}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 font-normal">
                      WIB
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* Kolom 2: Data Pasien */}
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-desa-foreshadow font-semibold text-xs text-desa-dark-green border border-desa-dark-green/20">
                    {getInitials(session.patientName)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground text-sm truncate">
                      {session.patientName}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <span>{session.age} th</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] bg-muted/60 px-1 py-0.2 rounded">
                        {session.rmNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* Kolom 3: Fokus Tangan / Ekstremitas */}
              <TableCell className="py-4 whitespace-nowrap">
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium text-xs px-2.5 py-0.5 rounded-full border",
                    session.hand === "Kanan"
                      ? "border-primary-200 bg-primary-50/80 text-primary-800"
                      : "border-secondary-200 bg-secondary-50/80 text-secondary-800"
                  )}
                >
                  Tangan {session.hand}
                </Badge>
              </TableCell>

              {/* Kolom 4: Protokol Latihan */}
              <TableCell className="py-4">
                <div className="min-w-0">
                  <div className="font-medium text-foreground text-sm truncate">
                    {session.exercise}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {session.exerciseId} ·{" "}
                    <span className="text-muted-foreground/80">{session.sessionCount}</span>
                  </div>
                </div>
              </TableCell>

              {/* Kolom 5: Status Antrean */}
              <TableCell className="py-4 whitespace-nowrap">
                {session.status === "MENUNGGU" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200/80">
                    <span className="size-1.5 rounded-full bg-warning" />
                    Menunggu
                  </span>
                )}
                {session.status === "BERLANGSUNG" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-desa-foreshadow px-2.5 py-1 text-xs font-semibold text-desa-dark-green border border-desa-dark-green/30">
                    <span className="size-1.5 rounded-full bg-desa-dark-green animate-pulse" />
                    Berlangsung
                  </span>
                )}
                {session.status === "SELESAI" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-100/70 px-2.5 py-1 text-xs font-semibold text-secondary-700 border border-secondary-200">
                    <span className="size-1.5 rounded-full bg-secondary-400" />
                    Selesai
                  </span>
                )}
                {session.status === "TERJADWAL" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                    <span className="size-1.5 rounded-full bg-slate-400" />
                    Terjadwal
                  </span>
                )}
              </TableCell>

              {/* Kolom 6: Aksi */}
              <TableCell className="py-4 pr-6 text-right whitespace-nowrap">
                {session.status === "MENUNGGU" && (
                  <Button
                    size="sm"
                    className="bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-xs gap-1.5 h-8 px-3 text-xs transition-all"
                  >
                    <Play className="size-3 fill-current" />
                    Mulai Terapi
                  </Button>
                )}

                {session.status === "BERLANGSUNG" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-desa-dark-green text-desa-dark-green hover:bg-desa-foreshadow font-medium gap-1.5 h-8 px-3 text-xs transition-all"
                  >
                    <Eye className="size-3.5" />
                    Buka Layar HUD
                  </Button>
                )}

                {session.status === "SELESAI" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border text-foreground hover:bg-secondary-50 font-medium gap-1.5 h-8 px-3 text-xs transition-all"
                  >
                    <FileText className="size-3.5" />
                    Lihat Rekam
                  </Button>
                )}

                {session.status === "TERJADWAL" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary-50 font-medium gap-1.5 h-8 px-3 text-xs transition-all"
                  >
                    <User className="size-3.5" />
                    Detail Profil
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
