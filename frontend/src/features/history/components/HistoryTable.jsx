import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye, FileCheck2 } from 'lucide-react'

export function HistoryTable({
  sessions = [],
  onSelectSession = () => {},
}) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-4 w-4 text-primary-600" />
          <h3 className="text-sm font-bold text-foreground">
            Data Riwayat Latihan Pasien
          </h3>
          <span className="bg-primary-50 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded border border-primary-200">
            {sessions.length} Sesi Terdata
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          Tersimpan di Browser & Cloud
        </span>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-secondary-50/60 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            <TableRow>
              <TableHead className="w-[140px]">Waktu & Tanggal</TableHead>
              <TableHead className="min-w-[190px]">Nama Pasien</TableHead>
              <TableHead className="min-w-[150px]">Jenis Latihan</TableHead>
              <TableHead className="w-[70px] text-center">Total</TableHead>
              <TableHead className="w-[70px] text-center">Benar</TableHead>
              <TableHead className="w-[80px] text-center">Miring</TableHead>
              <TableHead className="w-[110px]">Rata-rata Bukaan</TableHead>
              <TableHead className="min-w-[220px]">Catatan Fisioterapis</TableHead>
              <TableHead className="w-[120px] text-right pr-4">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs divide-y divide-border/60">
            {sessions.length > 0 ? (
              sessions.map((s) => (
                <TableRow
                  key={s.id}
                  className="hover:bg-secondary-50/40 transition-colors"
                >
                  {/* Date & Time */}
                  <TableCell>
                    <div className="font-semibold text-foreground">{s.date}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {s.timeRange}
                    </div>
                  </TableCell>

                  {/* Patient Name & RM */}
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-primary-100 text-primary-800 font-bold text-[11px] flex items-center justify-center shrink-0">
                        {s.avatarInitials}
                      </div>
                      <div>
                        <div className="font-bold text-foreground flex items-center gap-1.5">
                          <span>{s.patientName}</span>
                          {s.isUserRecorded && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold px-1.5 py-0.2 rounded">
                              Sesi Baru
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {s.patientId} • {s.diagnosis}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Protocol */}
                  <TableCell>
                    <span className="font-medium text-foreground">
                      {s.protocol}
                    </span>
                  </TableCell>

                  {/* Total Reps */}
                  <TableCell className="text-center font-mono font-bold text-foreground">
                    {s.totalReps}
                  </TableCell>

                  {/* Correct */}
                  <TableCell className="text-center font-mono font-bold text-emerald-700">
                    {s.correctReps}
                  </TableCell>

                  {/* Compensatory */}
                  <TableCell className="text-center font-mono font-bold text-rose-600">
                    {s.compensatoryReps}
                  </TableCell>

                  {/* ROM */}
                  <TableCell className="font-mono font-semibold text-foreground">
                    {s.avgRom}
                  </TableCell>

                  {/* Notes */}
                  <TableCell className="text-muted-foreground line-clamp-2 max-w-[280px]">
                    {s.therapistNotes}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right pr-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectSession(s)}
                      className="h-7 px-2.5 text-xs border-primary-200 text-primary-700 hover:bg-primary-50"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Lihat Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-8 text-center text-muted-foreground italic"
                >
                  Tidak ada rekaman sesi yang cocok dengan filter yang dipilih.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <div>Menampilkan halaman 1 dari 10</div>
        <div className="flex items-center gap-1 font-mono">
          <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled>
            Prev
          </Button>
          <Button size="sm" className="h-7 w-7 text-xs p-0 bg-primary-600 text-white">
            1
          </Button>
          <Button variant="outline" size="sm" className="h-7 w-7 text-xs p-0">
            2
          </Button>
          <Button variant="outline" size="sm" className="h-7 w-7 text-xs p-0">
            3
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs px-2">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
